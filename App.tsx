
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameMetrics } from './types';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import HUD from './components/HUD';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [metrics, setMetrics] = useState<GameMetrics>({
    score: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    combo: 0,
    maxCombo: 0,
    level: 1
  });
  const [isPaused, setIsPaused] = useState(false);

  const startGame = useCallback(() => {
    setGameState(GameState.PLAYING);
    setIsPaused(false);
  }, []);

  const handleGameOver = useCallback((finalMetrics: GameMetrics) => {
    setMetrics(finalMetrics);
    setGameState(GameState.GAMEOVER);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Keyboard shortcut for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState === GameState.PLAYING) {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, togglePause]);

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden select-none">
      {gameState === GameState.START && <StartScreen onStart={startGame} />}
      
      {gameState === GameState.GAMEOVER && (
        <GameOverScreen metrics={metrics} onRestart={startGame} />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
        <HUD 
          metrics={metrics} 
          onPause={togglePause} 
          isPaused={isPaused} 
        />
      )}

      <GameCanvas 
        gameState={gameState} 
        isPaused={isPaused}
        onGameOver={handleGameOver}
        onUpdateMetrics={setMetrics}
      />

      {isPaused && gameState === GameState.PLAYING && (
        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-white text-4xl font-orbitron animate-pulse uppercase tracking-widest">
            Paused
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute bottom-4 left-4 text-slate-700 text-[10px] uppercase tracking-widest pointer-events-none font-bold">
        System Status: {isPaused ? 'Halted' : 'Operational'}
      </div>
      <div className="absolute bottom-4 right-4 text-slate-700 text-[10px] uppercase tracking-widest pointer-events-none font-bold">
        v1.0.4-Production
      </div>
    </div>
  );
};

export default App;
