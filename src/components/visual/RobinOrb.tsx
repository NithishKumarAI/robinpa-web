"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.12;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.7, 8]} />
      <meshStandardMaterial
        wireframe
        color="#8B5CF6"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

interface RobinOrbProps {
  className?: string;
}

/**
 * Placeholder component for the Robin 3D Orb.
 * The production custom 3D orb will be plugged into this module once ready.
 */
export function RobinOrb({ className }: RobinOrbProps) {
  return (
    <div
      className={
        className ??
        "w-full h-80 relative flex items-center justify-center pointer-events-none select-none"
      }
      aria-label="Robin AI visual core placeholder"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]} intensity={1.2} color="#6366F1" />
        <pointLight position={[-8, -8, -8]} intensity={0.8} color="#D946EF" />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
