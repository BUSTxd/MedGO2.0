'use client';
// Vista longitudinal de la médula espinal completa. Cada región (cervical,
// torácico, lumbar, sacro/cono) es una superficie de revolución (LatheGeometry)
// generada a partir del perfil de radio en anatomy.ts, lo que reproduce las dos
// intumescencias y el adelgazamiento del cono medular. Las regiones son
// clicables; se añaden surcos, raíces, cauda equina, filum terminale y un saco
// dural translúcido opcional.

import { useMemo, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { Line, Html } from '@react-three/drei';
import {
  REGIONS, cordRadiusAt, CORD_TOP, CONUS_TIP, FILUM_BOTTOM,
  type LevelId,
} from './engine/anatomy';

interface Props {
  selectedLevel: LevelId;
  onSelectRegion: (id: LevelId) => void;
  showDura: boolean;
  showRoots: boolean;
}

const labelStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(8, 10, 24, 0.78)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
};

// Construye los puntos (radio, y) de una región muestreando el perfil del cordón.
function regionProfile(yHi: number, yLo: number, capTop: boolean, capTip: boolean): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const STEP = 0.12;
  if (capTop) pts.push(new THREE.Vector2(0, yHi));
  for (let y = yHi; y > yLo; y -= STEP) {
    pts.push(new THREE.Vector2(Math.max(cordRadiusAt(y), 0.012), y));
  }
  pts.push(new THREE.Vector2(Math.max(cordRadiusAt(yLo), 0.012), yLo));
  if (capTip) pts.push(new THREE.Vector2(0, yLo));
  return pts;
}

// Curva del surco (línea sobre la superficie en un meridiano dado).
function meridian(z: -1 | 1, yHi: number, yLo: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let y = yHi; y >= yLo; y -= 0.18) {
    out.push([0, y, z * (cordRadiusAt(y) + 0.005)]);
  }
  return out;
}

// Desplazamientos deterministas de la cauda equina (sin parpadeo entre renders).
const CAUDA = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const ring = 0.18 + (i % 3) * 0.12;
  return {
    x0: Math.cos(a) * ring,
    z0: Math.sin(a) * ring,
    x1: Math.cos(a) * (0.55 + (i % 4) * 0.18),
    z1: Math.sin(a) * (0.55 + (i % 4) * 0.18),
    yStart: -3.3 - (i % 5) * 0.22,
  };
});

export default function FullCord({ selectedLevel, onSelectRegion, showDura, showRoots }: Props) {
  const [hover, setHover] = useState<LevelId | null>(null);

  const regionGeos = useMemo(() => {
    return REGIONS.map((r, i) => ({
      ...r,
      geo: new THREE.LatheGeometry(
        regionProfile(r.yHi, r.yLo, i === 0, i === REGIONS.length - 1),
        44,
      ),
    }));
  }, []);

  // Raíces nerviosas (rootlets) emergiendo lateralmente, de craneal a caudal.
  const roots = useMemo(() => {
    const out: { a: [number, number, number]; b: [number, number, number] }[] = [];
    for (let y = 4.2; y > -3.5; y -= 0.5) {
      const r = cordRadiusAt(y);
      for (const side of [-1, 1] as const) {
        out.push({
          a: [side * r, y, 0],
          b: [side * (r + 0.5), y - 0.42, 0.04],
        });
      }
    }
    return out;
  }, []);

  const duraGeo = useMemo(
    () => new THREE.CylinderGeometry(0.98, 1.04, CORD_TOP - FILUM_BOTTOM, 40, 1, true),
    [],
  );

  return (
    <group>
      {/* ── Regiones del cordón ── */}
      {regionGeos.map((r) => {
        const isSel = selectedLevel === r.id;
        const isHover = hover === r.id;
        const dim = selectedLevel !== r.id && hover !== null && hover !== r.id;
        return (
          <mesh
            key={r.id}
            geometry={r.geo}
            onClick={(e) => { e.stopPropagation(); onSelectRegion(r.id); }}
            onPointerOver={(e) => { e.stopPropagation(); setHover(r.id); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHover(null); document.body.style.cursor = 'auto'; }}
          >
            <meshStandardMaterial
              color={r.color}
              emissive={isSel || isHover ? r.color : '#000000'}
              emissiveIntensity={isSel ? 0.35 : isHover ? 0.18 : 0}
              roughness={0.55}
              metalness={0.04}
              transparent
              opacity={dim ? 0.5 : 1}
            />
          </mesh>
        );
      })}

      {/* ── Surco medio posterior (+Z) y fisura media anterior (−Z) ── */}
      <Line points={meridian(1, CORD_TOP - 0.05, CONUS_TIP + 0.1)} color="#1a1a2e" opacity={0.35} transparent lineWidth={1.5} />
      <Line points={meridian(-1, CORD_TOP - 0.05, CONUS_TIP + 0.1)} color="#1a1a2e" opacity={0.5} transparent lineWidth={2.5} />

      {/* ── Raíces nerviosas ── */}
      {showRoots && roots.map((rt, i) => (
        <Line key={i} points={[rt.a, rt.b]} color="#9aa3b8" opacity={0.7} transparent lineWidth={1.4} />
      ))}

      {/* ── Cauda equina ── */}
      {CAUDA.map((c, i) => (
        <Line
          key={`cauda-${i}`}
          points={[
            [c.x0, c.yStart, c.z0],
            [c.x0 * 1.3, (c.yStart + FILUM_BOTTOM) / 2, c.z0 * 1.3],
            [c.x1, FILUM_BOTTOM + 0.2, c.z1],
          ]}
          color="#c9b48a"
          opacity={0.6}
          transparent
          lineWidth={1.2}
        />
      ))}

      {/* ── Filum terminale ── */}
      <Line
        points={[[0, CONUS_TIP, 0], [0, FILUM_BOTTOM, 0]]}
        color="#d8d2c4"
        opacity={0.7}
        transparent
        lineWidth={2}
      />

      {/* ── Saco dural translúcido ── */}
      {showDura && (
        <mesh geometry={duraGeo} position={[0, (CORD_TOP + FILUM_BOTTOM) / 2, 0]}>
          <meshStandardMaterial
            color="#7e8aa0"
            transparent
            opacity={0.16}
            roughness={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Etiquetas ── */}
      <Html position={[0.95, 4.1, 0]} center style={{ ...labelStyle, background: 'rgba(59,158,221,0.9)' }}>Intumescencia cervical</Html>
      <Html position={[1.0, -2.4, 0]} center style={{ ...labelStyle, background: 'rgba(245,166,35,0.92)' }}>Intumescencia lumbosacra</Html>
      <Html position={[0.7, -4.35, 0]} center style={{ ...labelStyle, background: 'rgba(232,91,74,0.92)' }}>Cono medular</Html>
      <Html position={[0, FILUM_BOTTOM - 0.25, 0]} center style={labelStyle}>Cauda equina · filum terminale</Html>
    </group>
  );
}
