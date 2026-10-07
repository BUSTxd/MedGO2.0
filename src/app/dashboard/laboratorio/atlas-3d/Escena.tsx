'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Color, MeshStandardMaterial, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SISTEMA } from '@/lib/data/atlas-3d/regiones';
import type { PiezaAtlas } from '@/lib/atlas-3d/cargar';
import s from '@/styles/atlas3d.module.css';

/** Qué se vuelve translúcido (lo seleccionado siempre queda opaco). */
export type Transparencia = 'ninguna' | 'musculos' | 'todo';

export type Vista = 'anterior' | 'posterior' | 'lateral' | 'medial';

/** Pedido de cámara: cambia `n` para repetir el mismo encuadre. */
export interface PeticionCamara {
  vista: Vista;
  /** Caja a encuadrar (lo visible). */
  min: Vector3;
  max: Vector3;
  n: number;
}

interface Props {
  piezas: PiezaAtlas[];
  visibles: Set<string>;
  seleccion: Set<string>;
  rotulo: string | null;
  /** Varios rótulos a la vez (repaso): cada uno en el centro de sus piezas.
   *  `clave` los vuelve a montar (y a mostrar) al cambiar de paso. */
  rotulos?: { texto: string; ids: Set<string>; clave: string }[];
  transparencia: Transparencia;
  /** Si llega, decide qué piezas van translúcidas (en vez de `transparencia`). */
  translucidas?: Set<string>;
  camara: PeticionCamara;
  reducido: boolean;
  onSelect: (id: string | null) => void;
  onAislar: (id: string) => void;
}

const FOV = 30;
/** Movimiento máximo (px) entre apretar y soltar para contar como toque. */
const TOQUE = 5;

export default function Escena(props: Props) {
  const apretado = useRef<{ x: number; y: number } | null>(null);
  // Estable: `Pieza` va con memo y no debe repintarse las 179 por esto.
  const esToque = useCallback((e: { clientX: number; clientY: number }) => {
    const a = apretado.current;
    return !a || Math.hypot(e.clientX - a.x, e.clientY - a.y) <= TOQUE;
  }, []);

  return (
    <Canvas
      className={s.lienzo}
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ fov: FOV, near: 0.01, far: 50, position: [0, 1.1, 2] }}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={(e) => {
        apretado.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMissed={(e) => {
        if (esToque(e)) props.onSelect(null);
      }}
    >
      <hemisphereLight args={['#ffffff', '#8d8479', 1.15]} />
      <directionalLight position={[-2, 4, 3]} intensity={1.9} />
      <directionalLight position={[2, 2, -3]} intensity={0.9} />
      <Controles peticion={props.camara} reducido={props.reducido} />
      <Invalidar deps={[props.visibles, props.seleccion, props.transparencia, props.translucidas, props.rotulos]} />
      {props.piezas.map((p) =>
        props.visibles.has(p.id) ? (
          <Pieza
            key={p.id}
            pieza={p}
            seleccionada={props.seleccion.has(p.id)}
            translucida={
              props.translucidas
                ? props.translucidas.has(p.id)
                : props.transparencia === 'todo' || (props.transparencia === 'musculos' && p.sistema === 'musculo')
            }
            esToque={esToque}
            onSelect={props.onSelect}
            onAislar={props.onAislar}
          />
        ) : null,
      )}
      {/* El nombre de lo tocado se va solo: ya está en la ficha del panel. La key lo
          vuelve a montar (y a mostrar) al tocar otra estructura. */}
      {props.rotulo && <Rotulo key={props.rotulo} piezas={props.piezas} ids={props.seleccion} texto={props.rotulo} efimero />}
      {props.rotulos?.map((r) => <Rotulo key={r.clave} piezas={props.piezas} ids={r.ids} texto={r.texto} efimero="largo" />)}
    </Canvas>
  );
}

/** En `frameloop="demand"`, pide un fotograma cuando cambia algo de fuera. */
function Invalidar({ deps }: { deps: unknown[] }) {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
    // Las dependencias son exactamente lo que llega de fuera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return null;
}

const COLOR_SELECCION = new Color('#3b9edd');
const COLOR_HOVER = new Color('#ffffff');
const NEGRO = new Color('#000000');

const Pieza = memo(function Pieza({
  pieza,
  seleccionada,
  translucida,
  esToque,
  onSelect,
  onAislar,
}: {
  pieza: PiezaAtlas;
  seleccionada: boolean;
  translucida: boolean;
  esToque: (e: { clientX: number; clientY: number }) => boolean;
  onSelect: (id: string | null) => void;
  onAislar: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const { invalidate } = useThree();
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: SISTEMA[pieza.sistema].color,
        roughness: pieza.sistema === 'hueso' ? 0.72 : 0.55,
        metalness: 0.04,
      }),
    [pieza.sistema],
  );
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    material.emissive.copy(seleccionada ? COLOR_SELECCION : hover ? COLOR_HOVER : NEGRO);
    material.emissiveIntensity = seleccionada ? 0.55 : hover ? 0.14 : 0;
    // Lo seleccionado se ve entero aunque los músculos estén translúcidos.
    const vidrio = translucida && !seleccionada;
    material.transparent = vidrio;
    material.opacity = vidrio ? 0.28 : 1;
    material.depthWrite = !vidrio;
    material.needsUpdate = true;
    invalidate();
  }, [material, seleccionada, hover, translucida, invalidate]);

  return (
    <mesh
      geometry={pieza.geometry}
      material={material}
      renderOrder={translucida ? 1 : 0}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = '';
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (esToque(e.nativeEvent)) onSelect(pieza.id);
      }}
      onDoubleClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onAislar(pieza.id);
      }}
    />
  );
});

/** Nombre clavado en el centro de unas piezas, de tamaño fijo. */
/** `efimero`: se va solo (corto = lo tocado; largo = los del paso del repaso, que son varios para leer). */
function Rotulo({ piezas, ids, texto, efimero }: { piezas: PiezaAtlas[]; ids: Set<string>; texto: string; efimero?: true | 'largo' }) {
  const centro = useMemo(() => {
    const c = new Vector3();
    let n = 0;
    for (const p of piezas) {
      if (!ids.has(p.id)) continue;
      c.add(p.centro);
      n++;
    }
    return n ? c.divideScalar(n) : null;
  }, [piezas, ids]);
  if (!centro) return null;
  return (
    <Html position={centro} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <span className={efimero ? `${s.rotulo} ${efimero === 'largo' ? s.rotuloEfimeroLargo : s.rotuloEfimero}` : s.rotulo}>{texto}</span>
    </Html>
  );
}

/** Dirección desde la que mira cada vista (+X = izquierda del cuerpo, +Z anterior). */
const DIRECCION: Record<Vista, [number, number, number]> = {
  anterior: [0.18, 0.08, 1],
  posterior: [-0.18, 0.08, -1],
  // En un miembro derecho lo lateral está hacia −X.
  lateral: [-1, 0.08, 0.18],
  medial: [1, 0.08, 0.18],
};

/** Órbita y vuelo de cámara hacia el encuadre pedido. */
function Controles({ peticion, reducido }: { peticion: PeticionCamara; reducido: boolean }) {
  const ref = useRef<OrbitControlsImpl>(null);
  const { camera, invalidate, size } = useThree();
  const vuelo = useRef<{ desde: Vector3; hasta: Vector3; oDesde: Vector3; oHasta: Vector3; t: number } | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const centro = peticion.min.clone().add(peticion.max).multiplyScalar(0.5);
    const tam = peticion.max.clone().sub(peticion.min);
    // Distancia para que quepa el alto y el ancho (el ancho según el aspecto del lienzo).
    const aspecto = size.width / Math.max(size.height, 1);
    const medioV = Math.tan(((FOV / 2) * Math.PI) / 180);
    const alto = tam.y / 2 / medioV;
    const ancho = Math.max(tam.x, tam.z) / 2 / (medioV * aspecto);
    const distancia = Math.max(alto, ancho, 0.12) * 1.18 + Math.max(tam.x, tam.z) / 2;
    const hasta = new Vector3(...DIRECCION[peticion.vista]).normalize().multiplyScalar(distancia).add(centro);

    if (reducido) {
      camera.position.copy(hasta);
      c.target.copy(centro);
      c.update();
      invalidate();
      return;
    }
    vuelo.current = { desde: camera.position.clone(), hasta, oDesde: c.target.clone(), oHasta: centro, t: 0 };
    invalidate();
    // El tamaño del lienzo solo cuenta al pedir el encuadre, no al redimensionar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peticion, camera, reducido, invalidate]);

  useFrame((_, dt) => {
    const v = vuelo.current;
    const c = ref.current;
    if (!v || !c) return;
    v.t = Math.min(v.t + dt / 0.8, 1);
    const k = v.t < 0.5 ? 4 * v.t ** 3 : 1 - (-2 * v.t + 2) ** 3 / 2;
    camera.position.lerpVectors(v.desde, v.hasta, k);
    c.target.lerpVectors(v.oDesde, v.oHasta, k);
    c.update();
    if (v.t >= 1) vuelo.current = null;
    else invalidate();
  });

  return <OrbitControls ref={ref} makeDefault enableDamping={false} minDistance={0.05} maxDistance={6} />;
}
