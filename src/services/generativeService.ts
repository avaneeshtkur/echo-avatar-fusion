/**
 * Generative Service - Image and Video Generation
 */

import { keyStore } from '@/lib/keyStore';
import { DEMO_VIDEO_URL } from '@/config/demoAssets';
import { generateImageLocally } from '@/services/localImageService';
import { SystemConfig } from '@/types/';

export interface GenerativeResponse {
  url: string;
  duration?: number;
  source?: 'ollama' | 'sdwebui' | 'openai' | 'mock';
}

export async function generateContent(
  prompt: string,
  type: 'image' | 'video',
  avatarFile: File | null,
  config: SystemConfig,
  updateProgress: (progress: number) => void
): Promise<GenerativeResponse> {
  if (type === 'image') {
    return generateImage(prompt, updateProgress, avatarFile);
  }
  return generateVideo(prompt, avatarFile, updateProgress);
}

async function generateImageOpenAI(
  prompt: string,
  updateProgress: (progress: number) => void
): Promise<GenerativeResponse> {
  const apiKey = keyStore.getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured.');
  }

  updateProgress(30);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error((error as { error?: { message?: string } }).error?.message || 'OpenAI Images API error');
  }

  updateProgress(80);
  const result = await response.json();
  const remoteUrl = (result as { data?: { url?: string }[] }).data?.[0]?.url;

  if (!remoteUrl) {
    throw new Error('OpenAI returned no image URL');
  }

  // Persist as blob URL so history/downloads work after remote URL expires
  const imageRes = await fetch(remoteUrl);
  const blob = await imageRes.blob();
  updateProgress(100);

  return {
    url: URL.createObjectURL(blob),
    duration: 0,
    source: 'openai',
  };
}

async function generateImage(
  prompt: string,
  updateProgress: (progress: number) => void,
  _avatarFile: File | null = null
): Promise<GenerativeResponse> {
  const provider = keyStore.getImageProvider();

  // Cloud-only provider
  if (provider === 'openai') {
    return generateImageOpenAI(prompt, updateProgress);
  }

  // Local generation (default for auto / ollama / sdwebui)
  try {
    updateProgress(5);
    const url = await generateImageLocally(prompt, updateProgress);
    return { url, duration: 0, source: 'ollama' };
  } catch (localError) {
    const openaiKey = keyStore.getOpenAIKey();
    if (provider !== 'auto' || !openaiKey) {
      throw new Error(
        localError instanceof Error
          ? localError.message
          : 'Local image generation failed'
      );
    }
    console.warn('Local image generation failed, trying OpenAI:', localError);
    return generateImageOpenAI(prompt, updateProgress);
  }
}

async function generateVideo(
  _prompt: string,
  _avatarFile: File | null,
  updateProgress: (progress: number) => void
): Promise<GenerativeResponse> {
  if (keyStore.getMockMode()) {
    updateProgress(100);
    return {
      url: DEMO_VIDEO_URL,
      duration: 5.0,
      source: 'mock',
    };
  }

  updateProgress(100);
  return {
    url: DEMO_VIDEO_URL,
    duration: 5.0,
    source: 'mock',
  };
}
