/**
 * Local key store for bring-your-own-key AI services
 * Keys are stored in localStorage (development only, not for production)
 */

const KEY_PREFIX = 'echo_avatar_';

export type ImageProvider = 'auto' | 'ollama' | 'sdwebui' | 'openai';

interface StoredKeys {
  openaiKey: string;
  replicateToken?: string;
  mockMode: boolean;
  imageProvider: ImageProvider;
  ollamaImageModel: string;
}

export const keyStore = {
  /**
   * Get all stored API keys
   */
  getAll(): StoredKeys {
    return {
      openaiKey: localStorage.getItem(`${KEY_PREFIX}openai_key`) || '',
      replicateToken: localStorage.getItem(`${KEY_PREFIX}replicate_token`) || undefined,
      mockMode: localStorage.getItem(`${KEY_PREFIX}mock_mode`) === 'true',
      imageProvider: this.getImageProvider(),
      ollamaImageModel: this.getOllamaImageModel(),
    };
  },

  getImageProvider(): ImageProvider {
    const stored = localStorage.getItem(`${KEY_PREFIX}image_provider`);
    if (stored === 'ollama' || stored === 'sdwebui' || stored === 'openai' || stored === 'auto') {
      return stored;
    }
    return 'auto';
  },

  setImageProvider(provider: ImageProvider): void {
    localStorage.setItem(`${KEY_PREFIX}image_provider`, provider);
  },

  getOllamaImageModel(): string {
    return localStorage.getItem(`${KEY_PREFIX}ollama_image_model`) || 'x/z-image-turbo';
  },

  setOllamaImageModel(model: string): void {
    localStorage.setItem(`${KEY_PREFIX}ollama_image_model`, model.trim() || 'x/z-image-turbo');
  },

  /**
   * Get OpenAI API key
   */
  getOpenAIKey(): string {
    return localStorage.getItem(`${KEY_PREFIX}openai_key`) || '';
  },

  /**
   * Set OpenAI API key
   */
  setOpenAIKey(key: string): void {
    if (key) {
      localStorage.setItem(`${KEY_PREFIX}openai_key`, key);
    }
  },

  /**
   * Get Replicate API token
   */
  getReplicateToken(): string | undefined {
    return localStorage.getItem(`${KEY_PREFIX}replicate_token`) || undefined;
  },

  /**
   * Set Replicate API token
   */
  setReplicateToken(token: string | undefined): void {
    if (token) {
      localStorage.setItem(`${KEY_PREFIX}replicate_token`, token);
    } else {
      localStorage.removeItem(`${KEY_PREFIX}replicate_token`);
    }
  },

  /**
   * Get mock mode toggle
   */
  getMockMode(): boolean {
    const stored = localStorage.getItem(`${KEY_PREFIX}mock_mode`);
    // Prototype default: demo mode on until the user explicitly disables it
    if (stored === null) {
      localStorage.setItem(`${KEY_PREFIX}mock_mode`, 'true');
      return true;
    }
    return stored === 'true';
  },

  /** True when running without real API keys (investor demo / local preview). */
  isPrototypeMode(): boolean {
    return this.getMockMode();
  },

  /**
   * Set mock mode toggle (for testing without burning API credits)
   */
  setMockMode(enabled: boolean): void {
    if (enabled) {
      localStorage.setItem(`${KEY_PREFIX}mock_mode`, 'true');
    } else {
      localStorage.removeItem(`${KEY_PREFIX}mock_mode`);
    }
  },

  /**
   * Check if keys are configured
   */
  isConfigured(): boolean {
    if (this.getMockMode()) return true;
    return !!this.getOpenAIKey();
  },

  /** Text-to-image can run on local Ollama / SD without cloud keys. */
  isConfiguredForImage(): boolean {
    if (this.getImageProvider() === 'openai' && this.getOpenAIKey()) return true;
    if (this.getImageProvider() === 'ollama' || this.getImageProvider() === 'sdwebui') return true;
    if (this.getImageProvider() === 'auto') return true;
    return !!this.getOpenAIKey();
  },

  /**
   * Clear all stored keys
   */
  clear(): void {
    localStorage.removeItem(`${KEY_PREFIX}openai_key`);
    localStorage.removeItem(`${KEY_PREFIX}replicate_token`);
    localStorage.removeItem(`${KEY_PREFIX}mock_mode`);
    localStorage.removeItem(`${KEY_PREFIX}image_provider`);
    localStorage.removeItem(`${KEY_PREFIX}ollama_image_model`);
  },
};
