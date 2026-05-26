/**
 * LLM Service - Text Generation using OpenAI GPT
 */

import { keyStore } from '@/lib/keyStore';
import { SystemConfig } from '@/types';

export interface LLMResult {
  response: string;
  processingTime: number;
}

export async function processWithLlama(
  text: string,
  config: SystemConfig,
  updateProgress: (progress: number) => void
): Promise<LLMResult> {
  if (keyStore.getMockMode()) {
    // Mock response for testing
    updateProgress(100);
    return {
      response: '[Mock] Enhanced prompt: ' + text,
      processingTime: 0.3,
    };
  }

  const apiKey = keyStore.getOpenAIKey();
  if (!apiKey) {
    return processWithOllamaLocal(text, updateProgress);
  }

  const startTime = performance.now();

  try {
    updateProgress(30);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    updateProgress(100);
    const result = await response.json();
    const processingTime = (performance.now() - startTime) / 1000;

    return {
      response: result.choices?.[0]?.message?.content || 'No response',
      processingTime,
    };
  } catch (error) {
    throw new Error(`LLM processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function processWithOllamaLocal(
  text: string,
  updateProgress: (progress: number) => void
): Promise<LLMResult> {
  const startTime = performance.now();
  updateProgress(20);

  const tagsRes = await fetch('/ollama/api/tags');
  if (!tagsRes.ok) {
    throw new Error('Ollama not available for prompt enhancement');
  }
  const tags = (await tagsRes.json()) as { models?: { name: string }[] };
  const model = tags.models?.[0]?.name ?? 'llama3.1:latest';

  const res = await fetch('/ollama/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: text,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error('Local Ollama prompt enhancement failed');
  }

  const data = (await res.json()) as { response?: string };
  updateProgress(100);
  return {
    response: data.response?.trim() || text,
    processingTime: (performance.now() - startTime) / 1000,
  };
}
