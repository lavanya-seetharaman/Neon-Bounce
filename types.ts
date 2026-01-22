
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Ball {
  pos: Vector2D;
  vel: Vector2D;
  radius: number;
  color: string;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface GameMetrics {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  level: number;
}
