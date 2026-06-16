'use client';
// Globo ocular simple (no fotorrealista): esclerótica + córnea translúcida + iris
// plano + pupila básica + marca de las 12 para visualizar la torsión. Va dentro
// del grupo que rota, así que todo gira solidario con el globo.

import * as THREE from 'three';

export const GLOBE_RADIUS = 1.2;

export default function Globe() {
  return (
    <group>
      {/* Esclerótica */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshStandardMaterial color="#f4f2ea" roughness={0.55} metalness={0.02} />
      </mesh>

      {/* Iris (disco plano en el polo corneal, mirando a +Z) */}
      <mesh position={[0, 0, GLOBE_RADIUS - 0.02]}>
        <circleGeometry args={[0.52, 48]} />
        <meshStandardMaterial color="#6b4a2b" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Pupila */}
      <mesh position={[0, 0, GLOBE_RADIUS - 0.01]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#101015" roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Córnea translúcida abombada sobre el iris */}
      <mesh position={[0, 0, GLOBE_RADIUS - 0.35]}>
        <sphereGeometry args={[0.62, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color="#bfe3ff"
          transparent
          opacity={0.28}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Marca de las 12 (referencia de torsión) */}
      <mesh position={[0, 0.45, GLOBE_RADIUS - 0.02]}>
        <circleGeometry args={[0.07, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
