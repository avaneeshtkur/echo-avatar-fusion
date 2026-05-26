/**
 * Demo Service - Mock pipeline for testing UI without API calls
 * Used when mock mode is enabled in Settings
 */

import { keyStore } from '@/lib/keyStore';
import { DEMO_VIDEO_URL } from '@/config/demoAssets';
import { PipelineResult } from '@/types';

export async function runDemoPipeline(
  file: File,
  avatarFile: File | null,
  updateProgress: (stage: string, progress: number) => void
): Promise<PipelineResult> {
  if (!file) {
    throw new Error('No input file provided');
  }

  // Only run demo if mock mode is enabled
  if (!keyStore.getMockMode()) {
    throw new Error('Demo mode is disabled. Enable it in Settings to use mock pipeline.');
  }

  let result: PipelineResult = {};

  try {
    // Simulate Whisper
    updateProgress('whisper', 0);
    await sleep(500);
    updateProgress('whisper', 100);

    const whisperResult = {
      text: '[Mock] Transcribed text: "This is a demo audio for testing purposes"',
      latency: 0.5,
    };
    result = { ...result, whisper: whisperResult };

    // Simulate LLaMA
    updateProgress('llama', 0);
    await sleep(800);
    updateProgress('llama', 100);

    const llamaResult = {
      response: '[Mock] Enhanced response from LLaMA: Your input has been processed by the mock pipeline.',
      processingTime: 0.8,
    };
    result = { ...result, llama: llamaResult };

    // Simulate XTTS
    updateProgress('xtts', 0);
    await sleep(600);
    updateProgress('xtts', 100);

    const xttsResult = {
      audioUrl: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA',
      duration: 3.0,
      latency: 0.6,
    };
    result = { ...result, xtts: xttsResult };

    // Simulate Wav2Lip
    updateProgress('wav2lip', 0);
    await sleep(1000);
    updateProgress('wav2lip', 100);

    const wav2lipResult = {
      videoUrl: DEMO_VIDEO_URL,
      duration: 5.0,
    };
    result = { ...result, wav2lip: wav2lipResult, totalTime: 3.4 };

    return result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Demo pipeline error');
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
