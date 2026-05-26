
// Local API configuration for Echo Avatar Fusion
// All services use bring-your-own-key with OpenAI and other public APIs

export const API_ENDPOINTS = {
  // OpenAI API endpoints (all CORS-enabled, browser-callable)
  openai: {
    whisper: 'https://api.openai.com/v1/audio/transcriptions',
    chat: 'https://api.openai.com/v1/chat/completions',
    tts: 'https://api.openai.com/v1/audio/speech',
    imageGeneration: 'https://api.openai.com/v1/images/generations',
  },
  
  // Replicate API endpoints (requires proxy for browser usage - see videoService)
  replicate: {
    webhookPrefix: 'https://api.replicate.com',
  },
};

// Export default empty config - keys are stored in localStorage
export const API_KEY = '';
