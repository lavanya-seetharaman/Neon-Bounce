
import React from 'react';
import { GameMetrics } from '../types';

interface GameOverScreenProps {
  metrics: GameMetrics;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ metrics, onRestart }) => {
  const isNewHighScore = metrics.score === metrics.highScore && metrics.score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md z-50 p-6 text-white text-center animate-in fade-in duration-500">
      <h2 className="text-5xl md:text-7xl font-orbitron font-bold mb-2 text-pink-500 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
        GAME OVER
      </h2>
      <p className="text-slate-500 mb-8 tracking-widest uppercase">Critical Failure Detected</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
          <span className="text-slate-400">Score</span>
          <span className="text-3xl font-orbitron text-white">{metrics.score}</span>
        </div>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
          <span className="text-slate-400">Best Combo</span>
          <span className="text-xl font-orbitron text-cyan-400">{metrics.maxCombo}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">High Score</span>
          <span className={`text-xl font-orbitron ${isNewHighScore ? 'text-yellow-400 animate-pulse' : 'text-slate-200'}`}>
            {metrics.highScore}
          </span>
        </div>
        {isNewHighScore && (
          <p className="mt-4 text-yellow-400 font-bold text-sm uppercase tracking-tighter">New High Score Record!</p>
        )}
      </div>

      <button
        onClick={onRestart}
        className="px-10 py-4 bg-pink-500 hover:bg-pink-400 text-white font-orbitron font-bold text-xl rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.4)]"
      >
        RETRY MISSION
      </button>
    </div>
  );
};

export default GameOverScreen;
