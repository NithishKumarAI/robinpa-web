import {
  approach,
  createStateMix,
  hexToRgb,
  ORB_STATES,
  stateEnergy,
  stateMotion,
  type OrbState,
  type StateMix,
} from "../robin-orb/orb-state";

export const PARTICLE_COUNT = 800;
const TWO_PI = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const STATIC_TIME = 1.7;

const ERROR_FROM_RGB = hexToRgb("#ff0000");
const ERROR_TO_RGB = hexToRgb("#ff3b3b");

type Rgb = [number, number, number];

export interface PersistentParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  ringFrac: number;
  seed: number;
  tone: number;
  // Stable seeded flight offsets
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  leadLag: number;
  curveBias: number;
}

export interface RenderParams {
  ctx: CanvasRenderingContext2D;
  viewportWidth: number;
  viewportHeight: number;
  baseOrbSize: number;
  // Current interpolated state from scroll
  fromX: number;
  fromY: number;
  fromScale: number;
  toX: number;
  toY: number;
  toScale: number;
  transitionProgress: number; // 0 (fully 'from') to 1 (fully 'to')
  currentState: OrbState;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
  dt: number;
  isStatic?: boolean;
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * Builds the persistent 800 Fibonacci particles.
 * Particle identities and random seeds remain fixed for the lifetime of the application.
 */
export const buildPersistentParticles = (count: number = PARTICLE_COUNT): PersistentParticle[] => {
  const points: PersistentParticle[] = [];
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    const px = Math.cos(theta) * radiusAtY;
    const pz = Math.sin(theta) * radiusAtY;
    const seed = ((i * 0.7548776662) % 1) * TWO_PI;

    // Seeded outward and tangential scatter vector
    const randAngle = ((i * 1.6180339) % 1) * TWO_PI;
    const randElev = (((i * 0.381966) % 1) - 0.5) * Math.PI;
    const sx = Math.cos(randAngle) * Math.cos(randElev) + px * 0.85;
    const sy = Math.sin(randElev) + y * 0.85;
    const sz = Math.sin(randAngle) * Math.cos(randElev) + pz * 0.85;
    const sLen = Math.hypot(sx, sy, sz) || 1;

    // Lead/lag (-0.25 to +0.25) so outer particles leave earlier and arrive progressively
    const leadLag = (((i * 0.41421356) % 1) - 0.5) * 0.5;
    // Lateral curve factor (-1 to 1) for graceful flocking flight paths
    const curveBias = Math.sin(seed * 2.3);

    points.push({
      id: i,
      x: px,
      y,
      z: pz,
      ringFrac: (i * 0.61803398875) % 1,
      seed,
      tone: (i * 0.5436890126) % 1,
      scatterX: sx / sLen,
      scatterY: sy / sLen,
      scatterZ: sz / sLen,
      leadLag,
      curveBias,
    });
  }
  return points;
};

export class PersistentParticleEngine {
  private particles: PersistentParticle[];
  private stateMix: StateMix;
  private t: number = 0;
  private angleY: number = 0;
  private connectingPhase: number = 0;
  private readonly angleX: number = 0.32;
  private levelS: number = 0;

  constructor(particles: PersistentParticle[], initialState: OrbState = "idle", prefersReduced = false) {
    this.particles = particles;
    this.stateMix = createStateMix(initialState);
    this.t = prefersReduced ? STATIC_TIME : 0;
  }

  public render(params: RenderParams) {
    const {
      ctx,
      viewportWidth,
      viewportHeight,
      baseOrbSize,
      fromX,
      fromY,
      fromScale,
      toX,
      toY,
      toScale,
      transitionProgress,
      currentState,
      speed = 1,
      colorFrom = "#f0abfc",
      colorTo = "#818cf8",
      dt,
      isStatic = false,
    } = params;

    const easeDt = isStatic ? 60 : dt;
    const w = this.stateMix.update(currentState, easeDt);

    let ripple = 0;
    let pulse = 0;
    let flow = 0;
    for (const s of ORB_STATES) {
      const kind = stateMotion(s);
      if (kind === "ripple") ripple += w[s];
      else if (kind === "pulse") pulse += w[s];
      else if (kind === "flow") flow += w[s];
    }
    const wIdle = w.idle;
    const wConn = w.connecting;
    const wError = w.error;
    const wDisabled = w.disabled;
    const motionScale = 1 - wDisabled * 0.96;

    const rawLevel = stateEnergy(currentState, this.t);
    this.levelS = approach(this.levelS, rawLevel, 9, easeDt);
    const level = this.levelS;

    if (!isStatic) {
      const spin = (0.14 + ripple * (0.9 + level * 1.6) + flow * 0.4 + wConn * 0.3) * motionScale;
      this.angleY += dt * speed * spin;
      this.connectingPhase = (this.connectingPhase + dt * speed * 1.1) % TWO_PI;
      this.t += dt;
    }

    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);

    const isError = currentState === "error";
    const fromRgb: Rgb = isError ? ERROR_FROM_RGB : hexToRgb(colorFrom);
    const toRgb: Rgb = isError ? ERROR_TO_RGB : hexToRgb(colorTo);

    const glow = ripple + pulse + flow;
    ctx.globalCompositeOperation = !isStatic && glow > 0.5 ? "lighter" : "source-over";

    // Macro scene travel interpolation (Hold -> Travel & Scatter -> Reform)
    // p in [0, 1]
    const p = clamp01(transitionProgress);
    const startX = fromX * viewportWidth;
    const startY = fromY * viewportHeight;
    const endX = toX * viewportWidth;
    const endY = toY * viewportHeight;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const travelDist = Math.hypot(deltaX, deltaY);

    // Lateral curve normal
    const normX = travelDist > 0 ? -deltaY / travelDist : 0;
    const normY = travelDist > 0 ? deltaX / travelDist : 0;

    // Macro size interpolation
    const currentScale = fromScale + (toScale - fromScale) * p;
    const activeDiameter = baseOrbSize * currentScale;
    const baseRadius = (activeDiameter / 2) * 0.62;

    const breathe = 0.05 * (0.25 + wIdle * 0.75) * Math.sin(this.t * 1.1 * speed) * motionScale;
    const conv = pulse * (0.22 + 0.12 * Math.sin(this.t * 2.6 * speed + 1));
    const expand = flow * (0.08 + level * 0.32);
    const sphereRadius = baseRadius * (1 + breathe + level * 0.16 + expand - conv);

    const shakeAmp = wError * sphereRadius * 0.05 * motionScale;
    const shakeX = shakeAmp * (Math.sin(this.t * 26 * speed) + 0.5 * Math.sin(this.t * 15.7 * speed));
    const shakeY = shakeAmp * (Math.cos(this.t * 22.5 * speed) + 0.5 * Math.sin(this.t * 13.1 * speed));

    const idleAmp = wIdle * sphereRadius * 0.055 * motionScale;
    const jitterAmp = (flow + wError * 0.7) * sphereRadius * (0.015 + level * 0.085) * motionScale;
    const rippleAmp = ripple * (0.045 + level * 0.24);
    const pulseAmp = pulse * 0.16;
    const alphaScale = 1 - wDisabled * 0.35;

    // Render each persistent particle
    for (let i = 0; i < this.particles.length; i += 1) {
      const pt = this.particles[i];

      // Particle-specific lead/lag progression
      // Hold phase: 0 <= p < 0.12
      // Travel & Scatter: 0.12 <= p <= 0.88
      // Reform: 0.88 < p <= 1.0
      let tau = 0;
      let scatterAmount = 0;

      if (isStatic) {
        tau = p;
        scatterAmount = 0;
      } else {
        const spanStart = 0.12;
        const spanEnd = 0.88;
        const rawTau = clamp01((p - spanStart) / (spanEnd - spanStart));
        
        // Individualized offset: outer particles scatter earlier and arrive progressively
        const indivTau = clamp01((rawTau - pt.leadLag * 0.3) / 0.7);
        // Smoothstep easing for flocking flight
        tau = indivTau * indivTau * (3 - 2 * indivTau);
        // Scatter amplitude peaks mid-flight (tau = 0.5)
        scatterAmount = isStatic ? 0 : Math.sin(Math.PI * indivTau);
      }

      // Base sphere coordinate rotation in 3D
      const x1 = pt.x * cosY - pt.z * sinY;
      const z1 = pt.x * sinY + pt.z * cosY;
      const y1 = pt.y * cosX - z1 * sinX;
      const z2 = pt.y * sinX + z1 * cosX;

      const depth = (z2 + 1) / 2;
      const perspective = 0.65 + depth * 0.45;

      let pointRadius = sphereRadius;
      if (rippleAmp > 0.002) {
        pointRadius *= 1 + rippleAmp * Math.sin(pt.y * 4.5 - this.t * 6.5 * speed);
      }
      if (pulseAmp > 0.002) {
        pointRadius *= 1 - pulseAmp * (0.5 + 0.5 * Math.sin(pt.ringFrac * TWO_PI + this.t * 3.1 * speed));
      }

      let ox = shakeX;
      let oy = shakeY;
      if (idleAmp > 0.01) {
        ox +=
          idleAmp *
          (Math.sin(this.t * 0.55 * speed + pt.seed * 3.7) + 0.5 * Math.sin(this.t * 1.3 * speed + pt.seed * 1.3));
        oy +=
          idleAmp *
          (Math.cos(this.t * 0.62 * speed + pt.seed * 2.9) +
            0.5 * Math.sin(this.t * 1.05 * speed + pt.seed * 5.1));
      }
      if (jitterAmp > 0.01) {
        ox += jitterAmp * Math.sin(this.t * 14 * speed + pt.seed * 9.3);
        oy += jitterAmp * Math.cos(this.t * 17 * speed + pt.seed * 6.1);
      }

      // Travel arc offset
      const arcDisplacement = Math.sin(Math.PI * tau) * pt.curveBias * Math.min(140, travelDist * 0.18);
      const centerCurrentX = startX + deltaX * tau + normX * arcDisplacement;
      const centerCurrentY = startY + deltaY * tau + normY * arcDisplacement;

      // Scatter displacement during flight
      const scatterDistance = scatterAmount * (sphereRadius * 1.4);
      const dispX = pt.scatterX * scatterDistance;
      const dispY = pt.scatterY * scatterDistance;

      const sphereX = centerCurrentX + (x1 * pointRadius * perspective + ox) + dispX;
      const sphereY = centerCurrentY + (y1 * pointRadius * perspective + oy) + dispY;

      const sphereAlpha = (0.12 + depth * depth * 0.78) * alphaScale;
      const sphereDot = Math.max(0.6, (0.6 + depth * 1.5) * (currentScale >= 1 ? 1 : 0.9));

      let screenX = sphereX;
      let screenY = sphereY;
      let alpha = sphereAlpha;
      let dot = sphereDot;

      // Connecting rings state
      if (wConn > 0.004) {
        const base = (i / this.particles.length) * TWO_PI;
        const jitter = 0.05 * Math.sin(this.t * 1.3 + pt.seed);
        const ringAngle = base + this.connectingPhase + jitter;
        const currentOrbRadius = activeDiameter / 2;
        const ringR =
          currentOrbRadius * (0.58 + 0.13 * pt.ringFrac) * (1 + 0.05 * Math.sin(this.t + pt.seed * 1.7));
        const circleX = centerCurrentX + Math.cos(ringAngle) * ringR;
        const circleY = centerCurrentY + Math.sin(ringAngle) * ringR;
        const ringAlpha = 0.35 + pt.tone * 0.5;
        const ringDot = 0.75 + pt.tone * 0.9;

        screenX = sphereX + (circleX - sphereX) * wConn;
        screenY = sphereY + (circleY - sphereY) * wConn;
        alpha = sphereAlpha + (ringAlpha - sphereAlpha) * wConn;
        dot = sphereDot + (ringDot - sphereDot) * wConn;
      }

      const cr = fromRgb[0] + (toRgb[0] - fromRgb[0]) * pt.tone;
      const cg = fromRgb[1] + (toRgb[1] - fromRgb[1]) * pt.tone;
      const cb = fromRgb[2] + (toRgb[2] - fromRgb[2]) * pt.tone;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha.toFixed(3)})`;
      ctx.arc(screenX, screenY, dot, 0, TWO_PI);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }
}
