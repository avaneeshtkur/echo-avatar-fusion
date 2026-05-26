
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { PipelineVisualizer } from '@/components/PipelineVisualizer';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ResultDisplay } from '@/components/ResultDisplay';
import { SettingsDialog } from '@/components/SettingsDialog';
import { usePipeline } from '@/hooks/usePipeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Mic, Video, Play, RotateCcw, FileText, Image, Clock, LogOut } from 'lucide-react';

const Index = () => {
  const { 
    state, 
    result, 
    config, 
    inputFile, 
    avatarFile, 
    inputText,
    outputType,
    isPrototypeMode,
    setInputFile, 
    setAvatarFile,
    setInputText,
    setOutputType,
    setConfig, 
    startPipeline, 
    resetPipeline 
  } = usePipeline();
  
  const { logout } = useAuth();
  const [inputType, setInputType] = useState<'file' | 'text'>('text');

  const isIdle = state.stage === 'idle';
  const isComplete = state.stage === 'complete';
  const isProcessing = !isIdle && !isComplete && state.stage !== 'error';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Echo Avatar Fusion Pipeline</h1>
          <div className="flex items-center gap-4">
            <SettingsDialog />
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI Content Generation Pipeline
          </h1>
          <p className="text-gray-400">
            Generate AI content with just a few clicks
          </p>
          <p className="mt-2 text-sm text-blue-300">
            Text → Image uses local Ollama or Stable Diffusion WebUI on your machine.
          </p>
          {isPrototypeMode && (
            <p className="text-sm text-gray-400">
              Demo mode affects audio/video steps only; images are generated locally when possible.
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8">
          <Tabs defaultValue="text" className="w-full" onValueChange={(value) => setInputType(value as 'file' | 'text')}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="file" className="data-[state=active]:bg-gray-700">
                <Mic className="h-5 w-5 mr-2" />
                Audio/Video Input
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-gray-700">
                <FileText className="h-5 w-5 mr-2" />
                Text Input
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Input (audio, video, or image)"
                  accept="audio/*,video/*,image/*"
                  icon={<Mic className="h-5 w-5 mr-2" />}
                  file={inputFile}
                  onFileChange={setInputFile}
                />
                
                <FileUpload
                  label="Avatar Reference (Optional)"
                  accept="image/*,video/*"
                  icon={<Video className="h-5 w-5 mr-2" />}
                  file={avatarFile}
                  onFileChange={setAvatarFile}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inputText" className="text-white mb-2 block">Enter Text Prompt</Label>
                  <Textarea 
                    id="inputText" 
                    placeholder="Enter a description of the content you want to generate... Example: Generate a video of Donald Trump eating a burger" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Output Type</Label>
                  <RadioGroup 
                    value={outputType} 
                    onValueChange={(value) => setOutputType(value as 'video' | 'image')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" className="border-gray-600" />
                      <Label htmlFor="video" className="text-white flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" className="border-gray-600" />
                      <Label htmlFor="image" className="text-white flex items-center">
                        <Image className="h-4 w-4 mr-2" />
                        Image
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-white mb-2 block">Avatar Reference (Optional)</Label>
                  <FileUpload
                    label="Add Avatar Reference"
                    accept="image/*,video/*"
                    icon={<Video className="h-5 w-5 mr-2" />}
                    file={avatarFile}
                    onFileChange={setAvatarFile}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <ConfigPanel config={config} onConfigChange={setConfig} />
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <PipelineVisualizer state={state} />
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              disabled={(!inputFile && !inputText) || isProcessing}
              onClick={startPipeline}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Pipeline
            </Button>
            
            {(isComplete || state.stage === 'error') && (
              <Button
                variant="outline"
                size="lg"
                onClick={resetPipeline}
                className="border-gray-700 hover:bg-gray-800"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            )}
          </div>
          
          {result && <ResultDisplay result={result} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
