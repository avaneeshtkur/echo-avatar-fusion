# Echo Avatar Fusion - Complete Setup Guide

## 🎯 Project Overview

Echo Avatar Fusion is a **local-first AI video generation platform** that creates talking-head avatar videos from text or audio input. The project now supports **local Ollama image generation** for complete privacy and control.

### Key Features
✅ **Local-first**: All processing happens locally or in browser  
✅ **Privacy-focused**: Support for Ollama (100% private local AI)  
✅ **No backend required**: Browser-based architecture  
✅ **Bring-your-own-key**: Optional OpenAI integration  
✅ **Multi-stage pipeline**: Text → Audio → Video processing  
✅ **History tracking**: Built-in generation history  

## 🚀 Getting Started

### Prerequisites

Required:
- **macOS/Linux/Windows**: Any OS supported by Node.js
- **Node.js**: v18+ ([install guide](https://nodejs.org/))
- **npm**: v9+
- **Git**: For cloning the repo

Optional but recommended:
- **Ollama**: https://ollama.ai - Local AI image generation
- **OpenAI API key**: https://platform.openai.com/api-keys - For voice features
- **Replicate token**: https://replicate.com/api - For video generation (optional)

### Step 1: Clone & Install

```bash
cd /path/to/projects
git clone <YOUR_REPO_URL> echo-avatar-fusion
cd echo-avatar-fusion
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app opens automatically at **http://127.0.0.1:5174** (or 5173 if 5174 is in use)

### Step 3: Configure Settings (Choose One Option)

#### Option A: Local Ollama (Recommended - Privacy First)

1. Install Ollama: https://ollama.ai
   ```bash
   # macOS via Homebrew
   brew install ollama
   
   # Or download installer from ollama.ai
   ```

2. Start Ollama server:
   ```bash
   ollama serve
   ```

3. In another terminal, pull an image model:
   ```bash
   # Fast model (2GB, good quality)
   ollama pull x/z-image-turbo
   
   # Or higher quality (10GB, slower)
   ollama pull dall-e-3:latest
   ```

4. In the app:
   - Click **Settings** (gear icon)
   - Image provider: Select **"ollama"**
   - Model: `x/z-image-turbo` (or your choice)
   - Click **Save Settings**

5. Test: Click **Generate Image** with any prompt

#### Option B: Cloud-based (Requires API Keys)

1. Get API keys:
   - OpenAI: https://platform.openai.com/api-keys
   - Replicate (optional): https://replicate.com/api

2. In the app:
   - Click **Settings** (gear icon)
   - Image provider: Select **"auto"** (or "openai")
   - Paste your **OpenAI API Key**
   - Optionally add Replicate token
   - Click **Save Settings**

#### Option C: Mixed Mode (Recommended)

Use local Ollama for images + OpenAI for voice:

1. Setup Ollama (see Option A above)

2. In the app Settings:
   - Image provider: **"auto"** (tries Ollama first)
   - Ollama Model: `x/z-image-turbo`
   - OpenAI Key: (optional) for voice features

This gives you **private images** + **professional voice features**

### Step 4: Try the Pipeline

1. **Text Mode**:
   - Enter a prompt: "A futuristic avatar speaking about AI"
   - Click "Generate Image"
   - Observe the process

2. **Audio Mode** (requires OpenAI key):
   - Upload an MP3/WAV file
   - Pipeline processes: Speech-to-Text → Enhancement → TTS
   - Downloads final audio

## 📁 Project Structure

```
echo-avatar-fusion/
├── src/
│   ├── components/
│   │   ├── SettingsDialog.tsx       # Configuration UI
│   │   ├── FileUpload.tsx           # Audio upload
│   │   ├── ConfigPanel.tsx          # Pipeline config
│   │   ├── PipelineVisualizer.tsx   # Progress display
│   │   ├── ResultDisplay.tsx        # Output preview
│   │   └── ui/                      # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx                # Main dashboard
│   │   ├── Dashboard.tsx            # Generation history
│   │   ├── Login.tsx                # Auth page
│   │   └── Signup.tsx               # Registration
│   ├── services/
│   │   ├── localImageService.ts     # Ollama/SD WebUI integration
│   │   ├── generativeService.ts     # Image generation dispatcher
│   │   ├── whisperService.ts        # Speech-to-text (OpenAI)
│   │   ├── llamaService.ts          # Text processing (OpenAI GPT)
│   │   ├── xttsService.ts           # Text-to-speech (OpenAI)
│   │   ├── videoService.ts          # Video generation
│   │   └── demoService.ts           # Mock data
│   ├── lib/
│   │   ├── keyStore.ts              # localStorage config manager
│   │   ├── historyStore.ts          # Generation history
│   │   └── utils.ts                 # Utilities
│   ├── hooks/
│   │   ├── usePipeline.ts           # Main pipeline orchestration
│   │   └── use-toast.ts             # Toast notifications
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication state
│   ├── config/
│   │   ├── api.ts                   # API endpoints
│   │   └── system.ts                # System config
│   ├── types/
│   │   ├── index.ts                 # Type definitions
│   │   └── auth.ts                  # Auth types
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # Entry point
├── public/
│   └── robots.txt
├── README.md                         # Main documentation
├── OLLAMA_SETUP.md                   # Detailed Ollama guide
├── OLLAMA_INTEGRATION_SUMMARY.md     # Implementation details
├── CONFIG_REFERENCE.md               # Configuration reference
├── package.json                      # Dependencies
├── vite.config.ts                    # Build configuration
├── tailwind.config.ts                # Styling
└── tsconfig.json                     # TypeScript config
```

## 🔧 Available Commands

```bash
# Start development server (http://127.0.0.1:5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## 🎨 UI Components Available

The app uses **shadcn/ui** components:
- Buttons, forms, inputs
- Dialogs, alerts, toasts
- Cards, badges, avatars
- Progress bars, sliders, accordions
- Tabs, dropdowns, tooltips
- And many more...

See [components/ui/](src/components/ui/) for full list.

## 💾 Data Storage

All data is stored **locally** in browser:

| Data | Storage | Key Prefix |
|------|---------|-----------|
| API Keys | localStorage | `echo_avatar_` |
| Settings | localStorage | `echo_avatar_` |
| History | localStorage | `echo_avatar_history` |
| Auth tokens | localStorage | `echo_avatar_auth` |

**No data sent to server** - everything stays on your machine.

## 🔐 Security & Privacy

✅ **No backend server** - Browser-only architecture  
✅ **Local Ollama support** - 100% private AI generation  
✅ **No tracking** - No analytics or telemetry  
✅ **BYOK (Bring Your Own Key)** - You control the API keys  
✅ **localStorage only** - Data never leaves your device  

⚠️ **Note**: localStorage is not encrypted. Don't use production API keys.

## 🐛 Troubleshooting

### "Ollama is not running"
```bash
# Start Ollama server
ollama serve
```

### "Model not found"
```bash
# List available models
ollama list

# Download a model
ollama pull x/z-image-turbo
```

### Settings not saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Open DevTools (F12) → Application → localStorage

### OpenAI key not working
- Verify API key format starts with `sk-`
- Check OpenAI account has available credits
- Test key on https://platform.openai.com/account/api-keys

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Documentation Files

- **[README.md](README.md)** - Project overview and quick start
- **[OLLAMA_SETUP.md](OLLAMA_SETUP.md)** - Detailed Ollama installation and setup
- **[OLLAMA_INTEGRATION_SUMMARY.md](OLLAMA_INTEGRATION_SUMMARY.md)** - Technical implementation details
- **[CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)** - Complete configuration options

## 🎯 Recommended Workflows

### Workflow 1: Private Local Generation
```
Text input → Ollama image gen → View result
(No API keys needed, 100% private)
```

### Workflow 2: Professional Output
```
Text input → OpenAI TTS → Ollama image → Wav2Lip video
(Local images, professional audio)
```

### Workflow 3: Full Cloud Pipeline
```
Audio upload → Whisper → GPT → TTS → Video
(All cloud-based, requires OpenAI + Replicate)
```

## 📞 Support

### Common Issues

1. **Port already in use**
   - App tries 5173, then 5174, then 5175...
   - Check which port is actually running

2. **TypeScript errors**
   - Run `npm install` to get dependencies
   - Clear .next or dist folder
   - Restart dev server

3. **OpenAI API errors**
   - Check API key is valid
   - Ensure account has credits
   - Check rate limits on openai.com

4. **Ollama slow**
   - First generation is slower (model loading)
   - Subsequent generations are faster
   - Ensure GPU has enough VRAM
   - Try smaller model (x/z-image-turbo vs dall-e-3)

## 🚀 Next Steps

1. ✅ Start the dev server: `npm run dev`
2. ✅ Install Ollama: https://ollama.ai
3. ✅ Pull a model: `ollama pull x/z-image-turbo`
4. ✅ Open app and configure Settings
5. ✅ Try text-to-image generation
6. ✅ Explore history dashboard
7. ✅ Add OpenAI key for voice features (optional)

---

**Status**: Ready to use! 🎉

Everything is configured and ready to generate avatars locally with complete privacy.
