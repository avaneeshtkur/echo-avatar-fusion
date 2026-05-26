
import { PipelineStage, PipelineState } from '@/types';
import { cn } from '@/lib/utils';

interface PipelineVisualizerProps {
  state: PipelineState;
}

const stages: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'whisper', label: 'Whisper', color: 'bg-whisper' },
  { id: 'llama', label: 'LLaMA', color: 'bg-llama' },
  { id: 'xtts', label: 'XTTS', color: 'bg-xtts' },
  { id: 'wav2lip', label: 'Wav2Lip', color: 'bg-wav2lip' },
];

export function PipelineVisualizer({ state }: PipelineVisualizerProps) {
  const { stage, progress } = state;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        {stages.map((s, index) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
                stage === s.id
                  ? `${s.color} pipeline-active animate-pulse-glow`
                  : stage === 'complete' || 
                    stages.findIndex(st => st.id === stage) > index
                    ? s.color
                    : 'bg-muted',
                stage === 'error' && "opacity-50"
              )}
            >
              <span className="text-lg font-bold">{index + 1}</span>
              {stage === s.id && progress > 0 && progress < 100 && (
                <div className="absolute -bottom-1 w-full h-1 bg-background overflow-hidden rounded-full">
                  <div
                    className={s.color}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <span 
              className={cn(
                "mt-2 font-medium text-sm",
                stage === s.id && "text-primary glow",
                stage === 'error' && "text-destructive"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Connection lines between nodes */}
      <div className="relative h-0.5 bg-muted -mt-[72px] mx-8">
        {stages.map((s, i) => {
          if (i === stages.length - 1) return null;
          const isActive = 
            stages.findIndex(st => st.id === stage) > i || 
            stage === 'complete';
          return (
            <div
              key={`line-${i}`}
              className={cn(
                "absolute h-full top-0 left-0 transition-all duration-1000",
                isActive ? s.color : "bg-transparent"
              )}
              style={{
                left: `${(i / (stages.length - 1)) * 100}%`,
                width: `${(1 / (stages.length - 1)) * 100}%`
              }}
            />
          );
        })}
      </div>

      {/* Status message */}
      <div className="text-center mt-8">
        {stage === 'idle' && (
          <p className="text-muted-foreground">Ready to process</p>
        )}
        {stage === 'whisper' && (
          <p className="text-whisper">Converting speech to text...</p>
        )}
        {stage === 'llama' && (
          <p className="text-llama">Generating AI response...</p>
        )}
        {stage === 'xtts' && (
          <p className="text-xtts">Creating natural speech from text...</p>
        )}
        {stage === 'wav2lip' && (
          <p className="text-wav2lip">Synchronizing lips with audio...</p>
        )}
        {stage === 'complete' && (
          <p className="text-primary font-medium">Processing complete!</p>
        )}
        {stage === 'error' && (
          <p className="text-destructive">Error: {state.error}</p>
        )}
      </div>
    </div>
  );
}
