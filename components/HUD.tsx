
import React from 'react';
import { GameMetrics } from '../types';

interface HUDProps {
  metrics: GameMetrics;
  onPause: () => void;
  isPaused: boolean;
}

const HUD: React.FC<HUDProps> = ({ metrics, onPause, isPaused }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
      <div className="flex flex-col">
        <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Score</div>
        <div className="text-4xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {metrics.score.toString().padStart(4, '0')}
        </div>
        {metrics.combo > 1 && (
          <div className="mt-2 text-cyan-400 font-orbitron text-lg animate-bounce">
            x{metrics.combo} COMBO
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="hidden md:block text-right">
          <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Best</div>
          <div className="text-xl font-orbitron text-slate-300">
            {metrics.highScore.toString().padStart(4, '0')}
          </div>
        </div>
        
        <button
          onClick={onPause}
          className="w-12 h-12 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors"
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default HUD;
