'use client';
// Vista longitudinal de la médula espinal completa, con aspecto de pieza real:
// cordón ovalado con su fisura y surcos (la misma forma que los cortes),
// 31 pares de nervios con raicillas, raíces, ganglios y nervio espinal, cauda
// equina, filum terminal, arterias espinales y saco dural translúcido. La
// geometría vive en engine/cordon.ts; aquí solo se pinta y se interactúa.
//
// El cordón es una sola malla: la región se deduce de la altura del punto
// tocado, y la elegida o señalada se tiñe con su color (colores por vértice).

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { CONUS_TIP, type LevelId } from './engine/anatomy';
import {
  geometriaCordon, colorearCordon, geometriaNervios, geometriaArterias, geometriaSaco,
  geometriaTramo, regionEnY, COXIS, type Tramo,
} from './engine/cordon';
import type { Senalado } from './SpinalCordSimulator';

interface Props {
  selectedLevel: LevelId;
  onSelectRegion: (id: LevelId) => void;
  onSenalar?: (s: Senalado) => void;
  showDura: boolean;
  showRoots: boolean;
  /** Etiquetas (intumescencias, cono, cauda): se pueden ocultar si tapan. */
  showEtiquetas: boolean;
  /** Tramo que ocupa el núcleo elegido: se ilumina. */
  luz?: Tramo | null;
}

/** Funda de luz sobre el tramo de un núcleo, con un latido suave. */
function Halo({ tramo }: { tramo: Tramo }) {
  const geo = useMemo(() => geometriaTramo(tramo), [tramo]);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const quieto = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.opacity = quieto ? 0.16 : 0.1 + 0.1 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.4));
  });
  return (
    <mesh geometry={geo} renderOrder={2}>
      <meshBasicMaterial
        ref={mat}
        color="#ffd56b"
        vertexColors
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const labelStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(26, 26, 46, 0.78)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
};

export default function FullCord({ selectedLevel, onSelectRegion, onSenalar, showDura, showRoots, showEtiquetas, luz = null }: Props) {
  const [hover, setHover] = useState<LevelId | null>(null);

  const cordon = useMemo(() => geometriaCordon(), []);
  const nervios = useMemo(() => geometriaNervios(), []);
  const arterias = useMemo(() => geometriaArterias(), []);
  const saco = useMemo(() => geometriaSaco(), []);

  // Tinte de la región elegida y de la señalada.
  useEffect(() => { colorearCordon(cordon, selectedLevel, hover, luz); }, [cordon, selectedLevel, hover, luz]);

  // Libera la memoria de la GPU al salir de la vista.
  useEffect(() => () => {
    cordon.dispose(); nervios.raices.dispose(); nervios.ganglios.dispose(); arterias.dispose(); saco.dispose();
    document.body.style.cursor = 'auto';
  }, [cordon, nervios, arterias, saco]);

  const mover = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const r = regionEnY(e.point.y);
    if (r !== hover) {
      setHover(r);
      onSenalar?.(r ? { kind: 'region', id: r } : null);
    }
    document.body.style.cursor = r ? 'pointer' : 'auto';
  };
  const salir = () => {
    setHover(null);
    onSenalar?.(null);
    document.body.style.cursor = 'auto';
  };
  const tocar = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const r = regionEnY(e.point.y);
    if (r) onSelectRegion(r);
  };

  return (
    <group>
      {/* ── Cordón ── */}
      <mesh geometry={cordon} onPointerMove={mover} onPointerOut={salir} onClick={tocar}>
        <meshPhysicalMaterial
          vertexColors
          roughness={0.48}
          metalness={0}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
          sheen={0.4}
          sheenRoughness={0.6}
          sheenColor="#f6d9cf"
        />
      </mesh>

      {/* ── Tramo del núcleo elegido, iluminado ── */}
      {luz && <Halo tramo={luz} />}

      {/* ── Arterias espinales (anterior y posteriores) ── */}
      <mesh geometry={arterias}>
        <meshPhysicalMaterial color="#963530" roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>

      {/* ── Nervios: raicillas, raíces, nervio espinal, cauda equina y filum ── */}
      {showRoots && (
        <>
          <mesh geometry={nervios.raices}>
            <meshPhysicalMaterial color="#efe2cc" roughness={0.5} clearcoat={0.25} clearcoatRoughness={0.5} sheen={0.3} sheenColor="#fff3e0" />
          </mesh>
          <mesh geometry={nervios.ganglios}>
            <meshPhysicalMaterial color="#d8b48f" roughness={0.45} clearcoat={0.3} clearcoatRoughness={0.4} />
          </mesh>
        </>
      )}

      {/* ── Saco dural translúcido (termina en S2) ── */}
      {showDura && (
        <mesh geometry={saco}>
          <meshPhysicalMaterial
            color="#c9d1df"
            transparent
            opacity={0.2}
            roughness={0.35}
            clearcoat={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Etiquetas (se pueden ocultar desde el panel) ── */}
      {showEtiquetas && (<>
      <Html position={[1.05, 4.1, 0]} center style={{ ...labelStyle, background: 'rgba(59,158,221,0.92)' }}>Intumescencia cervical</Html>
      <Html position={[1.1, -2.4, 0]} center style={{ ...labelStyle, background: 'rgba(214,138,20,0.95)' }}>Intumescencia lumbosacra</Html>
      <Html position={[0.75, CONUS_TIP + 0.1, 0]} center style={{ ...labelStyle, background: 'rgba(232,91,74,0.92)' }}>Cono medular</Html>
      <Html position={[0, COXIS - 0.3, 0]} center style={labelStyle}>Cauda equina · filum terminal</Html>
      </>)}
    </group>
  );
}
