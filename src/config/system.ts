
import { SystemConfig } from '@/types';

// Default system configuration for Echo Avatar Fusion platform
export const defaultConfig: SystemConfig = {
  whisperModel: { name: 'Whisper', version: 'large-v3', quantized: true },
  llamaModel: { name: 'LLaMA', version: '3-70B', quantized: true },
  xttsModel: { name: 'Coqui XTTS', version: 'v2', quantized: false },
  wav2lipModel: { name: 'SadTalker', version: '1.0', quantized: false },
  useParallelization: true,
  usePreloadedAvatars: true,
  useQueryCache: true,
};
