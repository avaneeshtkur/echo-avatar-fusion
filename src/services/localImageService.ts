/**
 * Local text-to-image via Ollama (experimental) or AUTOMATIC1111 WebUI.
 */

import { keyStore } from '@/lib/keyStore';

const OLLAMA_API = '/ollama';

export type ImageProvider = 'auto' | 'ollama' | 'sdwebui' | 'openai';

export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_API}/api/tags`, {
      signal: AbortSignal.timeout(4000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function listOllamaModels(): Promise<string[]> {
  const res = await fetch(`${OLLAMA_API}/api/tags`);
  if (!res.ok) return [];
  const data = (await res.json()) as { models?: { name: string }[] };
  return (data.models ?? []).map((m) => m.name);
}

/** Prefer configured model, else first name that looks like an image model. */
function isImageModelName(name: string): boolean {
  return (
    /flux|z-image|stable-diffusion|sdxl|dall|image/i.test(name) ||
    name.startsWith('x/')
  );
}

export async function getOllamaImageModelStatus(): Promise<{
  running: boolean;
  models: string[];
  imageModels: string[];
  hasImageModel: boolean;
  recommendedModel: string;
}> {
  try {
    const res = await fetch('/api/local/ollama-status');
    if (res.ok) {
      return (await res.json()) as {
        running: boolean;
        models: string[];
        imageModels: string[];
        hasImageModel: boolean;
        recommendedModel: string;
      };
    }
  } catch {
    // dev server endpoint optional in production preview
  }

  const models = await listOllamaModels();
  const imageModels = models.filter(isImageModelName);
  return {
    running: models.length > 0,
    models,
    imageModels,
    hasImageModel: imageModels.length > 0,
    recommendedModel: keyStore.getOllamaImageModel(),
  };
}

export async function pullOllamaImageModel(): Promise<{ ok: boolean; message?: string; error?: string }> {
  const res = await fetch('/api/local/ollama-pull', { method: 'POST' });
  return res.json();
}

export async function resolveOllamaImageModel(): Promise<string> {
  const configured = keyStore.getOllamaImageModel();
  const models = await listOllamaModels();
  if (models.length === 0) {
    throw new Error(
      'Ollama is not running. Start the Ollama app, then install an image model from Settings.'
    );
  }

  const configuredMatch = models.find(
    (m) => m === configured || m.startsWith(`${configured}:`)
  );
  if (configuredMatch) {
    return configuredMatch;
  }

  const imageLike = models.find(isImageModelName);
  if (imageLike) {
    return imageLike;
  }

  throw new Error(
    `No image model installed (found: ${models.join(', ')}). ` +
      `In Settings, click "Install image model" or run: ollama pull ${configured}`
  );
}

export async function generateWithOllama(
  prompt: string,
  updateProgress: (progress: number) => void
): Promise<string> {
  const model = await resolveOllamaImageModel();
  updateProgress(15);

  const res = await fetch(`${OLLAMA_API}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      width: 1024,
      height: 1024,
      steps: 20,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { error?: string }).error ??
      `Ollama request failed (${res.status}). Is Ollama running? Try: ollama pull ${model}`;
    throw new Error(message);
  }

  updateProgress(85);
  const data = (await res.json()) as {
    image?: string;
    response?: string;
    done?: boolean;
  };

  if (!data.image) {
    throw new Error(
      data.response
        ? `Model "${model}" returned text, not an image. Pull an image model, e.g. ollama pull x/z-image-turbo`
        : `No image data from Ollama (model: ${model})`
    );
  }

  updateProgress(100);
  return `data:image/png;base64,${data.image}`;
}

export async function generateWithSdWebUi(
  prompt: string,
  updateProgress: (progress: number) => void
): Promise<string> {
  updateProgress(20);

  const res = await fetch('/sdapi/v1/txt2img', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      steps: 25,
      width: 512,
      height: 512,
      cfg_scale: 7,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Stable Diffusion WebUI is not reachable (${res.status}). Start it with --api on http://127.0.0.1:7860`
    );
  }

  const data = (await res.json()) as { images?: string[] };
  const b64 = data.images?.[0];
  if (!b64) {
    throw new Error('WebUI returned no images');
  }

  updateProgress(100);
  return `data:image/png;base64,${b64}`;
}

export async function generateImageLocally(
  prompt: string,
  updateProgress: (progress: number) => void
): Promise<string> {
  const provider = keyStore.getImageProvider();
  const errors: string[] = [];

  const tryOllama = provider === 'auto' || provider === 'ollama';
  const trySd = provider === 'auto' || provider === 'sdwebui';

  if (tryOllama) {
    const available = await checkOllamaAvailable();
    if (available) {
      try {
        return await generateWithOllama(prompt, updateProgress);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(msg);
        if (provider === 'ollama') throw e;
      }
    } else if (provider === 'ollama') {
      throw new Error(
        'Ollama is not running. Start Ollama, then run: ollama pull x/z-image-turbo'
      );
    }
  }

  if (trySd) {
    try {
      return await generateWithSdWebUi(prompt, updateProgress);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(msg);
      if (provider === 'sdwebui') throw e;
    }
  }

  throw new Error(
    errors.length > 0
      ? errors.join(' — ')
      : 'No local image backend found. Start Ollama (ollama pull x/z-image-turbo) or SD WebUI with --api.'
  );
}
