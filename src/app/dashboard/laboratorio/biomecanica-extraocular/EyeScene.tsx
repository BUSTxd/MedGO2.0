'use client';
// Escena 3D (React Three Fiber). Mantiene el cuaternión actual del globo, lo
// amortigua hacia el objetivo (modo individual / grupo) y lo aplica al grupo que
// contiene el globo + la flecha de mirada. Los músculos viven en el marco fijo y
// recalculan su geometría leyendo el cuaternión actual cada frame.

import { useRef, type CSSProperties } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import Globe, { GLOBE_RADIUS } from './Globe';
import Muscle from './Muscle';
import { dampQuaternion, MUSCLE_LIST } from './engine/kinematics';
import type { MuscleId } from './engine/muscles';

interface SceneProps {
  targetQuat: THREE.Quaternion;
  activeMuscles: Set<MuscleId>;
  focusMuscles: Set<MuscleId> | null;
  onMuscleDown: (id: MuscleId) => void;
  onMuscleUp: () => void;
}

function GazeArrow() {
  return (
    <group>
      <mesh position={[0, 0, GLOBE_RADIUS + 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
        <meshStandardMaterial color="#3b9edd" emissive="#3b9edd" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, GLOBE_RADIUS + 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 12]} />
        <meshStandardMaterial color="#3b9edd" emissive="#3b9edd" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function RefAxes() {
  const L = 2.6;
  return (
    <group>
      <Line points={[[-L, 0, 0], [L, 0, 0]]} color="#888" opacity={0.18} transparent lineWidth={1} />
      <Line points={[[0, -L, 0], [0, L, 0]]} color="#888" opacity={0.18} transparent lineWidth={1} />
      <Line points={[[0, 0, -L], [0, 0, L]]} color="#888" opacity={0.12} transparent lineWidth={1} />
    </group>
  );
}

// Etiqueta de orientación anclada en 3D. Para el OD: nasal/medial = -X, temporal/
// lateral = +X. Al estar ancladas en la escena (no en pantalla), siguen siendo
// correctas aunque el usuario rote la vista.
const orientStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '3px 9px',
  borderRadius: '999px',
  background: 'rgba(232, 91, 74, 0.92)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
};

function OrientationLabels() {
  return (
    <>
      <Html position={[-3.1, 1.9, 0]} center style={orientStyle}>Medial (nasal)</Html>
      <Html position={[3.1, 1.9, 0]} center style={orientStyle}>Lateral (temporal)</Html>
    </>
  );
}

function Scene({ targetQuat, activeMuscles, focusMuscles, onMuscleDown, onMuscleUp }: SceneProps) {
  const currentQuat = useRef(new THREE.Quaternion());
  const globeRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    dampQuaternion(currentQuat.current, targetQuat, 9, Math.min(dt, 0.05));
    if (globeRef.current) globeRef.current.quaternion.copy(currentQuat.current);
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} />

      <RefAxes />
      <OrientationLabels />

      {/* Grupo que rota: globo + flecha de mirada */}
      <group ref={globeRef}>
        <Globe />
        <GazeArrow />
      </group>

      {/* Músculos (marco fijo, siguen la inserción del globo) */}
      {MUSCLE_LIST.map((m) => (
        <Muscle
          key={m.id}
          muscle={m}
          quatRef={currentQuat}
          active={activeMuscles.has(m.id)}
          dimmed={focusMuscles !== null && !focusMuscles.has(m.id)}
          onDown={onMuscleDown}
          onUp={onMuscleUp}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        target={[0, 0, 0]}
        makeDefault
      />
    </>
  );
}

export default function EyeScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [2.4, 1.5, 4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
