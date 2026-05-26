import { useState, useCallback } from 'react';
import { PipelineStage, PipelineState, PipelineResult, SystemConfig } from '@/types/';
import { toast } from 'sonner';
import { defaultConfig } from '@/config/system';
import { getFileDuration } from '@/services/api';
import { processWithWhisper } from '@/services/whisperService';
import { processWithLlama } from '@/services/llamaService';
import { processWithXTTS } from '@/services/xttsService';
import { generateVideo, fetchAudioBlob } from '@/services/videoService';
import { generateContent } from '@/services/generativeService';
import { keyStore } from '@/lib/keyStore';
import { isLoggedIn } from '@/lib/authStorage';
import { historyStore } from '@/lib/historyStore';

const initialPipelineState: PipelineState = {
  stage: 'idle',
  progress: 0,
};

function saveToHistory(
  input: string,
  type: 'image' | 'video' | 'audio',
  outputUrl: string,
  processingTime: number,
  status: 'success' | 'error' = 'success',
  error?: string
) {
  historyStore.add({
    type,
    input,
    outputUrl,
    status,
    processingTime,
    error,
  });
}

export function usePipeline() {
  const [state, setState] = useState<PipelineState>(initialPipelineState);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [outputType, setOutputType] = useState<'video' | 'image'>('video');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [inputDuration, setInputDuration] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);
  
  const resetPipeline = useCallback(() => {
    setState(initialPipelineState);
    setResult(null);
  }, []);

  const updateProgress = useCallback((stage: PipelineStage, progress: number) => {
    setState({ stage, progress });
  }, []);

  const handleError = useCallback((error: string, inputLabel = 'Pipeline run') => {
    setState({ stage: 'error', progress: 0, error });
    saveToHistory(inputLabel, 'video', '', 0, 'error', error);
    toast.error('Pipeline Error', {
      description: error,
    });
  }, []);

  const processTextInput = useCallback(async (text: string, type: 'image' | 'video', avatarRef?: File) => {
    const pipelineStartTime = performance.now();
    
    try {
      let enhancedPrompt = text;

      if (type === 'image') {
        // Optional prompt polish — skip if it would block local-only image runs
        if (!keyStore.getMockMode() && (keyStore.getOpenAIKey() || keyStore.getImageProvider() === 'openai')) {
          setState({ stage: 'llama', progress: 0 });
          try {
            const llamaResult = await processWithLlama(
              `Enhance this prompt for AI image generation. Keep it concise and visual: ${text}`,
              config,
              (progress) => updateProgress('llama', progress)
            );
            enhancedPrompt = llamaResult.response;
            setResult(prev => ({ ...prev, llama: llamaResult }));
          } catch (error) {
            console.warn('Prompt enhancement skipped:', error);
          }
        }
      } else {
        setState({ stage: 'llama', progress: 0 });
        try {
          const llamaResult = await processWithLlama(
            `Enhance this prompt for ${type} generation: ${text}`,
            config,
            (progress) => updateProgress('llama', progress)
          );
          enhancedPrompt = llamaResult.response;
          setResult(prev => ({ ...prev, llama: llamaResult }));
        } catch (error) {
          console.warn('LLaMA enhancement failed, using original text:', error);
        }
      }
      
      setState({ stage: type === 'image' ? 'xtts' : 'wav2lip', progress: 0 });
      
      const contentResult = await generateContent(
        enhancedPrompt,
        type,
        avatarRef || null,
        config,
        (progress) => updateProgress(type === 'image' ? 'xtts' : 'wav2lip', progress)
      );
      
      const pipelineEndTime = performance.now();
      const totalPipelineTime = (pipelineEndTime - pipelineStartTime) / 1000;
      setTotalLatency(totalPipelineTime);
      
      if (type === 'image') {
        setResult(prev => ({ 
          ...prev, 
          generatedImage: { imageUrl: contentResult.url },
          totalTime: totalPipelineTime
        }));
        saveToHistory(text, 'image', contentResult.url, totalPipelineTime);
      } else {
        setResult(prev => ({ 
          ...prev, 
          wav2lip: { 
            videoUrl: contentResult.url,
            duration: contentResult.duration || 5
          },
          totalTime: totalPipelineTime
        }));
        saveToHistory(text, 'video', contentResult.url, totalPipelineTime);
      }
      
      setState({ stage: 'complete', progress: 100 });
      
      toast.success('Processing Complete', {
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} generated in ${totalPipelineTime.toFixed(1)}s`
      });
      
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error occurred', text);
    }
  }, [config, handleError, updateProgress]);

  const processImageToVideo = useCallback(async (imageFile: File, avatarRef?: File) => {
    const pipelineStartTime = performance.now();
    const label = `Image to video: ${imageFile.name}`;

    try {
      setState({ stage: 'llama', progress: 0 });
      const llamaResult = await processWithLlama(
        `Create a talking-head video from this reference image: ${imageFile.name}`,
        config,
        (progress) => updateProgress('llama', progress)
      );
      setResult({ llama: llamaResult });

      setState({ stage: 'xtts', progress: 0 });
      const xttsResult = await processWithXTTS(
        llamaResult.response,
        config,
        (progress) => updateProgress('xtts', progress),
        !!avatarRef
      );
      setResult(prev => ({ ...prev, xtts: xttsResult }));

      setState({ stage: 'wav2lip', progress: 0 });
      const audioBlob = await fetchAudioBlob(xttsResult.audioUrl);
      const wav2lipResult = await generateVideo(
        xttsResult.audioUrl,
        audioBlob,
        avatarRef || imageFile,
        config,
        (progress) => updateProgress('wav2lip', progress)
      );

      const totalPipelineTime = (performance.now() - pipelineStartTime) / 1000;
      setTotalLatency(totalPipelineTime);
      setResult(prev => ({
        ...prev,
        wav2lip: wav2lipResult,
        totalTime: totalPipelineTime,
      }));
      setState({ stage: 'complete', progress: 100 });
      saveToHistory(label, 'video', wav2lipResult.videoUrl, totalPipelineTime);
      toast.success('Processing Complete', {
        description: `Video generated in ${totalPipelineTime.toFixed(1)}s`,
      });
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error occurred', label);
    }
  }, [config, handleError, updateProgress]);

  const processFileInput = useCallback(async (file: File, avatarRef?: File) => {
    if (!file) {
      handleError('No input file provided');
      return;
    }

    if (file.type.startsWith('image/')) {
      await processImageToVideo(file, avatarRef);
      return;
    }

    const pipelineStartTime = performance.now();
    const inputLabel = file.name;

    try {
      const duration = await getFileDuration(file);
      setInputDuration(duration);
      
      setState({ stage: 'whisper', progress: 0 });
      
      const whisperResult = await processWithWhisper(
        file, 
        (progress) => updateProgress('whisper', progress)
      );
      
      setResult(prev => ({ ...prev, whisper: { ...whisperResult, confidence: 0.95 } }));
      
      setState({ stage: 'llama', progress: 0 });
      
      const llamaResult = await processWithLlama(
        whisperResult.text,
        config,
        (progress) => updateProgress('llama', progress)
      );
      
      setResult(prev => ({ ...prev, llama: llamaResult }));
      
      setState({ stage: 'xtts', progress: 0 });
      
      const xttsResult = await processWithXTTS(
        llamaResult.response,
        config,
        (progress) => updateProgress('xtts', progress),
        !!avatarRef
      );
      
      setResult(prev => ({ ...prev, xtts: xttsResult }));
      
      setState({ stage: 'wav2lip', progress: 0 });
      
      const audioBlob = await fetchAudioBlob(xttsResult.audioUrl);
      
      const wav2lipResult = await generateVideo(
        xttsResult.audioUrl,
        audioBlob,
        avatarRef || null,
        config,
        (progress) => updateProgress('wav2lip', progress),
        4.0
      );
      
      const totalPipelineTime = (performance.now() - pipelineStartTime) / 1000;
      setTotalLatency(totalPipelineTime);
      
      setResult(prev => ({ 
        ...prev, 
        wav2lip: wav2lipResult,
        totalTime: totalPipelineTime,
        inputDuration: duration
      }));
      
      setState({ stage: 'complete', progress: 100 });
      
      // Store in history
      historyStore.add({
        type: 'video',
        input: `Audio/Video file (${inputFile.name})`,
        outputUrl: wav2lipResult.videoUrl,
        status: 'success',
        processingTime: totalPipelineTime,
      });
      
      toast.success('Processing Complete', {
        description: `Response generated in ${totalPipelineTime.toFixed(1)}s`
      });
      
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [handleError, updateProgress, config, processImageToVideo]);

  const startPipeline = useCallback(async () => {
    if (!isLoggedIn()) {
      handleError('You need to be logged in to use the pipeline');
      return;
    }

    const hasText = Boolean(inputText.trim());
    if (hasText && outputType === 'image') {
      if (!keyStore.isConfiguredForImage()) {
        handleError('Configure local image generation in Settings (Ollama or SD WebUI)');
        return;
      }
    } else if (!keyStore.isConfigured()) {
      handleError('Enable Demo Mode in Settings or add your OpenAI API key');
      return;
    }
    
    if (hasText) {
      await processTextInput(inputText.trim(), outputType, avatarFile || undefined);
      return;
    }
    
    if (!inputFile) {
      handleError('Add a text prompt, audio/video file, or image to generate');
      return;
    }
    
    await processFileInput(inputFile, avatarFile || undefined);
    
  }, [inputFile, avatarFile, inputText, outputType, processFileInput, processTextInput, handleError]);

  return {
    state,
    result,
    config,
    inputFile,
    avatarFile,
    inputText,
    outputType,
    inputDuration,
    totalLatency,
    isPrototypeMode: keyStore.isPrototypeMode(),
    setInputFile,
    setAvatarFile,
    setInputText,
    setOutputType,
    setConfig,
    startPipeline,
    resetPipeline
  };
}
