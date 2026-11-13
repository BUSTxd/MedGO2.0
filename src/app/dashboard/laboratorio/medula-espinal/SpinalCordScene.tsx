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
import type { Senalado } from './SpinalCordSimulator';
import type { Tramo } from './engine/cordon';

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
  senalado: Senalado;
  reinicio: number;
  /** Tramo del núcleo elegido en la vista Médula (se ilumina). */
  luz: Tramo | null;
  /** Modo práctica del corte (colores neutros y marcas de la corrección). */
  practica?: { ok: Set<string>; mal: Set<string> } | null;
  meningesVisible: Record<MeningeId, boolean>;
  showMeninges: boolean;
  showDura: boolean;
  showRoots: boolean;
  showEtiquetas: boolean;
  onClickLamina?: (id: LaminaGroupId) => void;
  onClickTract?: (id: TractId) => void;
  onSelectRegion: (id: LevelId) => void;
  onSenalar: (s: Senalado) => void;
  onDeseleccionar: () => void;
}

const labelStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(26, 26, 46, 0.78)',
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
  const { rx, ry } = LEVELS[level].corte;
  const offY = rx * ry + 0.55;
  const offX = rx + 0.8;
  return (
    <>
      <Html position={[0, offY, 0.17]} center style={labelStyle}>Dorsal (posterior)</Html>
      <Html position={[0, -offY, 0.17]} center style={labelStyle}>Ventral (anterior)</Html>
      <Html position={[offX, 0, 0.17]} center style={labelStyle}>Lateral</Html>
      <Html position={[-offX, 0, 0.17]} center style={labelStyle}>Lateral</Html>
    </>
  );
}

// Reencuadra cámara y target de OrbitControls según el modo activo, y cada vez
// que se pulsa «Restablecer vista» (sube `reinicio`).
function CameraRig({ isFull, reinicio }: { isFull: boolean; reinicio: number }) {
  const { camera, controls, size } = useThree();
  const aspecto = size.width / Math.max(size.height, 1);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // Distancia que hace entrar el modelo y sus etiquetas en el lienzo, sea
    // cual sea su proporción (el escenario ocupa toda la altura, como el atlas).
    const t = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const [medioAlto, medioAncho] = isFull ? [7.3, 2.3] : [2.2, 2.75];
    const dist = Math.max(medioAlto / t, medioAncho / (t * aspecto));
    if (isFull) {
      cam.position.set(dist * 0.16, 0.2, dist);
    } else {
      cam.position.set(0, 0, dist);
    }
    cam.updateProjectionMatrix();
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (oc) {
      oc.target.set(0, isFull ? -1.3 : 0.17, isFull ? 0 : 0.17);
      oc.update();
    }
  }, [isFull, reinicio, camera, controls, aspecto]);
  return null;
}

function Scene(props: SceneProps) {
  const isFull = props.mode === 'completa';
  return (
    <>
      {isFull ? (
        // Médula completa: luz de cielo/suelo, principal y contraluz para que
        // el tejido tenga volumen y brillo húmedo.
        <>
          <ambientLight intensity={0.25} />
          <hemisphereLight args={['#ffffff', '#b9a397', 0.75]} />
          <directionalLight position={[5, 7, 9]} intensity={1.5} />
          <directionalLight position={[-6, 2, -7]} intensity={0.7} color="#dfe8ff" />
          <directionalLight position={[0, -6, 4]} intensity={0.25} />
        </>
      ) : (
        // Cortes: luz plana, que ya da el resultado calcado de Gray.
        <>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 4, 6]} intensity={1.0} />
          <directionalLight position={[-4, -2, -3]} intensity={0.3} />
        </>
      )}

      <CameraRig isFull={isFull} reinicio={props.reinicio} />

      {isFull ? (
        <FullCord
          selectedLevel={props.level}
          onSelectRegion={props.onSelectRegion}
          onSenalar={props.onSenalar}
          luz={props.luz}
          showDura={props.showDura}
          showRoots={props.showRoots}
          showEtiquetas={props.showEtiquetas}
        />
      ) : (
        <>
          <RefAxes />
          {props.showEtiquetas && <OrientationLabels level={props.level} />}

          <CrossSection
            level={props.level}
            showTracts={props.showTracts}
            showLaminae={props.showLaminae}
            selectedLamina={props.selectedLamina}
            selectedTract={props.selectedTract}
            highlightTracts={props.highlightTracts}
            highlightLaminae={props.highlightLaminae}
            highlightSide={props.highlightSide}
            senalado={props.senalado}
            onSenalar={props.onSenalar}
            practica={props.practica}
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
        maxDistance={40}
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
      onPointerMissed={props.onDeseleccionar}
    >
      <Scene {...props} />
    </Canvas>
  );
}
