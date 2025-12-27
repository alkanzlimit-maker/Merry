
export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  gravity: number;
  friction: number;
}

export interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: Point[];
  distanceToTarget: number;
  exploded: boolean;
}

export interface Snowflake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  wind: number;
}
