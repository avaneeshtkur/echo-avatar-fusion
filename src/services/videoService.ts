/**
 * Video Service - Wav2Lip Video Generation (requires backend or Replicate)
 * For local development, this returns audio-only output with a message
 */

import { keyStore } from '@/lib/keyStore';
import { DEMO_VIDEO_URL } from '@/config/demoAssets';
import { SystemConfig } from '@/types';

export interface Wav2LipResult {
  videoUrl: string;
  duration: number;
}

export async function generateVideo(
  audioUrl: string,
  audioBlob: Blob,
  avatarFile: File | null,
  config: SystemConfig,
  updateProgress: (progress: number) => void,
  remainingLatencyBudget: number = 2.0
): Promise<Wav2LipResult> {
  updateProgress(10);

  try {
    const replicateToken = keyStore.getReplicateToken();
    const mockMode = keyStore.getMockMode();

    // For local browser usage, video generation is stubbed
    // A real implementation would require either:
    // 1. A backend proxy to handle Replicate API calls (CORS restriction)
    // 2. A local Wav2Lip server running on localhost:5000

    if (mockMode) {
      updateProgress(100);
      return {
        videoUrl: DEMO_VIDEO_URL,
        duration: 5.0,
      };
    }

    // Return audio-only result with warning
    console.warn(
      'Video generation (Wav2Lip) is not available in browser-only mode. ' +
      'To enable video generation, either: ' +
      '1. Set up a local Wav2Lip server at localhost:5000, or ' +
      '2. Deploy a backend proxy for Replicate API calls.'
    );

    updateProgress(100);

    // Return the audio URL as fallback (audio-only generation)
    return {
      videoUrl: audioUrl, // Return audio instead
      duration: 5.0,
    };
  } catch (error) {
    throw new Error(`Video generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function fetchAudioBlob(audioUrl: string): Promise<Blob> {
  try {
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio with status ${audioResponse.status}`);
    }
    return await audioResponse.blob();
  } catch (error) {
    console.error('Error fetching audio blob:', error);
    throw new Error(`Failed to fetch audio: ${error instanceof Error ? error.message : String(error)}`);
  }
}
