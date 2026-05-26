/**
 * Whisper Service - Speech to Text using OpenAI API
 */

import { keyStore } from '@/lib/keyStore';

export interface WhisperResult {
  text: string;
  language?: string;
  latency: number;
}

export async function processWithWhisper(
  file: File,
  updateProgress: (progress: number) => void,
): Promise<WhisperResult> {
  if (keyStore.getMockMode()) {
    // Mock response for testing
    updateProgress(100);
    return {
      text: '[Mock] Transcribed audio: "Hello, this is a test audio file for transcription."',
      language: 'en',
      latency: 0.5,
    };
  }

  const apiKey = keyStore.getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Enable Demo Mode in Settings or add a key.');
  }

  const startTime = performance.now();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-1');

  try {
    updateProgress(30);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Whisper API error');
    }

    updateProgress(100);
    const result = await response.json();
    const latency = (performance.now() - startTime) / 1000;

    return {
      text: result.text,
      language: result.language,
      latency,
    };
  } catch (error) {
    throw new Error(`Whisper transcription failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
