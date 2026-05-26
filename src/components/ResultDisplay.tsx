
import { PipelineResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Image, Headphones, Timer, FileVideo, FileText, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResultDisplayProps {
  result: PipelineResult | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [videoPlayer, setVideoPlayer] = useState<HTMLVideoElement | null>(null);
  
  useEffect(() => {
    // When the result changes and includes a video, update the video player
    if (result?.wav2lip && videoPlayer) {
      // Set playback rate to ensure the video plays at the correct speed
      if (result.wav2lip.duration) {
        // Reset video current time when a new result arrives
        videoPlayer.currentTime = 0;
      }
    }
  }, [result, videoPlayer]);

  if (!result) return null;
  
  // Format seconds to MM:SS format
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Results</CardTitle>
          <div className="flex items-center space-x-4">
            {result.inputDuration && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDuration(result.inputDuration)}</span>
              </div>
            )}
            {result.totalTime && (
              <div className="flex items-center text-muted-foreground">
                <Timer className="h-4 w-4 mr-1" />
                <span className="text-sm">{result.totalTime.toFixed(1)}s total</span>
              </div>
            )}
          </div>
        </div>
        <CardDescription>
          Generated output from the AI pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={result.generatedImage && !result.wav2lip ? 'image' : 'video'}>
          <TabsList className={`grid w-full ${result.generatedImage ? 'grid-cols-5' : 'grid-cols-4'}`}>
            {result.generatedImage && (
              <TabsTrigger value="image">
                <Image className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="video">
              <FileVideo className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="audio">
              <Headphones className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          {result.generatedImage && (
            <TabsContent value="image" className="pt-4">
              <img
                src={result.generatedImage.imageUrl}
                alt="AI generated"
                className="w-full rounded-md border border-border"
              />
            </TabsContent>
          )}

          <TabsContent value="video" className="pt-4">
            {result.wav2lip ? (
              <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                <video 
                  src={result.wav2lip.videoUrl} 
                  controls
                  autoPlay
                  loop
                  className="max-w-full max-h-full"
                  ref={(el) => setVideoPlayer(el)}
                  poster="/placeholder.svg"
                >
                  <source src={result.wav2lip.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Video not yet generated</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="audio" className="pt-4">
            {result.xtts ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div 
                          key={n} 
                          className="w-2 h-16 bg-primary animate-pulse" 
                          style={{ 
                            animationDelay: `${n * 0.1}s`,
                            animationDuration: "0.8s"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <audio controls className="w-full" autoPlay>
                  <source src={result.xtts.audioUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                {result.xtts.duration && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Duration: {formatDuration(result.xtts.duration)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Audio not yet generated</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4 pt-4">
            {result.whisper && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Input Speech (Whisper)</h3>
                <div className="border p-3 rounded-md bg-muted">
                  <p>{result.whisper.text}</p>
                </div>
              </div>
            )}
            
            {result.llama && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">AI Response (LLaMA)</h3>
                <div className="border p-3 rounded-md bg-muted">
                  <p>{result.llama.response}</p>
                </div>
              </div>
            )}
            
            {!result.whisper && !result.llama && (
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">No text output yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {result.whisper && (
                <div className="border p-3 rounded-md">
                  <h3 className="font-medium">Whisper</h3>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {((result.whisper.confidence ?? 0.95) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
              
              {result.llama && (
                <div className="border p-3 rounded-md">
                  <h3 className="font-medium">LLaMA</h3>
                  <p className="text-sm text-muted-foreground">
                    Processing time: {result.llama.processingTime.toFixed(2)}s
                  </p>
                </div>
              )}
              
              {result.xtts && (
                <div className="border p-3 rounded-md">
                  <h3 className="font-medium">XTTS</h3>
                  <p className="text-sm text-muted-foreground">
                    Duration: {result.xtts.duration.toFixed(1)}s
                  </p>
                </div>
              )}
              
              {result.wav2lip && (
                <div className="border p-3 rounded-md">
                  <h3 className="font-medium">Wav2Lip</h3>
                  <p className="text-sm text-muted-foreground">
                    Duration: {result.wav2lip.duration.toFixed(1)}s
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {(result.wav2lip || result.generatedImage) && (
        <CardFooter>
          {result.generatedImage && (
            <Button asChild className="ml-auto">
              <a href={result.generatedImage.imageUrl} download="echo-avatar-fusion.png">
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </a>
            </Button>
          )}
          {result.wav2lip && (
            <Button asChild className={result.generatedImage ? '' : 'ml-auto'}>
              <a href={result.wav2lip.videoUrl} download="echo-avatar-fusion.mp4">
                <Download className="h-4 w-4 mr-2" />
                Download Video
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
