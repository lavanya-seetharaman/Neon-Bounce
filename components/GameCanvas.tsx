
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  GameState, Ball, Paddle, GameMetrics 
} from '../types';
import { 
  GAME_WIDTH, GAME_HEIGHT, INITIAL_BALL_SPEED, 
  GRAVITY, INITIAL_PADDLE_WIDTH, MIN_PADDLE_WIDTH, 
  PADDLE_HEIGHT, COLORS, MAX_BALL_SPEED
} from '../constants';
import { soundService } from '../services/soundService';

interface GameCanvasProps {
  gameState: GameState;
  onGameOver: (metrics: GameMetrics) => void;
  onUpdateMetrics: (metrics: GameMetrics) => void;
  isPaused: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  onGameOver, 
  onUpdateMetrics,
  isPaused 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Fix: Added initial value undefined to fix "Expected 1 arguments, but got 0" error on line 27
  const requestRef = useRef<number | undefined>(undefined);
  
  // Game state held in a ref to avoid stale closure issues in the loop
  const gameRef = useRef({
    ball: {
      pos: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 3 },
      vel: { x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED },
      radius: 8,
      color: COLORS.BALL
    } as Ball,
    paddle: {
      x: (GAME_WIDTH - INITIAL_PADDLE_WIDTH) / 2,
      y: GAME_HEIGHT - 40,
      width: INITIAL_PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      color: COLORS.PADDLE
    } as Paddle,
    metrics: {
      score: 0,
      highScore: parseInt(localStorage.getItem('highScore') || '0'),
      combo: 0,
      maxCombo: 0,
      level: 1
    } as GameMetrics,
    keys: {
      left: false,
      right: false
    }
  });

  const resetGame = useCallback(() => {
    gameRef.current.ball = {
      pos: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 3 },
      vel: { x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED },
      radius: 8,
      color: COLORS.BALL
    };
    gameRef.current.paddle = {
      x: (GAME_WIDTH - INITIAL_PADDLE_WIDTH) / 2,
      y: GAME_HEIGHT - 40,
      width: INITIAL_PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      color: COLORS.PADDLE
    };
    gameRef.current.metrics = {
      score: 0,
      highScore: parseInt(localStorage.getItem('highScore') || '0'),
      combo: 0,
      maxCombo: 0,
      level: 1
    };
  }, []);

  const update = useCallback(() => {
    if (gameState !== GameState.PLAYING || isPaused) return;

    const { ball, paddle, metrics, keys } = gameRef.current;

    // Paddle Movement (Keyboard)
    if (keys.left) paddle.x -= 10;
    if (keys.right) paddle.x += 10;
    paddle.x = Math.max(0, Math.min(GAME_WIDTH - paddle.width, paddle.x));

    // Ball Physics (Gravity)
    ball.vel.y += GRAVITY;
    ball.pos.x += ball.vel.x;
    ball.pos.y += ball.vel.y;

    // Wall Collisions
    if (ball.pos.x - ball.radius < 0 || ball.pos.x + ball.radius > GAME_WIDTH) {
      ball.vel.x *= -1;
      ball.pos.x = ball.pos.x < ball.radius ? ball.radius : GAME_WIDTH - ball.radius;
      soundService.playWallHit();
      metrics.combo = 0; // Wall hit breaks combo as per prompt logic
      onUpdateMetrics({ ...metrics });
    }

    if (ball.pos.y - ball.radius < 0) {
      ball.vel.y *= -1;
      ball.pos.y = ball.radius;
      soundService.playWallHit();
    }

    // Paddle Collision
    if (
      ball.pos.y + ball.radius > paddle.y &&
      ball.pos.y - ball.radius < paddle.y + paddle.height &&
      ball.pos.x > paddle.x &&
      ball.pos.x < paddle.x + paddle.width
    ) {
      // Successful Bounce
      ball.pos.y = paddle.y - ball.radius;
      
      // Dynamic bounce angle based on where it hits the paddle
      const paddleCenter = paddle.x + paddle.width / 2;
      const distFromCenter = ball.pos.x - paddleCenter;
      const normalizedDist = distFromCenter / (paddle.width / 2);
      
      ball.vel.x = normalizedDist * 8; // Max horizontal speed from bounce
      ball.vel.y = -Math.abs(ball.vel.y) * 1.05; // Slightly speed up
      
      // Clamp speed
      if (Math.abs(ball.vel.y) > MAX_BALL_SPEED) ball.vel.y = -MAX_BALL_SPEED;

      // Scoring
      metrics.score += 1;
      metrics.combo += 1;
      if (metrics.combo > 1) {
          metrics.score += Math.floor(metrics.combo / 2);
      }
      if (metrics.combo > metrics.maxCombo) metrics.maxCombo = metrics.combo;
      
      if (metrics.score > metrics.highScore) {
        metrics.highScore = metrics.score;
        localStorage.setItem('highScore', metrics.highScore.toString());
      }

      // Difficulty Scaling
      if (metrics.score % 10 === 0) {
        paddle.width = Math.max(MIN_PADDLE_WIDTH, paddle.width - 2);
      }

      soundService.playPaddleHit();
      onUpdateMetrics({ ...metrics });
    }

    // Game Over Condition
    if (ball.pos.y - ball.radius > GAME_HEIGHT) {
      soundService.playGameOver();
      onGameOver({ ...metrics });
    }
  }, [gameState, isPaused, onGameOver, onUpdateMetrics]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { ball, paddle } = gameRef.current;
    
    // Clear
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Grid (Subtle)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < GAME_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < GAME_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(GAME_WIDTH, i);
      ctx.stroke();
    }

    // Draw Paddle
    ctx.shadowBlur = 10;
    ctx.shadowColor = paddle.color;
    ctx.fillStyle = paddle.color;
    // Rounded rectangle for paddle
    const r = 4;
    ctx.beginPath();
    ctx.moveTo(paddle.x + r, paddle.y);
    ctx.lineTo(paddle.x + paddle.width - r, paddle.y);
    ctx.quadraticCurveTo(paddle.x + paddle.width, paddle.y, paddle.x + paddle.width, paddle.y + r);
    ctx.lineTo(paddle.x + paddle.width, paddle.y + paddle.height - r);
    ctx.quadraticCurveTo(paddle.x + paddle.width, paddle.y + paddle.height, paddle.x + paddle.width - r, paddle.y + paddle.height);
    ctx.lineTo(paddle.x + r, paddle.y + paddle.height);
    ctx.quadraticCurveTo(paddle.x, paddle.y + paddle.height, paddle.x, paddle.y + paddle.height - r);
    ctx.lineTo(paddle.x, paddle.y + r);
    ctx.quadraticCurveTo(paddle.x, paddle.y, paddle.x + r, paddle.y);
    ctx.closePath();
    ctx.fill();

    // Draw Ball
    ctx.shadowBlur = 15;
    ctx.shadowColor = ball.color;
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update();
    draw(ctx);
    requestRef.current = requestAnimationFrame(animate);
  }, [update, draw]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      resetGame();
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameRef.current.keys.left = true;
      if (e.key === 'ArrowRight') gameRef.current.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameRef.current.keys.left = false;
      if (e.key === 'ArrowRight') gameRef.current.keys.right = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = GAME_WIDTH / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      gameRef.current.paddle.x = mouseX - gameRef.current.paddle.width / 2;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="max-w-full max-h-full border-4 border-slate-800 rounded-lg shadow-2xl"
      />
    </div>
  );
};

export default GameCanvas;
