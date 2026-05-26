
import { useState } from 'react';
import { SystemConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface ConfigPanelProps {
  config: SystemConfig;
  onConfigChange: (config: SystemConfig) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const updateConfig = <K extends keyof SystemConfig>(key: K, value: SystemConfig[K]) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };
  
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Button 
        variant="ghost" 
        className="w-full flex items-center justify-between p-4 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <span>Advanced Configuration</span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <div className="p-4 space-y-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Whisper Model</Label>
              <Select 
                value={`${config.whisperModel.version}-${config.whisperModel.quantized ? 'quantized' : 'full'}`}
                onValueChange={(val) => {
                  const [version, quantized] = val.split('-');
                  updateConfig('whisperModel', {
                    ...config.whisperModel,
                    version,
                    quantized: quantized === 'quantized'
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large-v2-quantized">large-v2 (Quantized)</SelectItem>
                  <SelectItem value="large-v2-full">large-v2 (Full Precision)</SelectItem>
                  <SelectItem value="small-v2-quantized">small-v2 (Quantized)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>LLaMA Model</Label>
              <Select 
                value={`${config.llamaModel.version}-${config.llamaModel.quantized ? 'quantized' : 'full'}`}
                onValueChange={(val) => {
                  const [version, quantized] = val.split('-');
                  updateConfig('llamaModel', {
                    ...config.llamaModel,
                    version,
                    quantized: quantized === 'quantized'
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-70B-quantized">LLaMA 3 70B (Quantized)</SelectItem>
                  <SelectItem value="3-70B-full">LLaMA 3 70B (Full Precision)</SelectItem>
                  <SelectItem value="3-8B-quantized">LLaMA 3 8B (Quantized)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="parallelization" 
                checked={config.useParallelization}
                onCheckedChange={(checked) => updateConfig('useParallelization', checked)}
              />
              <Label htmlFor="parallelization">Parallel Processing</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="preloadAvatars" 
                checked={config.usePreloadedAvatars}
                onCheckedChange={(checked) => updateConfig('usePreloadedAvatars', checked)}
              />
              <Label htmlFor="preloadAvatars">Preload Avatars</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="queryCache" 
                checked={config.useQueryCache}
                onCheckedChange={(checked) => updateConfig('useQueryCache', checked)}
              />
              <Label htmlFor="queryCache">Query Cache</Label>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Note: In the demo mode, these settings don't affect processing times.
          </div>
        </div>
      )}
    </div>
  );
}
