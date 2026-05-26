
// Types for the AI pipeline components

export type PipelineStage = 'idle' | 'whisper' | 'llama' | 'xtts' | 'wav2lip' | 'complete' | 'error';

export interface PipelineState {
  stage: PipelineStage;
  progress: number; // 0-100
  error?: string;
}

export interface WhisperOutput {
  text: string;
  confidence: number;
}

export interface LlamaOutput {
  response: string;
  processingTime: number;
}

export interface XTTSOutput {
  audioUrl: string;
  duration: number;
}

export interface Wav2LipOutput {
  videoUrl: string;
  duration: number;
}

export interface GeneratedImageOutput {
  imageUrl: string;
}

export interface PipelineResult {
  whisper?: WhisperOutput;
  llama?: LlamaOutput;
  xtts?: XTTSOutput;
  wav2lip?: Wav2LipOutput;
  generatedImage?: GeneratedImageOutput;
  totalTime?: number;
  inputDuration?: number; // Added to track original input file duration
}

// Mock API types for UI development
export interface ModelConfig {
  name: string;
  version: string;
  quantized: boolean;
}

export interface SystemConfig {
  whisperModel: ModelConfig;
  llamaModel: ModelConfig;
  xttsModel: ModelConfig;
  wav2lipModel: ModelConfig;
  useParallelization: boolean;
  usePreloadedAvatars: boolean;
  useQueryCache: boolean;
}
