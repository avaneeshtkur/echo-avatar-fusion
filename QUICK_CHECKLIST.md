# Echo Avatar Fusion - Quick Checklist

## ✅ Pre-Setup Checklist

Before you start, make sure you have:

- [ ] macOS/Linux/Windows machine
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed
- [ ] ~10GB free disk space (for Ollama models)
- [ ] Internet connection (for initial setup)

Optional but recommended:
- [ ] GPU (NVIDIA/AMD) for faster image generation
- [ ] At least 8GB RAM (16GB recommended)

---

## 🔧 Installation Checklist

### Step 1: Clone Project
- [ ] Run: `git clone <YOUR_REPO_URL> echo-avatar-fusion`
- [ ] Run: `cd echo-avatar-fusion`
- [ ] Verify: `ls -la` shows package.json, README.md, etc.

### Step 2: Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for completion (~2 minutes)
- [ ] Verify: `ls -la node_modules` shows many folders

### Step 3: Verify Dev Setup
- [ ] Run: `npm run build`
- [ ] Verify: Build completes without errors
- [ ] Verify: `dist/` folder created

---

## 🚀 Ollama Setup Checklist (Local Generation)

### Step 1: Install Ollama
- [ ] Visit: https://ollama.ai
- [ ] Download installer for your OS
- [ ] Run installer
- [ ] Verify: `ollama --version` shows version number

### Step 2: Start Ollama Server
- [ ] Open terminal
- [ ] Run: `ollama serve`
- [ ] Wait 2-3 seconds for startup
- [ ] Verify: Terminal shows `listening on 127.0.0.1:11434`
- [ ] **Leave this terminal open** (Ollama must run in background)

### Step 3: Pull Image Model
- [ ] Open NEW terminal window
- [ ] Run: `ollama pull x/z-image-turbo`
- [ ] Wait 10-30 minutes for download (~2GB)
- [ ] Verify: Command completes with model name
- [ ] Verify: `ollama list` shows the model

### Step 4: Test Ollama Connection
- [ ] Open new terminal
- [ ] Run: `curl http://127.0.0.1:11434`
- [ ] Verify: Response shows "Ollama is running" (or similar)

---

## 🌐 Optional: OpenAI Setup (Cloud Generation)

### Get API Key
- [ ] Visit: https://platform.openai.com/api-keys
- [ ] Click: "+ Create new secret key"
- [ ] Copy: Your new API key (starts with `sk-`)
- [ ] Store: Safely (you'll only see it once!)

### Optional: Get Replicate Token
- [ ] Visit: https://replicate.com/api
- [ ] Sign in or create account
- [ ] Copy: Your API token
- [ ] Store: Safely for later

---

## 🎮 App Launch Checklist

### Step 1: Start Dev Server
- [ ] Open terminal (NOT the one running Ollama)
- [ ] Run: `npm run dev`
- [ ] Wait 5-10 seconds for startup
- [ ] Verify: Shows "VITE v5.4.10 ready in XXX ms"
- [ ] Verify: Shows "➜ Local: http://127.0.0.1:5174/"

### Step 2: Open App in Browser
- [ ] App should auto-open in browser
- [ ] If not, manually open: http://127.0.0.1:5174
- [ ] Verify: You see "Echo Avatar Fusion" title
- [ ] Verify: Navigation bar with Settings button visible

---

## ⚙️ Configuration Checklist

### Option A: Local Ollama Only (Recommended)

- [ ] Click Settings button (gear icon)
- [ ] Scroll to "Image Generation Provider"
- [ ] Select radio button: **"ollama"**
- [ ] Check: "Ollama Image Model" field shows
- [ ] Verify: Model name is `x/z-image-turbo`
- [ ] Click: **"Save Settings"** button
- [ ] Verify: Green success toast appears

### Option B: Cloud OpenAI (If you have API key)

- [ ] Click Settings button (gear icon)
- [ ] Scroll to "Image Generation Provider"
- [ ] Select radio button: **"openai"**
- [ ] Scroll to "OpenAI API Key" section
- [ ] Paste: Your OpenAI key (starts with `sk-`)
- [ ] Click: Eye icon to verify key is visible
- [ ] Click: **"Save Settings"** button
- [ ] Verify: Green success toast appears

### Option C: Auto-detect (Hybrid - Recommended)

- [ ] Click Settings button (gear icon)
- [ ] Scroll to "Image Generation Provider"
- [ ] Select radio button: **"auto"**
- [ ] Verify: Ollama Model field shows (optional)
- [ ] Paste: OpenAI key in the field (optional, for fallback)
- [ ] Click: **"Save Settings"** button
- [ ] Verify: Green success toast appears

---

## 🎨 First Generation Checklist

### Text-to-Image (With Ollama)

- [ ] You see text input field
- [ ] Type prompt: "A smiling robot avatar"
- [ ] Click: "Generate Image" button
- [ ] Watch: Progress bar fills
- [ ] Wait: 30-60 seconds for generation
- [ ] Verify: Image appears below
- [ ] Optional: Click download icon to save image

### Test Results

- [ ] ✅ Image generated successfully
- [ ] ✅ No error messages
- [ ] ✅ Image is visible and reasonable quality
- [ ] ✅ Settings persisted (refresh page, try again)

---

## 📊 Verification Checklist

### In Browser

- [ ] [ ] Settings dialog opens/closes
- [ ] [ ] Provider selector works (click each option)
- [ ] [ ] Model input accepts text
- [ ] [ ] Save button works
- [ ] [ ] Settings appear after refresh
- [ ] [ ] History page shows generations
- [ ] [ ] Download button works
- [ ] [ ] No console errors (F12 → Console)

### In Terminal

- [ ] [ ] Dev server shows no errors
- [ ] [ ] Ollama server showing "listening on 127.0.0.1:11434"
- [ ] [ ] No red text or warnings
- [ ] [ ] Terminal responds to commands

### With Ollama

- [ ] [ ] `ollama list` shows your pulled model
- [ ] [ ] `curl http://127.0.0.1:11434` responds
- [ ] [ ] Generation doesn't timeout
- [ ] [ ] Error messages are clear if Ollama stops

---

## 🆘 Troubleshooting Checklist

### If App Won't Start

- [ ] [ ] Check Node.js version: `node --version` (should be v18+)
- [ ] [ ] Try: `npm install` again
- [ ] [ ] Try: Delete `node_modules` and reinstall
- [ ] [ ] Try: Restart terminal
- [ ] [ ] Try: `npm cache clean --force`

### If Ollama Connection Fails

- [ ] [ ] Is Ollama server running? (Should see terminal window)
- [ ] [ ] Check: `curl http://127.0.0.1:11434` responds
- [ ] [ ] Check: Firewall not blocking port 11434
- [ ] [ ] Try: Restart Ollama server
- [ ] [ ] Check: Model is installed: `ollama list`

### If Generation Fails

- [ ] [ ] Check: Ollama server is running
- [ ] [ ] Check: Model is downloaded: `ollama list`
- [ ] [ ] Check: No other app using port 11434
- [ ] [ ] Try: Refresh page and try again
- [ ] [ ] Check: Browser console for errors (F12)

### If Settings Won't Save

- [ ] [ ] Check: Browser localStorage is enabled
- [ ] [ ] Try: Clearing browser cache
- [ ] [ ] Try: Using different browser
- [ ] [ ] Check: Browser DevTools → Application → localStorage

---

## 🎯 Success Checklist

You're ready to go when:

- ✅ [ ] Node.js and npm are installed and verified
- ✅ [ ] Project is cloned and npm install completed
- ✅ [ ] Dev server starts without errors
- ✅ [ ] App opens in browser at http://127.0.0.1:5174
- ✅ [ ] Ollama is installed and running (`ollama serve`)
- ✅ [ ] Image model is pulled (`ollama pull x/z-image-turbo`)
- ✅ [ ] Settings configured (provider selected, model set)
- ✅ [ ] First image generated successfully
- ✅ [ ] No error messages in browser console
- ✅ [ ] No error messages in terminal

---

## 📝 Command Reference

### Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Ollama Commands

```bash
# Check Ollama is running
curl http://127.0.0.1:11434

# List installed models
ollama list

# Pull a new model
ollama pull x/z-image-turbo

# Stop Ollama
# (Just close the terminal or Ctrl+C)

# Start Ollama (macOS)
ollama serve
```

### Browser DevTools

```javascript
// Check settings in console (F12)
Object.fromEntries(
  Object.entries(localStorage)
    .filter(([k]) => k.startsWith('echo_avatar_'))
)

// Clear settings
localStorage.clear()

// Check for errors
// Look at Console tab for red errors
```

---

## 📚 Documentation Links

- **Quick Start**: [README.md](README.md)
- **Full Setup**: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Ollama Setup**: [OLLAMA_SETUP.md](OLLAMA_SETUP.md)
- **Configuration**: [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)
- **Technical Details**: [OLLAMA_INTEGRATION_SUMMARY.md](OLLAMA_INTEGRATION_SUMMARY.md)

---

## 🎉 Congratulations!

Once you check all the boxes above, you have successfully set up Echo Avatar Fusion with local Ollama support!

You can now:
- Generate avatar images locally and privately
- No API costs (except storage)
- No data sent to cloud services
- Complete control over the AI models

Happy avatar generating! 🚀

---

**Last Updated**: May 26, 2024  
**App Version**: 0.0.0  
**Status**: Ready for use ✨
