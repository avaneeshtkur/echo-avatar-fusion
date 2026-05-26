# Configuration Reference

Echo Avatar Fusion stores all configuration in browser `localStorage` under the `echo_avatar_` prefix.

## Settings Available

### Image Generation Provider

| Provider | Value | Requirement | Best For |
|----------|-------|-------------|----------|
| Auto | `auto` | None (tries all) | Production - auto-detects best available |
| Ollama | `ollama` | Ollama running locally | Private local generation |
| SD WebUI | `sdwebui` | SD WebUI with --api on port 7860 | Alternative local option |
| OpenAI | `openai` | OpenAI API key | Cloud-based high quality |

**Storage Key**: `echo_avatar_image_provider`

### Ollama Image Model

**Storage Key**: `echo_avatar_ollama_image_model`
**Default**: `x/z-image-turbo`

Supported models:
- `x/z-image-turbo` - Fast, small (2GB), good quality
- `dall-e-3:latest` - High quality, large (10GB), slow
- `dall-e-2:latest` - Very good quality, medium (5GB)
- `stable-diffusion` - General purpose (4GB)
- Any GGML quantized image model

Pull new models:
```bash
ollama pull x/z-image-turbo
ollama list
```

### OpenAI API Key

**Storage Key**: `echo_avatar_openai_key`

Used for:
- Speech-to-Text (Whisper)
- Text Enhancement (GPT-3.5/GPT-4)
- Text-to-Speech (TTS)
- Image fallback (when local services unavailable)

Get key: https://platform.openai.com/api-keys

### Replicate API Token

**Storage Key**: `echo_avatar_replicate_token`

Used for:
- Video generation (Wav2Lip lip-sync)

Get token: https://replicate.com/api

### Mock Mode

**Storage Key**: `echo_avatar_mock_mode`
**Values**: `"true"` or `"false"`

When enabled:
- Returns mock data instead of calling APIs
- Useful for UI testing and development
- No API keys required

## Storage Structure (localStorage)

```javascript
// Example: User has configured Ollama
{
  'echo_avatar_image_provider': 'ollama',
  'echo_avatar_ollama_image_model': 'x/z-image-turbo',
  'echo_avatar_openai_key': '',
  'echo_avatar_replicate_token': '',
  'echo_avatar_mock_mode': 'false'
}

// Example: User has configured OpenAI fallback
{
  'echo_avatar_image_provider': 'auto',
  'echo_avatar_ollama_image_model': 'x/z-image-turbo',
  'echo_avatar_openai_key': 'sk-proj-...',
  'echo_avatar_replicate_token': 'r8_...',
  'echo_avatar_mock_mode': 'false'
}
```

## Clearing Settings

In browser DevTools console:
```javascript
// Clear everything
localStorage.removeItem('echo_avatar_image_provider');
localStorage.removeItem('echo_avatar_ollama_image_model');
localStorage.removeItem('echo_avatar_openai_key');
localStorage.removeItem('echo_avatar_replicate_token');
localStorage.removeItem('echo_avatar_mock_mode');

// Or use Settings UI → "Clear All" button
```

## API Endpoints Called

### Ollama
```
POST /ollama/api/generate
GET /ollama/api/tags
```

Expected responses:
- Generate: Base64 PNG image
- Tags: List of available models

### Stable Diffusion WebUI
```
POST /sdapi/v1/txt2img
```

### OpenAI
```
POST https://api.openai.com/v1/images/generations
POST https://api.openai.com/v1/audio/transcriptions
POST https://api.openai.com/v1/chat/completions
POST https://api.openai.com/v1/audio/speech
```

## Environment Variables (optional, .env)

Create `.env` file for defaults:

```env
# Leave empty to use localStorage settings
VITE_OPENAI_KEY=
VITE_REPLICATE_TOKEN=

# Optional: Set image provider default
# Values: auto, ollama, sdwebui, openai
VITE_IMAGE_PROVIDER=auto

# Optional: Set default Ollama model
VITE_OLLAMA_MODEL=x/z-image-turbo
```

These are used as fallbacks if nothing is in localStorage.

## Troubleshooting Config

### Reset to Defaults
Click **Settings** → **Clear All** button

### Check Current Settings
In browser console:
```javascript
// View all settings
Object.fromEntries(
  Object.entries(localStorage)
    .filter(([k]) => k.startsWith('echo_avatar_'))
)

// Check image provider
localStorage.getItem('echo_avatar_image_provider')

// Check Ollama model
localStorage.getItem('echo_avatar_ollama_image_model')
```

### Export Settings (for backup)
```javascript
// Copy entire config
JSON.stringify(
  Object.fromEntries(
    Object.entries(localStorage)
      .filter(([k]) => k.startsWith('echo_avatar_'))
  ),
  null, 2
)
```

### Import Settings (from backup)
```javascript
const backup = {
  'echo_avatar_image_provider': 'ollama',
  // ... other settings
};

Object.entries(backup).forEach(([k, v]) => {
  localStorage.setItem(k, v);
});
```

## Security Notes

⚠️ **Development Only**: localStorage is not encrypted.

- Never use production API keys
- Use throw-away keys for testing
- LocalStorage is accessible from DevTools
- Recommended: Use temporary/limited API keys

For production deployment:
- Never store keys client-side
- Use secure backend auth
- Implement API key rotation
- Enable CORS restrictions
