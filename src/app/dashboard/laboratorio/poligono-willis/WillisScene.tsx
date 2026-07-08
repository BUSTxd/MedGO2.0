'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Escena 3D del polígono de Willis (React Three Fiber).
//
// Cada vaso definido en willisModel.ts se convierte en curva suave
// (CatmullRomCurve3) + tubo (TubeGeometry) y se organiza en la jerarquía de
// grupos de la sección 5.3 del brief. Cada mesh lleva su `name` exacto.
//
// Interacción: clic sobre un vaso → lo resalta y muestra su nombre legible en una
// etiqueta flotante (útil para revisar/corregir la anatomía). Clic en vacío
// deselecciona.
//
// Vista inicial oblicua ántero-inferior (como se ve el polígono en los atlas),
// con OrbitControls e iluminación ambiental + direccional. Un único material rojo
// arterial se reutiliza; las perforantes usan una variante algo translúcida y el
// vaso seleccionado un material resaltado.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  VESSELS, GROUP_ORDER, ARTERY_COLOR,
  type Vessel, type GroupId,
} from './willisModel';
import styles from '@/styles/poligonoWillis.module.css';

interface Built {
  vessel: Vessel;
  geo: THREE.TubeGeometry;
  mid: THREE.Vector3;   // punto medio de la curva → ancla de la etiqueta
}

// Construye la geometría de tubo de un vaso a partir de sus puntos de control.
function build(v: Vessel): Built {
  const curve = new THREE.CatmullRomCurve3(
    v.points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'catmullrom',
    0.5,
  );
  // Segmentos tubulares proporcionales al nº de tramos (curvas más largas → más
  // segmentos) para que las curvas se lean suaves sin facetas.
  const tubular = Math.max(24, (v.points.length - 1) * 20);
  const geo = new THREE.TubeGeometry(curve, tubular, v.radius, 12, false);
  return { vessel: v, geo, mid: curve.getPoint(0.5) };
}

function Vessels() {
  const [selected, setSelected] = useState<string | null>(null);

  // Materiales compartidos (spec 5.2): rojo arterial para el anillo/ramas, una
  // variante translúcida para las perforantes y un resaltado para la selección.
  const { solid, perforator, highlight } = useMemo(() => ({
    solid: new THREE.MeshStandardMaterial({ color: ARTERY_COLOR, roughness: 0.5, metalness: 0.05 }),
    perforator: new THREE.MeshStandardMaterial({
      color: ARTERY_COLOR, roughness: 0.5, metalness: 0.05, transparent: true, opacity: 0.85,
    }),
    highlight: new THREE.MeshStandardMaterial({
      color: '#ff5a3c', emissive: '#ff3b1e', emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.05,
    }),
  }), []);

  // Geometrías memoizadas y agrupadas por GroupId.
  const grouped = useMemo(() => {
    const map = new Map<GroupId, Built[]>();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const v of VESSELS) map.get(v.group)!.push(build(v));
    return map;
  }, []);

  const selectedBuilt = useMemo(
    () => (selected ? [...grouped.values()].flat().find((b) => b.vessel.name === selected) ?? null : null),
    [grouped, selected],
  );

  return (
    <group name="CircleOfWillisAndSurroundings" onPointerMissed={() => setSelected(null)}>
      {GROUP_ORDER.map((g) => (
        <group key={g} name={g}>
          {grouped.get(g)!.map(({ vessel, geo }) => {
            const isSel = vessel.name === selected;
            const mat = isSel ? highlight : vessel.opacity < 1 ? perforator : solid;
            return (
              <mesh
                key={vessel.name}
                name={vessel.name}
                geometry={geo}
                material={mat}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((prev) => (prev === vessel.name ? null : vessel.name));
                }}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
              />
            );
          })}
        </group>
      ))}

      {selectedBuilt && (
        <Html position={selectedBuilt.mid} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div className={styles.tag}>{selectedBuilt.vessel.label}</div>
        </Html>
      )}
    </group>
  );
}

// Diana de la cámara: centro aproximado del conjunto (el sistema es alto en Y,
// desde la ACoA arriba hasta las vertebrales/espinal anterior abajo).
const TARGET: [number, number, number] = [0, -2.4, -0.3];

export default function WillisScene() {
  return (
    <Canvas
      camera={{ position: [2.6, -8.4, 7.6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      onCreated={({ camera }) => camera.lookAt(...TARGET)}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, -2, 8]} intensity={1.0} />
      <directionalLight position={[-5, 4, -4]} intensity={0.35} />

      <Vessels />

      <OrbitControls
        makeDefault
        target={TARGET}
        enablePan={false}
        minDistance={5}
        maxDistance={22}
      />
    </Canvas>
  );
}
