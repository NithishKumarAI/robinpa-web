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

export const PARTICLE_COUNT = 2000;
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
  // Physically coherent deterministic flight offsets
  releaseOffset: number; // 0 (releases first) to 1 (releases last)
  arrivalOffset: number; // 0 (arrives first) to 1 (arrives last)
  streamBias: number;    // Lateral flock spread (-1 to 1)
  bendBias: number;      // Per-particle curvature variation (-1 to 1)
  depthBias: number;     // Parallax variation during flight (-1 to 1)
  trailEligible: boolean;// Subtle velocity trail during active travel
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
  activeCount?: number;
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * C2-continuous smootherstep polynomial: 6t^5 - 15t^4 + 10t^3.
 * First and second derivatives are zero at both t=0 and t=1, guaranteeing zero-shock release and arrival.
 */
export const smootherstep = (t: number): number => {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
};

/**
 * Builds the persistent Fibonacci particles (default 2000).
 * Particle identities and random seeds remain fixed for the lifetime of the application.
 */
export const buildPersistentParticles = (count: number = PARTICLE_COUNT): PersistentParticle[] => {
  const points: PersistentParticle[] = [];
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    const px = Math.cos(theta) * radiusAtY;
    const pz = Math.sin(theta) * radiusAtY;
    const seed = ((i * 0.7548776662) % 1) * TWO_PI;

    // Depth normalization for stagger (front particles peel first, inner/back follow)
    const zNorm = (pz + 1) * 0.5;
    const hashA = (i * 0.41421356) % 1;
    const hashB = (i * 0.82842712) % 1;

    // Release offset: normalized [0, 1], guaranteeing releaseDelay >= 0
    const releaseOffset = 0.55 * (1 - zNorm) + 0.45 * hashA;
    // Arrival offset: normalized [0, 1], progressive convergence into destination
    const arrivalOffset = 0.55 * zNorm + 0.45 * hashB;

    // Flow & curvature biases for coherent flocking stream
    const streamBias = Math.sin(seed * 2.3);
    const bendBias = Math.cos(seed * 1.7);
    const depthBias = Math.sin(seed * 3.1);

    // Subtle velocity trail restricted to ~16% of particles
    const trailEligible = i % 6 === 0;

    points.push({
      id: i,
      x: px,
      y,
      z: pz,
      ringFrac: (i * 0.61803398875) % 1,
      seed,
      tone: (i * 0.5436890126) % 1,
      releaseOffset,
      arrivalOffset,
      streamBias,
      bendBias,
      depthBias,
      trailEligible,
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
      activeCount,
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

    // Macro scene travel progress p in [0, 1]
    const p = clamp01(transitionProgress);

    // During active travel, gently reduce rotation rate so the neural flock streamlines cleanly
    const travelDampen = isStatic ? 1 : 1 - 0.55 * Math.sin(Math.PI * p);

    if (!isStatic) {
      const spin = (0.14 + ripple * (0.9 + level * 1.6) + flow * 0.4 + wConn * 0.3) * motionScale * travelDampen;
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

    // Macro scene coordinates
    const startX = fromX * viewportWidth;
    const startY = fromY * viewportHeight;
    const endX = toX * viewportWidth;
    const endY = toY * viewportHeight;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const travelDist = Math.hypot(deltaX, deltaY);

    // Lateral curve normal (unit vector)
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

    const srcDiameter = baseOrbSize * fromScale;
    const srcRadius = (srcDiameter / 2) * 0.62 * (1 + breathe + level * 0.16 + expand - conv);
    const destDiameter = baseOrbSize * toScale;
    const destRadius = (destDiameter / 2) * 0.62 * (1 + breathe + level * 0.16 + expand - conv);

    const shakeAmp = wError * sphereRadius * 0.05 * motionScale;
    const shakeX = shakeAmp * (Math.sin(this.t * 26 * speed) + 0.5 * Math.sin(this.t * 15.7 * speed));
    const shakeY = shakeAmp * (Math.cos(this.t * 22.5 * speed) + 0.5 * Math.sin(this.t * 13.1 * speed));

    const idleAmp = wIdle * sphereRadius * 0.055 * motionScale;
    const jitterAmp = (flow + wError * 0.7) * sphereRadius * (0.015 + level * 0.085) * motionScale;
    const rippleAmp = ripple * (0.045 + level * 0.24);
    const pulseAmp = pulse * 0.16;
    const alphaScale = 1 - wDisabled * 0.35;

    // Gentle macro flow bend (replacing single giant arc)
    const bendSign = deltaX >= 0 ? 1 : -1;
    const macroBend = Math.min(90, travelDist * 0.11) * bendSign;

    // Number of active particles for current viewport
    const totalToRender = Math.min(this.particles.length, activeCount ?? this.particles.length);

    // Scale factor for dot sizes
    const scaleFactor = Math.max(0.75, Math.min(1.25, currentScale));

    // Render persistent particles
    for (let i = 0; i < totalToRender; i += 1) {
      const pt = this.particles[i];

      // Physical progression with C2-continuous smootherstep envelope
      // Guaranteed:
      // When p <= 0.16: tau = 0 strictly for all particles
      // When p >= 0.90: tau = 1 strictly for all particles
      // Zero displacement jump at boundaries
      let tau = 0;
      let prevTau = 0;

      if (isStatic) {
        tau = p;
        prevTau = Math.max(0, p - 0.02);
      } else {
        const pRel = 0.16 + pt.releaseOffset * 0.12; // [0.16, 0.28]
        const pArr = 0.78 + pt.arrivalOffset * 0.12; // [0.78, 0.90]

        if (p <= pRel) {
          tau = 0;
          prevTau = 0;
        } else if (p >= pArr) {
          tau = 1;
          prevTau = 1;
        } else {
          const s = (p - pRel) / (pArr - pRel);
          tau = smootherstep(s);
          const prevS = Math.max(0, s - 0.03);
          prevTau = smootherstep(prevS);
        }
      }

      // Base sphere coordinate rotation in 3D
      const x1 = pt.x * cosY - pt.z * sinY;
      const z1 = pt.x * sinY + pt.z * cosY;
      const y1 = pt.y * cosX - z1 * sinX;
      const z2 = pt.y * sinX + z1 * cosX;

      const baseDepth = (z2 + 1) * 0.5;

      // Dynamics
      let radSrc = srcRadius;
      let radDest = destRadius;
      if (rippleAmp > 0.002) {
        const rMod = 1 + rippleAmp * Math.sin(pt.y * 4.5 - this.t * 6.5 * speed);
        radSrc *= rMod;
        radDest *= rMod;
      }
      if (pulseAmp > 0.002) {
        const pMod = 1 - pulseAmp * (0.5 + 0.5 * Math.sin(pt.ringFrac * TWO_PI + this.t * 3.1 * speed));
        radSrc *= pMod;
        radDest *= pMod;
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

      const persp = 0.65 + baseDepth * 0.45;

      // Source settled position P0
      const p0X = startX + x1 * radSrc * persp + ox;
      const p0Y = startY + y1 * radSrc * persp + oy;

      // Destination settled position P3
      const p3X = endX + x1 * radDest * persp + ox;
      const p3Y = endY + y1 * radDest * persp + oy;

      // Cubic Bézier control points P1 & P2 with coherent flow vectors
      const particleCurvature = pt.bendBias * Math.min(45, travelDist * 0.06);
      const totalNormOffset = (macroBend + particleCurvature);

      const p1X = p0X + deltaX * 0.38 + normX * totalNormOffset;
      const p1Y = p0Y + deltaY * 0.38 + normY * totalNormOffset;
      const p2X = p3X - deltaX * 0.38 + normX * totalNormOffset;
      const p2Y = p3Y - deltaY * 0.38 + normY * totalNormOffset;

      // Cubic Bézier evaluation at tau
      const u = 1 - tau;
      const u2 = u * u;
      const u3 = u2 * u;
      const t2 = tau * tau;
      const t3 = t2 * tau;

      const bezierX = u3 * p0X + 3 * u2 * tau * p1X + 3 * u * t2 * p2X + t3 * p3X;
      const bezierY = u3 * p0Y + 3 * u2 * tau * p1Y + 3 * u * t2 * p2Y + t3 * p3Y;

      // Gentle flock stream spread (enveloped so it vanishes at tau=0 and tau=1)
      const flightEnvelope = Math.sin(Math.PI * tau);
      const streamSpread = pt.streamBias * Math.min(36, srcRadius * 0.40) * flightEnvelope;
      const flockDispX = normX * streamSpread;
      const flockDispY = normY * streamSpread;

      const sphereX = bezierX + flockDispX;
      const sphereY = bezierY + flockDispY;

      // Depth falloff & soft dimensionality
      const depth = clamp01(baseDepth + pt.depthBias * 0.10 * flightEnvelope);
      const sphereAlpha = (0.10 + depth * depth * 0.74) * alphaScale;
      const sphereDot = Math.max(0.55, (0.55 + depth * 1.40) * scaleFactor);

      let screenX = sphereX;
      let screenY = sphereY;
      let alpha = sphereAlpha;
      let dot = sphereDot;

      // Connecting rings state
      if (wConn > 0.004) {
        const centerCurrentX = startX + deltaX * tau;
        const centerCurrentY = startY + deltaY * tau;
        const base = (i / totalToRender) * TWO_PI;
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

      // Subtle deterministic velocity trails during active flight (restricted to ~16% of particles)
      if (!isStatic && pt.trailEligible && tau > 0.18 && tau < 0.82 && travelDist > 30) {
        const pu = 1 - prevTau;
        const pu2 = pu * pu;
        const pu3 = pu2 * pu;
        const pt2 = prevTau * prevTau;
        const pt3 = pt2 * prevTau;

        const prevBzX = pu3 * p0X + 3 * pu2 * prevTau * p1X + 3 * pu * pt2 * p2X + pt3 * p3X;
        const prevBzY = pu3 * p0Y + 3 * pu2 * prevTau * p1Y + 3 * pu * pt2 * p2Y + pt3 * p3Y;
        const prevEnv = Math.sin(Math.PI * prevTau);
        const prevSpread = pt.streamBias * Math.min(36, srcRadius * 0.40) * prevEnv;
        const prevX = prevBzX + normX * prevSpread;
        const prevY = prevBzY + normY * prevSpread;

        const trailDistX = screenX - prevX;
        const trailDistY = screenY - prevY;
        const trailLen = Math.hypot(trailDistX, trailDistY);

        if (trailLen >= 0.8 && trailLen <= 10) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${(alpha * 0.22).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.5, dot * 0.7);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(${cr | 0}, ${cg | 0}, ${cb | 0}, ${alpha.toFixed(3)})`;
      ctx.arc(screenX, screenY, dot, 0, TWO_PI);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }
}
