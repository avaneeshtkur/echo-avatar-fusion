import { useState } from 'react';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { keyStore } from '@/lib/keyStore';
import { toast } from '@/components/ui/sonner';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(keyStore.getOpenAIKey());
  const [replicateToken, setReplicateToken] = useState(keyStore.getReplicateToken() || '');
  const [mockMode, setMockMode] = useState(keyStore.getMockMode());
  const [imageProvider, setImageProvider] = useState(keyStore.getImageProvider());
  const [ollamaImageModel, setOllamaImageModel] = useState(keyStore.getOllamaImageModel());
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showReplicateKey, setShowReplicateKey] = useState(false);

  const handleSave = () => {
    keyStore.setOpenAIKey(openaiKey);
    keyStore.setReplicateToken(replicateToken || undefined);
    keyStore.setMockMode(mockMode);
    keyStore.setImageProvider(imageProvider);
    keyStore.setOllamaImageModel(ollamaImageModel);

    toast.success('Settings saved successfully');
    setOpen(false);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all settings?')) {
      keyStore.clear();
      setOpenaiKey('');
      setReplicateToken('');
      setMockMode(false);
      setImageProvider('auto');
      setOllamaImageModel('x/z-image-turbo');
      toast.success('Settings cleared');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your API keys for AI services. Keys are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          <Alert className="bg-blue-900 border-blue-700">
            <AlertDescription className="text-blue-200 text-sm">
              Settings are stored locally in your browser. All processing happens on your machine.
            </AlertDescription>
          </Alert>

          {/* Image Generation Provider */}
          <div className="space-y-2">
            <Label className="text-white">Image Generation Provider</Label>
            <div className="space-y-2">
              {(['auto', 'ollama', 'sdwebui', 'openai'] as const).map((provider) => (
                <div key={provider} className="flex items-center">
                  <input
                    type="radio"
                    id={`provider-${provider}`}
                    name="image-provider"
                    value={provider}
                    checked={imageProvider === provider}
                    onChange={(e) => setImageProvider(e.target.value as any)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 cursor-pointer"
                  />
                  <label htmlFor={`provider-${provider}`} className="ml-2 text-sm text-gray-300 cursor-pointer capitalize">
                    {provider === 'auto' ? 'Auto-detect (Ollama → SD WebUI → OpenAI)' : provider}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {imageProvider === 'ollama' && 'Local image generation using Ollama. Fast and private.'}
              {imageProvider === 'sdwebui' && 'Use Stable Diffusion WebUI running locally.'}
              {imageProvider === 'openai' && 'Cloud-based DALL-E 3 (requires OpenAI API key).'}
              {imageProvider === 'auto' && 'Automatically tries available local services first.'}
            </p>
          </div>

          {/* Ollama Image Model */}
          {(imageProvider === 'auto' || imageProvider === 'ollama') && (
            <div className="space-y-2 p-3 bg-gray-700 rounded border border-gray-600">
              <Label htmlFor="ollama-model" className="text-white">
                Ollama Image Model
              </Label>
              <Input
                id="ollama-model"
                placeholder="e.g., x/z-image-turbo"
                value={ollamaImageModel}
                onChange={(e) => setOllamaImageModel(e.target.value)}
                className="bg-gray-600 border-gray-500 text-white text-sm"
              />
              <p className="text-xs text-gray-300">
                Popular options: <code className="bg-gray-600 px-1 rounded">x/z-image-turbo</code>, <code className="bg-gray-600 px-1 rounded">dall-e-3:latest</code>
              </p>
              <p className="text-xs text-gray-400">
                Install new models with: <code className="bg-gray-600 px-1 rounded">ollama pull x/z-image-turbo</code>
              </p>
            </div>
          )}

          {/* OpenAI API Key */}
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-white">
              OpenAI API Key (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type={showOpenaiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                {showOpenaiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Used for speech-to-text (Whisper), text-to-speech, and as fallback for image generation.
            </p>
          </div>

          {/* Replicate Token (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="replicate-token" className="text-white">
              Replicate API Token (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="replicate-token"
                type={showReplicateKey ? 'text' : 'password'}
                placeholder="r8_..."
                value={replicateToken}
                onChange={(e) => setReplicateToken(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplicateKey(!showReplicateKey)}
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                {showReplicateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              For video generation (Wav2Lip).
            </p>
          </div>

          {/* Mock Mode Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mock-mode" className="text-white cursor-pointer">
                Mock Mode (Test UI without API calls)
              </Label>
              <button
                onClick={() => setMockMode(!mockMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  mockMode ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mockMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Returns mock data for testing the UI without APIs.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="bg-red-900 hover:bg-red-800"
          >
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
