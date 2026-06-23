'use client';
// Escena 3D principal: Canvas de React Three Fiber. Conmuta entre la vista de
// corte transversal (láminas, tractos, meninges, clínico) y la vista de médula
// completa (cordón longitudinal). Un CameraRig reencuadra la cámara al cambiar
// de modo.

import { useEffect, type CSSProperties } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import CrossSection from './CrossSection';
import Meninges from './Meninges';
import FullCord from './FullCord';
import { LEVELS, type LevelId, type LaminaGroupId, type TractId, type MeningeId } from './engine/anatomy';
import type { ViewMode } from './ControlsPanel';

interface SceneProps {
  mode: ViewMode;
  level: LevelId;
  showTracts: boolean;
  showLaminae: boolean;
  selectedLamina: LaminaGroupId | null;
  selectedTract: TractId | null;
  highlightTracts: Set<TractId>;
  highlightLaminae: Set<LaminaGroupId>;
  highlightSide: 'left' | 'right' | 'both' | 'center' | null;
  meningesVisible: Record<MeningeId, boolean>;
  showMeninges: boolean;
  showDura: boolean;
  showRoots: boolean;
  onClickLamina?: (id: LaminaGroupId) => void;
  onClickTract?: (id: TractId) => void;
  onSelectRegion: (id: LevelId) => void;
}

const labelStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(59, 158, 221, 0.85)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  textTransform: 'uppercase' as const,
};

function RefAxes() {
  return (
    <group>
      <Line points={[[-2.4, 0, 0], [2.4, 0, 0]]} color="#888" opacity={0.12} transparent lineWidth={1} />
      <Line points={[[0, -2.4, 0], [0, 2.4, 0]]} color="#888" opacity={0.12} transparent lineWidth={1} />
    </group>
  );
}

function OrientationLabels({ level }: { level: LevelId }) {
  const r = LEVELS[level].gm.cordRadius;
  const off = r + 0.6;
  return (
    <>
      <Html position={[0, off, 0.17]} center style={labelStyle}>Dorsal (posterior)</Html>
      <Html position={[0, -off, 0.17]} center style={labelStyle}>Ventral (anterior)</Html>
      <Html position={[off + 0.2, 0, 0.17]} center style={{ ...labelStyle, background: 'rgba(232, 91, 74, 0.85)' }}>Lateral</Html>
      <Html position={[-(off + 0.2), 0, 0.17]} center style={{ ...labelStyle, background: 'rgba(232, 91, 74, 0.85)' }}>Lateral</Html>
    </>
  );
}

// Reencuadra cámara y target de OrbitControls según el modo activo.
function CameraRig({ isFull }: { isFull: boolean }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (isFull) {
      cam.position.set(3.5, 0.5, 16.5);
    } else {
      cam.position.set(0, 0, 4.5);
    }
    cam.updateProjectionMatrix();
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (oc) {
      oc.target.set(0, isFull ? -1.0 : 0.17, isFull ? 0 : 0.17);
      oc.update();
    }
  }, [isFull, camera, controls]);
  return null;
}

function Scene(props: SceneProps) {
  const isFull = props.mode === 'completa';
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 6]} intensity={1.0} />
      <directionalLight position={[-4, -2, -3]} intensity={0.3} />

      <CameraRig isFull={isFull} />

      {isFull ? (
        <FullCord
          selectedLevel={props.level}
          onSelectRegion={props.onSelectRegion}
          showDura={props.showDura}
          showRoots={props.showRoots}
        />
      ) : (
        <>
          <RefAxes />
          <OrientationLabels level={props.level} />

          <CrossSection
            level={props.level}
            showTracts={props.showTracts}
            showLaminae={props.showLaminae}
            selectedLamina={props.selectedLamina}
            selectedTract={props.selectedTract}
            highlightTracts={props.highlightTracts}
            highlightLaminae={props.highlightLaminae}
            highlightSide={props.highlightSide}
            onClickLamina={props.onClickLamina}
            onClickTract={props.onClickTract}
          />

          {props.showMeninges && (
            <Meninges level={props.level} visible={props.meningesVisible} />
          )}
        </>
      )}

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={20}
        makeDefault
      />
    </>
  );
}

export default function SpinalCordScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
