# Echo Avatar Fusion

A local-first AI video generation tool that creates talking-head videos from text or audio input. Supports both cloud APIs (OpenAI) and local AI services (Ollama).

## Features

- **Local-first architecture**: All processing can run locally or in your browser
- **Multiple image backends**:
  - **Ollama** (local, private) - Recommended for privacy
  - **Stable Diffusion WebUI** (local)
  - **OpenAI DALL-E** (cloud) - Fallback option
- **Bring-your-own-key**: Use your own OpenAI API key (no backend required)
- **Multi-stage pipeline**: 
  - Speech-to-Text (Whisper)
  - Text Enhancement (GPT)
  - Text-to-Speech (OpenAI TTS or local)
  - Lip-sync Video (Wav2Lip via Replicate, optional)
- **History tracking**: Local generation history stored in browser
- **Mock mode**: Test UI without API calls (for development)

## Prerequisites

- **Node.js**: v18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**: 9+
- **Ollama** (optional but recommended): [Install from ollama.ai](https://ollama.ai)
  - Enables local private image generation
  - No API keys needed for images
- **OpenAI API Key** (optional): Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Only needed for speech-to-text, text enhancement, and TTS
  - Not needed if using local Ollama for images
- **Replicate API Token** (optional): For video generation from [replicate.com/api](https://replicate.com/api)

## Quick Start

### 1. Clone & Install

```sh
git clone <YOUR_REPO_URL>
cd echo-avatar-fusion
npm install
```

### 2. Setup Ollama (Optional but Recommended)

For **local private image generation** without cloud APIs:

```sh
# Install Ollama: https://ollama.ai
# Start Ollama server
ollama serve

# In another terminal, pull an image model
ollama pull x/z-image-turbo
```

See [OLLAMA_SETUP.md](OLLAMA_SETUP.md) for detailed instructions.

### 3. Start Dev Server

```sh
npm run dev
```

The app will automatically open at `http://localhost:5173`

### 4. Configure Settings

1. Click **Settings** (gear icon) in the header
2. Choose image generation provider:
   - **auto** (recommended): Auto-detects Ollama → SD WebUI → falls back to OpenAI
   - **ollama**: Local Ollama (requires Ollama running + model pulled)
   - **openai**: Cloud-based DALL-E (requires OpenAI API key)
3. If using Ollama: Enter the model name (default: `x/z-image-turbo`)
4. If using cloud: Add your **OpenAI API Key**
5. Optionally add **Replicate API Token** for video generation
6. Click **Save Settings**

Keys are stored in browser localStorage (development only).


### 4. Smoke Test

```
1. Go to signup page
2. Create account (email/password)
3. Login with credentials
4. On Pipeline tab, enter some text
5. Click "Generate"
6. Watch the pipeline progress
7. Check Dashboard for history
8. Logout
```

## Troubleshooting

### "OpenAI API key not configured"
- Click Settings, paste your OpenAI key, and save

### "Invalid email or password"
- Make sure you created an account first via the Signup page
- Credentials are stored in localStorage

### Video generation not working
- Video generation requires a backend proxy (Replicate has CORS restrictions)
- See `src/services/videoService.ts` for documentation on setting up a local proxy
- Alternatively, use mock mode to test UI without video generation

### Enable Mock Mode for UI Testing
- Click Settings
- Toggle "Mock Mode (Test UI without API calls)"
- Pipeline will return fake data instantly

## Architecture

```
src/
├── config/              # API configuration
├── context/             # Auth context (localStorage-based)
├── hooks/               # usePipeline orchestration
├── lib/                 # keyStore, historyStore (localStorage)
├── services/            # OpenAI/Replicate API wrappers
├── pages/               # Login, Signup, Dashboard, Index (Pipeline)
└── components/          # UI components + SettingsDialog
```

## Services

- **whisperService**: OpenAI Whisper API (speech-to-text)
- **llamaService**: OpenAI GPT (text enhancement)
- **xttsService**: OpenAI TTS (text-to-speech)
- **videoService**: Wav2Lip via Replicate (video generation) - stubbed for browser
- **generativeService**: OpenAI Images API (image generation)

## Build & Deploy

```sh
# Type check
npm run typecheck

# Production build
npm run build

# Preview build
npm run preview
```

## Notes

- **No backend required**: Everything runs in-browser or uses CORS-enabled APIs
- **No authentication backend**: Uses localStorage (development only)
- **Video generation limitation**: Wav2Lip requires a backend proxy or local server due to CORS
- **API costs**: OpenAI charges per API call. Use mock mode during development to avoid costs

## Future Enhancements

- Razorpay integration (noted but not implemented)
- Custom voice cloning
- Batch processing
- Cloud sync option
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bc437c68-6ddf-4d50-a540-fd7e2efa4c21) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
