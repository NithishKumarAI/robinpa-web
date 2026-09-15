"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PHASE 2 PLACEHOLDER: RobinOrb
 * ----------------------------------------------------
 * This is a lightweight, polished visual placeholder for the Robin 3D Orb.
 * The production neural orb is currently being developed separately and
 * will replace the internals of this component once finished.
 */

interface OrbSceneProps {
  reducedMotion: boolean;
}

function OrbScene({ reducedMotion }: OrbSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions along an icosahedron shell
  const particlesGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.68, 2);
    return geo;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!reducedMotion && groupRef.current) {
      // Gentle floating breathing motion
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;

      // Subtle mouse tilt reaction
      const targetRotX = -state.pointer.y * 0.2;
      const targetRotY = state.pointer.x * 0.3;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3,
        delta
      );
    }

    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += delta * 0.18;
      outerMeshRef.current.rotation.z += delta * 0.06;
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= delta * 0.25;
      innerMeshRef.current.rotation.x -= delta * 0.12;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.18;
      pointsRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer subtle geodesic lattice */}
      <mesh ref={outerMeshRef}>
        <icosahedronGeometry args={[1.65, 3]} />
        <meshBasicMaterial
          wireframe
          color="#8B5CF6"
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Point vertices on the outer structure */}
      <points ref={pointsRef} geometry={particlesGeo}>
        <pointsMaterial
          size={0.035}
          color="#D946EF"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Inner geometric core */}
      <mesh ref={innerMeshRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          wireframe
          color="#6366F1"
          roughness={0.2}
          metalness={0.85}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
}

interface RobinOrbProps {
  className?: string;
}

export function RobinOrb({ className }: RobinOrbProps) {
  // Detect prefers-reduced-motion safely on client
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className={
        className ??
        "w-full h-72 sm:h-80 md:h-96 relative flex items-center justify-center pointer-events-none select-none"
      }
      aria-label="Robin AI visual core placeholder"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 6, 6]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-6, -6, -6]} intensity={1.0} color="#6366F1" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#D946EF" />
        <OrbScene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
