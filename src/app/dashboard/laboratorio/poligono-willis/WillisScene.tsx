'use client';
// Escena 3D del polígono de Willis (React Three Fiber). Misma arquitectura que
// la de Médula Espinal 3D: la geometría vive en engine/, aquí solo se pinta y
// se interactúa, y un CameraRig encuadra el modelo según el lienzo.
//
// Cada arteria par es dos piezas (izquierda y derecha) y las de línea media una;
// el color de cada pieza depende de la vista (Arterias, Territorios, Variantes,
// Clínico) y de lo elegido o señalado.

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  ARTERIAS, TERRITORIOS, enSistema,
  type ArteriaId, type SistemaId, type TerritorioId, type ReferenciaId,
} from './engine/anatomia';
import {
  PIEZAS, EXTRAS, CENTRO, SEMI_ALTO, SEMI_ANCHO,
  geometriaTramos, geometriaTronco, geometriaOptico, geometriaHipofisis, geometriaOculomotor, anclaEtiqueta,
  type Pieza,
} from './engine/geometria';
import { efectoVariante, afectada, type Variante, type Sindrome, type Lado } from './engine/clinica';
import type { Elegido, ModoWillis } from './WillisSimulator';

export interface SceneProps {
  mode: ModoWillis;
  sistema: SistemaId;
  elegido: Elegido;
  senalado: Elegido;
  territorio: TerritorioId | null;
  variante: Variante | null;
  sindrome: Sindrome | null;
  refs: Record<ReferenciaId, boolean>;
  etiquetas: boolean;
  reinicio: number;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  onDeseleccionar: () => void;
}

const ROJO = '#b3352e';
const AMBAR = '#f2b631';
const VIOLETA = '#7c5cd6';
const APAGADO = '#c7a5a0';

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

const elegidoStyle: CSSProperties = {
  ...labelStyle,
  fontSize: '12px',
  padding: '4px 11px',
  background: 'rgba(20, 24, 44, 0.92)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
};

// Reencuadra cámara y diana al montar y con «Restablecer vista». La vista
// inicial es la basal de los atlas, con una leve inclinación para que se lea
// la profundidad del sistema vertebrobasilar.
function CameraRig({ reinicio }: { reinicio: number }) {
  const { camera, controls, size } = useThree();
  const aspecto = size.width / Math.max(size.height, 1);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const t = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const dist = Math.max(SEMI_ALTO / t, SEMI_ANCHO / (t * aspecto)) * 1.02;
    const dir = new THREE.Vector3(0.1, -0.24, 1).normalize();
    cam.up.set(0, 1, 0);
    cam.position.set(CENTRO[0] + dir.x * dist, CENTRO[1] + dir.y * dist, CENTRO[2] + dir.z * dist);
    cam.updateProjectionMatrix();
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (oc) {
      oc.target.set(...CENTRO);
      oc.update();
    }
  }, [reinicio, camera, controls, aspecto]);
  return null;
}

/** Color y brillo de una pieza según la vista y lo elegido. */
function aspectoPieza(p: Pieza, props: SceneProps) {
  const a = ARTERIAS[p.arteria];
  const { mode, sistema, elegido, senalado, territorio, variante, sindrome } = props;
  const efecto = mode === 'variantes' ? efectoVariante(variante, p.arteria, p.lado) : { escala: 1, oculta: false, cambia: false };
  const fantasma = !enSistema(a, sistema);
  const esElegida = elegido?.kind === 'arteria' && elegido.id === p.arteria;
  const esSenalada = senalado?.kind === 'arteria' && senalado.id === p.arteria;

  let color = ROJO;
  let brillo = 0;
  let tono = '#ff4d2e';
  if (mode === 'territorios') {
    const terr = TERRITORIOS[a.territorio];
    color = territorio && territorio !== a.territorio ? '#b9b3c4' : terr.color;
    tono = terr.color;
    if (territorio === a.territorio) brillo = 0.22;
  } else if (mode === 'variantes') {
    if (efecto.cambia) { color = AMBAR; tono = AMBAR; brillo = 0.35; }
  } else if (mode === 'clinico' && sindrome) {
    if (afectada(sindrome, p.arteria, p.lado)) { color = VIOLETA; tono = VIOLETA; brillo = 0.4; } else color = APAGADO;
  }
  if (esElegida) { brillo = Math.max(brillo, 0.55); if (mode === 'arterias') color = '#e04a35'; }
  else if (esSenalada) brillo = Math.max(brillo, 0.28);
  return { color, tono, brillo, fantasma, oculta: efecto.oculta, escala: efecto.escala };
}

function PiezaArteria({ pieza, props }: { pieza: Pieza; props: SceneProps }) {
  const asp = aspectoPieza(pieza, props);
  const geo = useMemo(() => geometriaTramos(pieza.tramos, asp.escala), [pieza, asp.escala]);
  useEffect(() => () => geo.dispose(), [geo]);
  if (asp.oculta) return null;

  const yo: Elegido = { kind: 'arteria', id: pieza.arteria, lado: pieza.lado };
  const eventos = asp.fantasma ? {} : {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      props.onSenalar(yo);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      props.onSenalar(null);
      document.body.style.cursor = 'auto';
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      props.onElegir(yo);
    },
  };

  return (
    <mesh geometry={geo} userData={{ arteria: true }} {...eventos}>
      <meshPhysicalMaterial
        key={asp.fantasma ? 'fantasma' : 'solido'}
        color={asp.color}
        emissive={asp.tono}
        emissiveIntensity={asp.brillo}
        roughness={0.36}
        metalness={0}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
        transparent={asp.fantasma}
        opacity={asp.fantasma ? 0.12 : 1}
        depthWrite={!asp.fantasma}
      />
    </mesh>
  );
}

/** Vaso que solo existe en una variante (trigeminal persistente, Percheron). */
function Extra({ variante }: { variante: Variante }) {
  const geo = useMemo(() => geometriaTramos(EXTRAS[variante.extra!].tramos), [variante]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial color={AMBAR} emissive={AMBAR} emissiveIntensity={0.35} roughness={0.36} clearcoat={0.6} clearcoatRoughness={0.3} />
    </mesh>
  );
}

/** Saco aneurismático con un halo que late. */
function Saco({ centro, radio }: { centro: [number, number, number]; radio: number }) {
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const quieto = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  useFrame(({ clock }) => {
    if (halo.current) halo.current.opacity = quieto ? 0.22 : 0.12 + 0.16 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.6));
  });
  return (
    <group position={centro}>
      <mesh>
        <sphereGeometry args={[radio, 28, 20]} />
        <meshPhysicalMaterial color="#d8453a" emissive="#ff3b2a" emissiveIntensity={0.25} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      <mesh renderOrder={2}>
        <sphereGeometry args={[radio * 1.7, 28, 20]} />
        <meshBasicMaterial ref={halo} color="#ff6a4d" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Estructuras vecinas: tronco, vía óptica, hipófisis y III par. */
function Referencias(props: SceneProps) {
  const tronco = useMemo(() => geometriaTronco(), []);
  const optico = useMemo(() => geometriaOptico(), []);
  const hipofisis = useMemo(() => geometriaHipofisis(), []);
  const nervio3i = useMemo(() => geometriaOculomotor('i'), []);
  const nervio3d = useMemo(() => geometriaOculomotor('d'), []);
  useEffect(() => () => {
    tronco.dispose(); optico.dispose(); hipofisis.dispose(); nervio3i.dispose(); nervio3d.dispose();
  }, [tronco, optico, hipofisis, nervio3i, nervio3d]);

  const { refs, elegido, senalado, sindrome, mode } = props;
  const marca = (id: ReferenciaId) =>
    (elegido?.kind === 'ref' && elegido.id === id) ? 0.4 : (senalado?.kind === 'ref' && senalado.id === id) ? 0.2 : 0;
  // El síndrome que lesiona el III par lo enseña aunque esté oculto, y solo
  // pinta de violeta el del lado afectado.
  const iiiClinico = mode === 'clinico' && !!sindrome?.nervio3;
  const iiiAfectado = (lado: 'i' | 'd') => iiiClinico && (sindrome!.lado === 'ambos' || sindrome!.lado === lado);

  const eventos = (id: ReferenciaId, translucido: boolean) => {
    // Lo translúcido no tapa: si detrás hay una arteria, manda la arteria.
    const tapaArteria = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
      translucido && e.intersections.some((h) => h.object.userData?.arteria);
    return {
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        if (tapaArteria(e)) return;
        e.stopPropagation();
        props.onSenalar({ kind: 'ref', id });
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        props.onSenalar(null);
        document.body.style.cursor = 'auto';
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        if (tapaArteria(e)) return;
        e.stopPropagation();
        props.onElegir({ kind: 'ref', id });
      },
    };
  };

  return (
    <group>
      {refs.tronco && (
        <mesh geometry={tronco} renderOrder={1} {...eventos('tronco', true)}>
          <meshPhysicalMaterial
            color="#e2c3b6"
            emissive="#ffffff"
            emissiveIntensity={marca('tronco') * 0.3}
            transparent
            opacity={0.3}
            roughness={0.6}
            sheen={0.4}
            sheenColor="#fff0ea"
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {refs.optico && (
        <mesh geometry={optico} {...eventos('optico', false)}>
          <meshPhysicalMaterial color="#efe2cc" emissive="#fff6e0" emissiveIntensity={marca('optico')} roughness={0.5} clearcoat={0.25} sheen={0.3} sheenColor="#fff3e0" />
        </mesh>
      )}
      {refs.hipofisis && (
        <mesh geometry={hipofisis} {...eventos('hipofisis', false)}>
          <meshPhysicalMaterial color="#e3b39e" emissive="#ffd9c9" emissiveIntensity={marca('hipofisis')} roughness={0.45} clearcoat={0.3} />
        </mesh>
      )}
      {(refs.nervio3 || iiiClinico) && ([['i', nervio3i], ['d', nervio3d]] as const).map(([lado, geo]) => (
        <mesh key={lado} geometry={geo} {...eventos('nervio3', false)}>
          <meshPhysicalMaterial
            color={iiiAfectado(lado) ? VIOLETA : '#f1e3bd'}
            emissive={iiiAfectado(lado) ? VIOLETA : '#fff3c9'}
            emissiveIntensity={iiiAfectado(lado) ? 0.4 : marca('nervio3')}
            roughness={0.5}
            clearcoat={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function Etiquetas(props: SceneProps) {
  const { etiquetas, elegido, sistema, mode, variante } = props;
  const ids = Object.keys(ARTERIAS) as ArteriaId[];
  const visibles = etiquetas
    ? ids.filter((id) => enSistema(ARTERIAS[id], sistema)
      && !(mode === 'variantes' && efectoVariante(variante, id, 'i').oculta))
    : [];
  const elegida = elegido?.kind === 'arteria' ? elegido : null;
  return (
    <>
      {visibles.map((id) => {
        if (elegida?.id === id) return null; // la elegida lleva su propio rótulo
        const lado: Lado = ARTERIAS[id].par ? 'i' : 'm';
        return (
          <Html key={id} position={anclaEtiqueta(id, lado)} center style={labelStyle} zIndexRange={[10, 0]}>
            {ARTERIAS[id].corto}
          </Html>
        );
      })}
      {etiquetas && (
        <>
          <Html position={[0, 5.9, -1.4]} center style={labelStyle}>Anterior</Html>
          <Html position={[0, -11.2, 2.9]} center style={labelStyle}>Posterior</Html>
          <Html position={[-6.9, 0.4, -0.8]} center style={labelStyle}>Derecha</Html>
          <Html position={[6.9, 0.4, -0.8]} center style={labelStyle}>Izquierda</Html>
        </>
      )}
      {elegida && (
        <Html position={anclaEtiqueta(elegida.id, elegida.lado)} center style={elegidoStyle} zIndexRange={[20, 11]}>
          {ARTERIAS[elegida.id].corto}
          {ARTERIAS[elegida.id].par ? (elegida.lado === 'd' ? ' · der.' : ' · izq.') : ''}
        </Html>
      )}
    </>
  );
}

function Scene(props: SceneProps) {
  const { mode, variante, sindrome } = props;
  const saco = mode === 'clinico' ? sindrome?.saco : undefined;

  // Al salir del lienzo con el puntero encima de algo, el cursor vuelve a la normalidad.
  useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#ffffff', '#b9a397', 0.7]} />
      <directionalLight position={[5, -4, 11]} intensity={1.5} />
      <directionalLight position={[-7, 5, -6]} intensity={0.6} color="#dfe8ff" />
      <directionalLight position={[0, 8, 4]} intensity={0.3} />

      <CameraRig reinicio={props.reinicio} />

      <group>
        {PIEZAS.map((p) => (
          <PiezaArteria key={`${p.arteria}-${p.lado}`} pieza={p} props={props} />
        ))}
        {mode === 'variantes' && variante?.extra && <Extra variante={variante} />}
        {saco && <Saco centro={saco.centro} radio={saco.radio} />}
      </group>

      <Referencias {...props} />
      <Etiquetas {...props} />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={48}
        makeDefault
      />
    </>
  );
}

export default function WillisScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, -6, 20], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      onPointerMissed={props.onDeseleccionar}
    >
      <Scene {...props} />
    </Canvas>
  );
}
