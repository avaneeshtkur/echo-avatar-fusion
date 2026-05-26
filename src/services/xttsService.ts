/**
 * TTS Service - Text to Speech using OpenAI API
 */

import { keyStore } from '@/lib/keyStore';
import { SystemConfig } from '@/types';

export interface TTSResult {
  audioUrl: string;
  duration: number;
}

export async function processWithXTTS(
  text: string,
  config: SystemConfig,
  updateProgress: (progress: number) => void,
  customVoice: boolean = false
): Promise<TTSResult> {
  if (keyStore.getMockMode()) {
    // Mock response for testing
    updateProgress(100);
    return {
      audioUrl: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA',
      duration: 3.0,
    };
  }

  const apiKey = keyStore.getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Enable Demo Mode in Settings or add a key.');
  }

  const startTime = performance.now();

  try {
    updateProgress(30);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: customVoice ? 'nova' : 'alloy',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI TTS API error');
    }

    updateProgress(70);
    
    // Convert audio response to blob and create URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const duration = (performance.now() - startTime) / 1000;

    updateProgress(100);

    return {
      audioUrl,
      duration,
    };
  } catch (error) {
    throw new Error(`TTS processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
