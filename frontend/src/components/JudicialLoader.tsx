import { clsx } from "clsx";
import { Scale } from "lucide-react";

export default function JudicialLoader({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col items-center justify-center gap-4 text-primary w-full h-full min-h-[40vh] animate-fade-in", className)}>
      <div className="relative flex items-center justify-center">
        {/* Slow pulsing outer rings */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-primary/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
        
        {/* Core animated icon */}
        <div className="relative bg-surface p-4 rounded-full ring-1 ring-outline-variant/10 shadow-2xl z-10">
          <Scale className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 mt-6">
         <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-primary/70">Retrieving Records</span>
         <span className="font-sans text-[9px] font-bold text-on-surface/30 uppercase tracking-widest">Judicial AI Core Syncing</span>
      </div>
    </div>
  );
}
