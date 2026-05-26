# Ollama Local Image Generation Setup

Echo Avatar Fusion now supports **local text-to-image generation using Ollama** instead of cloud-based APIs. This allows you to generate images privately on your machine without requiring OpenAI API keys.

## Quick Start

### 1. Install & Run Ollama

```bash
# Install Ollama from https://ollama.ai
# On macOS, install via Homebrew:
brew install ollama

# Start the Ollama server
ollama serve
```

Ollama will start on `http://127.0.0.1:11434` by default.

### 2. Pull the Image Generation Model

In a new terminal, download the image generation model:

```bash
# Default model (recommended for speed & quality)
ollama pull x/z-image-turbo

# Alternative model
ollama pull dall-e-3:latest
```

The first pull may take 10-30 minutes depending on your internet connection and model size.

### 3. Configure the App

1. Open the app: http://127.0.0.1:5174 (or http://127.0.0.1:5173 if 5174 is not in use)
2. Click **Settings** button (gear icon)
3. Under "Image Generation Provider", select:
   - **auto** (recommended): Auto-detects Ollama → tries SD WebUI → falls back to OpenAI
   - **ollama**: Use Ollama only (fails if not running)
4. Enter your Ollama model name in "Ollama Image Model":
   - Default: `x/z-image-turbo` (fast, ~2GB, good quality)
   - Alternative: `dall-e-3:latest` (higher quality, ~10GB)
5. Click **Save Settings**

### 4. Generate Images

1. Go to the main dashboard
2. Enter a text prompt
3. Click "Generate Image"
4. Watch the progress bar as Ollama generates locally
5. Download the generated image

## Architecture

### How It Works

```
User Input (Prompt)
    ↓
SettingsDialog (Configure provider)
    ↓
generativeService.generateImage()
    ↓
generateImageLocally()
    ↓
[Provider Priority Chain]
    ↓
Ollama: generateWithOllama()
    → POST /ollama/api/generate
    → Returns base64 PNG
    ↓
(if Ollama fails or auto-mode)
SD WebUI: generateWithSdWebUi()
    → POST /sdapi/v1/txt2img
    → Returns base64 PNG
    ↓
(if both fail and auto-mode)
OpenAI: generateImageOpenAI()
    → DALL-E 3 API
    → Requires OpenAI API key
```

### Key Files

- **[src/lib/keyStore.ts](src/lib/keyStore.ts)**: Stores image provider preference and model name
- **[src/services/localImageService.ts](src/services/localImageService.ts)**: Ollama/SD WebUI generation logic
- **[src/services/generativeService.ts](src/services/generativeService.ts)**: Dispatches to local or cloud providers
- **[src/components/SettingsDialog.tsx](src/components/SettingsDialog.tsx)**: UI for configuring providers

## Available Ollama Models

### Image Generation

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `x/z-image-turbo` | ~2GB | Very Fast | Good | Real-time avatars, quick prototypes |
| `dall-e-3:latest` | ~10GB | Slow | Excellent | High-quality avatars, production |
| `dall-e-2:latest` | ~5GB | Medium | Very Good | Balanced quality/speed |
| `stable-diffusion` | ~4GB | Medium | Good | General purpose |

Check available models:
```bash
ollama list
```

Download new models:
```bash
ollama pull <model-name>
```

## Troubleshooting

### "Ollama is not running"
- Verify Ollama is running: `curl http://127.0.0.1:11434`
- Start it with: `ollama serve`

### "Model not found"
- List available models: `ollama list`
- Download the model: `ollama pull x/z-image-turbo`

### Generation is very slow
- Check if model is still loading: `ollama list` (watch memory usage)
- Try a smaller model: `ollama pull stable-diffusion` instead of `dall-e-3:latest`
- Ensure no other heavy processes are running

### Generation fails with "out of memory"
- Your GPU/CPU doesn't have enough VRAM
- Try a smaller model (2GB instead of 10GB)
- Close other applications

## Advanced: Using Stable Diffusion WebUI

If you prefer Stable Diffusion WebUI instead of Ollama:

1. Install [AUTOMATIC1111 WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
2. Start with API enabled:
   ```bash
   ./webui.sh --api --listen 127.0.0.1 --port 7860
   ```
3. In Settings, select provider: **sdwebui**
4. Generate images

## Notes

- **Privacy**: All generation happens locally on your machine. No data is sent to the cloud.
- **Speed**: First generation takes longer (model warmup). Subsequent generations are faster.
- **Hardware**: Requires GPU (NVIDIA/AMD) or powerful CPU. M1/M2 Macs recommended for good performance.
- **Storage**: Models are stored in `~/.ollama/models/` (can be 2-10GB per model)

## Returning to Cloud-Based Generation

To switch back to OpenAI:
1. Open Settings
2. Change provider to **openai**
3. Enter your OpenAI API key
4. Save

The app automatically falls back to OpenAI if local services fail (when using auto-mode).
