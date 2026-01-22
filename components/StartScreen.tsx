
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 p-6 text-white text-center">
      <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 tracking-tighter text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
        NEON BOUNCE
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-md mb-8">
        An endless test of reflexes. Keep the ball alive, chase the high score, and feel the flow.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h3 className="text-cyan-400 font-bold mb-2 uppercase tracking-widest text-sm">Controls</h3>
          <ul className="text-slate-300 space-y-1 text-sm">
            <li>• Mouse: Move Paddle</li>
            <li>• Arrows: Move Paddle</li>
            <li>• Space: Pause Game</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h3 className="text-pink-400 font-bold mb-2 uppercase tracking-widest text-sm">Tips</h3>
          <ul className="text-slate-300 space-y-1 text-sm">
            <li>• Edge hits boost horizontal speed</li>
            <li>• Consecutive hits build combos</li>
            <li>• Watch out for gravity!</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-orbitron font-bold text-xl rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
      >
        START MISSION
      </button>
    </div>
  );
};

export default StartScreen;
