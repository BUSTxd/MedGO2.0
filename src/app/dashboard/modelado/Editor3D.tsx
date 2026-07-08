'use client';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, ContactShadows } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeVertices, mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import styles from '@/styles/modelado.module.css';

/* ── Tipos ──────────────────────────────────────────────────────────── */

type TipoPrimitiva = 'cubo' | 'esfera' | 'cilindro' | 'cono' | 'toro' | 'capsula';
type TipoFigura = TipoPrimitiva | 'importado';
type Vec3 = [number, number, number];
type Modo = 'translate' | 'rotate' | 'scale';
type ModoEditor = Modo | 'deformar';

interface Figura {
  id: string;
  tipo: TipoFigura;
  color: string;
  posicion: Vec3;
  rotacion: Vec3;
  escala: Vec3;
  redondez: number;  // 0..1 — curvatura/suavidad de la figura
  doblar: number;    // -1..1 — curva el eje vertical (1 = anillo completo)
  torcer: number;    // -1..1 — gira la parte superior en espiral
  estrechar: number; // -1..1 — afila (+) o ensancha (-) la parte superior
  geoId?: string;    // solo tipo 'importado': clave en GEOS_IMPORTADAS
  groupId: string | null;
}

type CamposDeforme = Pick<Figura, 'doblar' | 'torcer' | 'estrechar'>;

/* ── Geometrías importadas (GLB/GLTF del usuario) ───────────────────────
   Viven fuera del estado React: el historial de deshacer solo guarda ids,
   y para localStorage se serializan a base64 (posiciones + índice). */

const GEOS_IMPORTADAS = new Map<string, THREE.BufferGeometry>();

interface GeoGuardada { pos: string; idx?: string; idx32?: boolean }

function bufABase64(buf: ArrayBufferView): string {
  const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

function base64ABuf(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function serializarGeo(g: THREE.BufferGeometry): GeoGuardada {
  const pos = g.attributes.position as THREE.BufferAttribute;
  const out: GeoGuardada = { pos: bufABase64(pos.array as Float32Array) };
  if (g.index) {
    out.idx = bufABase64(g.index.array as Uint16Array | Uint32Array);
    out.idx32 = g.index.array instanceof Uint32Array;
  }
  return out;
}

function deserializarGeo(d: GeoGuardada): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const posU8 = base64ABuf(d.pos);
  g.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(posU8.buffer, 0, posU8.byteLength / 4), 3),
  );
  if (d.idx) {
    const idxU8 = base64ABuf(d.idx);
    g.setIndex(new THREE.BufferAttribute(
      d.idx32
        ? new Uint32Array(idxU8.buffer, 0, idxU8.byteLength / 4)
        : new Uint16Array(idxU8.buffer, 0, idxU8.byteLength / 2),
      1,
    ));
  }
  g.computeVertexNormals();
  return g;
}

interface Grupo {
  id: string;
  posicion: Vec3;
  rotacion: Vec3;
  escala: Vec3;
}

interface Escena {
  figuras: Figura[];
  grupos: Grupo[];
}

const CLAVE_STORAGE = 'medgo-modelado-escena';
const MIME_FIGURA = 'text/medgo-figura';

/* ── Catálogo de figuras (toolbar) ──────────────────────────────────── */

const CATALOGO: { tipo: TipoPrimitiva; label: string; icono: React.ReactNode }[] = [
  {
    tipo: 'cubo',
    label: 'Cubo',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25L12 2.5Z" />
        <path stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M3.5 7.25L12 12L20.5 7.25" />
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 12V21.5" />
      </svg>
    ),
  },
  {
    tipo: 'esfera',
    label: 'Esfera',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    tipo: 'cilindro',
    label: 'Cilindro',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5.5" rx="7" ry="2.8" stroke="currentColor" strokeWidth="1.8" />
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5 5.5V18.5M19 5.5V18.5" />
        <path stroke="currentColor" strokeWidth="1.8" d="M5 18.5C5 20.05 8.13 21.3 12 21.3C15.87 21.3 19 20.05 19 18.5" />
      </svg>
    ),
  },
  {
    tipo: 'cono',
    label: 'Cono',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 2.8L5 18.3M12 2.8L19 18.3" />
        <ellipse cx="12" cy="18.3" rx="7" ry="2.9" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    tipo: 'toro',
    label: 'Toro',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="9" ry="5.6" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="12" cy="12" rx="3.4" ry="1.7" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    tipo: 'capsula',
    label: 'Cápsula',
    icono: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="7.2" y="2.8" width="9.6" height="18.4" rx="4.8" stroke="currentColor" strokeWidth="1.8" />
        <path stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M7.6 12H16.4" />
      </svg>
    ),
  },
];

const PALETA = [
  '#3b9edd', '#2CA9BC', '#8B5CF6', '#F59E0B', '#EF4444',
  '#10B981', '#EC4899', '#e8b08c', '#94A3B8', '#334155',
];

/* ── Utilidades ─────────────────────────────────────────────────────── */

let contador = 0;
const nid = () => `f${Date.now().toString(36)}${(contador++).toString(36)}`;

/**
 * Deforma los vértices de la geometría a lo largo del eje Y local.
 * Orden de aplicación: estrechar (taper) → torcer (twist) → doblar (bend).
 * Con doblar=1 el eje se curva 360° (un cilindro se vuelve un anillo;
 * a medio camino, una herradura).
 */
function aplicarDeformacion(geo: THREE.BufferGeometry, d: CamposDeforme) {
  geo.computeBoundingBox();
  const caja = geo.boundingBox!;
  const alto = Math.max(caja.max.y - caja.min.y, 1e-6);
  const yCentro = (caja.max.y + caja.min.y) / 2;
  const pos = geo.attributes.position as THREE.BufferAttribute;

  const theta = d.doblar * Math.PI * 2;
  const radio = Math.abs(theta) > 0.02 ? alto / theta : 0;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    const u = (y - caja.min.y) / alto; // 0 = base, 1 = tope

    // Estrechar: la base queda fija, el tope se afila o ensancha
    const s = Math.max(0.05, 1 - d.estrechar * u);
    x *= s;
    z *= s;

    // Torcer: rotación progresiva alrededor del eje Y (giro completo al 100%)
    if (Math.abs(d.torcer) > 0.001) {
      const ang = d.torcer * Math.PI * 2 * u;
      const cx = Math.cos(ang) * x - Math.sin(ang) * z;
      z = Math.sin(ang) * x + Math.cos(ang) * z;
      x = cx;
    }

    // Doblar: el eje Y se envuelve sobre un arco de radio alto/theta
    if (radio !== 0) {
      const a = (y - yCentro) / radio;
      const nx = radio - (radio - x) * Math.cos(a);
      y = yCentro + (radio - x) * Math.sin(a);
      x = nx;
    }

    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function crearGeometria(f: Figura): THREE.BufferGeometry {
  const { tipo, redondez } = f;
  const t = Math.min(1, Math.max(0, redondez));
  // Las deformaciones necesitan resolución vertical para curvarse con suavidad
  const deformando =
    Math.abs(f.doblar) > 0.01 || Math.abs(f.torcer) > 0.01 || Math.abs(f.estrechar) > 0.01;
  const segY = deformando ? 32 : 1;

  let geo: THREE.BufferGeometry;
  switch (tipo) {
    case 'importado':
      geo = (f.geoId && GEOS_IMPORTADAS.get(f.geoId)?.clone()) || new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'cubo':
      geo = t <= 0.02
        ? new THREE.BoxGeometry(1, 1, 1, deformando ? 8 : 1, segY, deformando ? 8 : 1)
        : new RoundedBoxGeometry(1, 1, 1, deformando ? 16 : 3 + Math.round(t * 4), t * 0.42);
      break;
    case 'esfera': {
      const seg = 6 + Math.round(t * 42);
      geo = new THREE.SphereGeometry(
        0.62, seg, Math.max(deformando ? 24 : 4, Math.round(seg * 0.7)),
      );
      break;
    }
    case 'cilindro':
      geo = new THREE.CylinderGeometry(0.5, 0.5, 1.15, 3 + Math.round(t * 45), segY);
      break;
    case 'cono':
      geo = new THREE.ConeGeometry(0.6, 1.2, 3 + Math.round(t * 45), segY);
      break;
    case 'toro':
      geo = new THREE.TorusGeometry(0.48, 0.2, 3 + Math.round(t * 15), 4 + Math.round(t * 48));
      break;
    case 'capsula':
      geo = new THREE.CapsuleGeometry(
        0.4, 0.65, Math.max(2 + Math.round(t * 12), deformando ? 16 : 2), 3 + Math.round(t * 45),
      );
      break;
  }
  if (deformando) aplicarDeformacion(geo, f);
  return geo;
}

const matrizDe = (t: { posicion: Vec3; rotacion: Vec3; escala: Vec3 }) =>
  new THREE.Matrix4().compose(
    new THREE.Vector3(...t.posicion),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...t.rotacion)),
    new THREE.Vector3(...t.escala),
  );

function descomponer(m: THREE.Matrix4): { posicion: Vec3; rotacion: Vec3; escala: Vec3 } {
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  m.decompose(p, q, s);
  const e = new THREE.Euler().setFromQuaternion(q);
  return { posicion: [p.x, p.y, p.z], rotacion: [e.x, e.y, e.z], escala: [s.x, s.y, s.z] };
}

function nuevaFigura(tipo: TipoPrimitiva, punto?: THREE.Vector3): Figura {
  const alturas: Record<TipoPrimitiva, number> = {
    cubo: 0.5, esfera: 0.62, cilindro: 0.58, cono: 0.6, toro: 0.2, capsula: 0.73,
  };
  const p = punto ?? new THREE.Vector3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3);
  return {
    id: nid(),
    tipo,
    color: PALETA[Math.floor(Math.random() * 6)],
    posicion: [p.x, alturas[tipo], p.z],
    rotacion: tipo === 'toro' ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    escala: [1, 1, 1],
    redondez: tipo === 'cubo' ? 0.12 : 0.9,
    doblar: 0,
    torcer: 0,
    estrechar: 0,
    groupId: null,
  };
}

function escenaInicial(): Escena {
  if (typeof window !== 'undefined') {
    try {
      const crudo = localStorage.getItem(CLAVE_STORAGE);
      if (crudo) {
        const dato = JSON.parse(crudo) as Escena & { geos?: Record<string, GeoGuardada> };
        if (Array.isArray(dato.figuras) && Array.isArray(dato.grupos)) {
          if (dato.geos) {
            for (const [id, g] of Object.entries(dato.geos)) {
              try { GEOS_IMPORTADAS.set(id, deserializarGeo(g)); } catch { /* geo corrupta: se omite */ }
            }
          }
          const figuras = dato.figuras
            // Importadas cuya geometría no se pudo recuperar se descartan
            .filter((f) => f.tipo !== 'importado' || (f.geoId && GEOS_IMPORTADAS.has(f.geoId)))
            // Escenas guardadas antes de los deformadores: rellenar campos nuevos
            .map((f) => ({
              ...f,
              doblar: f.doblar ?? 0,
              torcer: f.torcer ?? 0,
              estrechar: f.estrechar ?? 0,
            }));
          return { figuras, grupos: dato.grupos };
        }
      }
    } catch { /* estado corrupto → escena demo */ }
  }
  const cubo = nuevaFigura('cubo', new THREE.Vector3(-1.1, 0, 0));
  cubo.color = '#3b9edd';
  cubo.redondez = 0.3;
  const esfera = nuevaFigura('esfera', new THREE.Vector3(1.1, 0, 0.4));
  esfera.color = '#8B5CF6';
  return { figuras: [cubo, esfera], grupos: [] };
}

/* ── Mesh de una figura ─────────────────────────────────────────────── */

function FiguraMesh({
  figura, resaltada, registrar, onSelect, onDeformar,
}: {
  figura: Figura;
  resaltada: boolean;
  registrar: (id: string, obj: THREE.Object3D | null) => void;
  onSelect: (figId: string, aditivo: boolean) => void;
  onDeformar: (figId: string, ev: PointerEvent) => boolean;
}) {
  const geo = useMemo(
    () => crearGeometria(figura),
    [figura.tipo, figura.redondez, figura.doblar, figura.torcer, figura.estrechar, figura.geoId], // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(() => () => geo.dispose(), [geo]);

  const plano = figura.tipo !== 'cubo' && figura.tipo !== 'importado' && figura.redondez < 0.5;

  return (
    <mesh
      ref={(o) => registrar(figura.id, o)}
      geometry={geo}
      position={figura.posicion}
      rotation={figura.rotacion}
      scale={figura.escala}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onSelect(figura.id, e.nativeEvent.ctrlKey || e.nativeEvent.metaKey || e.nativeEvent.shiftKey);
      }}
      onPointerDown={(e) => {
        if (onDeformar(figura.id, e.nativeEvent)) e.stopPropagation();
      }}
    >
      <meshStandardMaterial
        key={plano ? 'plano' : 'suave'}
        color={figura.color}
        flatShading={plano}
        roughness={0.45}
        metalness={0.08}
        emissive={resaltada ? '#3b9edd' : '#000000'}
        emissiveIntensity={resaltada ? 0.38 : 0}
      />
    </mesh>
  );
}

/* ── Editor principal ───────────────────────────────────────────────── */

export default function Editor3D() {
  const [escena, setEscena] = useState<Escena>(escenaInicial);
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [modo, setModo] = useState<ModoEditor>('translate');
  const [, refrescar] = useReducer((x: number) => x + 1, 0);

  const { figuras, grupos } = escena;
  const nodos = useRef(new Map<string, THREE.Object3D>());
  const raizRef = useRef<THREE.Group>(null);
  const camaraRef = useRef<THREE.Camera | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const archivoRef = useRef<HTMLInputElement>(null);
  const modoRef = useRef(modo);
  modoRef.current = modo;
  const seleccionRef = useRef(seleccion);
  seleccionRef.current = seleccion;

  /* ── Historial (deshacer/rehacer) ── */

  const escenaRef = useRef(escena);
  escenaRef.current = escena;
  const historial = useRef<Escena[]>([]);
  const futuro = useRef<Escena[]>([]);
  const claveCoalesce = useRef<string | null>(null);
  const tUltimaMutacion = useRef(0);

  // Toda mutación de la escena pasa por aquí. `coalesce` agrupa ráfagas de
  // la misma interacción (arrastre de un slider) en un solo paso de deshacer.
  const mutar = useCallback((fn: (e: Escena) => Escena, coalesce?: string) => {
    const ahora = Date.now();
    const mismaRafaga =
      coalesce != null &&
      coalesce === claveCoalesce.current &&
      ahora - tUltimaMutacion.current < 1000;
    if (!mismaRafaga) {
      historial.current.push(escenaRef.current);
      if (historial.current.length > 60) historial.current.shift();
    }
    claveCoalesce.current = coalesce ?? null;
    tUltimaMutacion.current = ahora;
    futuro.current = [];
    setEscena(fn);
  }, []);

  const podarSeleccion = (e: Escena) =>
    setSeleccion((sel) => sel.filter(
      (id) => e.figuras.some((f) => f.id === id) || e.grupos.some((g) => g.id === id),
    ));

  const deshacer = useCallback(() => {
    const previa = historial.current.pop();
    if (!previa) return;
    futuro.current.push(escenaRef.current);
    claveCoalesce.current = null;
    setEscena(previa);
    podarSeleccion(previa);
  }, []);

  const rehacer = useCallback(() => {
    const siguiente = futuro.current.pop();
    if (!siguiente) return;
    historial.current.push(escenaRef.current);
    claveCoalesce.current = null;
    setEscena(siguiente);
    podarSeleccion(siguiente);
  }, []);

  const setFiguras = (fn: (fs: Figura[]) => Figura[], coalesce?: string) =>
    mutar((e) => ({ ...e, figuras: fn(e.figuras) }), coalesce);
  const setGrupos = (fn: (gs: Grupo[]) => Grupo[], coalesce?: string) =>
    mutar((e) => ({ ...e, grupos: fn(e.grupos) }), coalesce);

  /* Persistencia (las geometrías importadas van en base64 junto a la escena) */
  useEffect(() => {
    try {
      const geos: Record<string, GeoGuardada> = {};
      for (const f of escena.figuras) {
        if (f.geoId && !geos[f.geoId]) {
          const g = GEOS_IMPORTADAS.get(f.geoId);
          if (g) geos[f.geoId] = serializarGeo(g);
        }
      }
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify({ ...escena, geos }));
    } catch {
      // Modelos importados demasiado grandes para localStorage:
      // guardar al menos las primitivas para no perder la escena.
      try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(escena)); } catch { /* bloqueado */ }
    }
  }, [escena]);

  /* Los refs de los meshes se asignan después del render: un repintado
     extra garantiza que TransformControls encuentre su objeto. */
  useEffect(() => { refrescar(); }, [seleccion, figuras.length, grupos.length]);

  const registrar = useCallback((id: string, obj: THREE.Object3D | null) => {
    if (obj) nodos.current.set(id, obj);
    else nodos.current.delete(id);
  }, []);

  /* ── Selección ── */

  const unidadDe = useCallback((figId: string) => {
    const f = figuras.find((x) => x.id === figId);
    return f?.groupId ?? figId;
  }, [figuras]);

  const seleccionar = useCallback((figId: string, aditivo: boolean) => {
    const unidad = unidadDe(figId);
    setSeleccion((sel) => {
      if (!aditivo) return [unidad];
      return sel.includes(unidad) ? sel.filter((s) => s !== unidad) : [...sel, unidad];
    });
  }, [unidadDe]);

  // Figuras a resaltar (miembros de grupos seleccionados incluidos)
  const resaltadas = useMemo(() => {
    const set = new Set<string>();
    for (const id of seleccion) {
      if (grupos.some((g) => g.id === id)) {
        figuras.forEach((f) => { if (f.groupId === id) set.add(f.id); });
      } else set.add(id);
    }
    return set;
  }, [seleccion, figuras, grupos]);

  // Figuras afectadas por cambios de color/curvatura
  const figurasSel = useMemo(
    () => figuras.filter((f) => resaltadas.has(f.id)),
    [figuras, resaltadas],
  );

  const unidadActiva = seleccion.length === 1 ? seleccion[0] : null;
  const objetoActivo = unidadActiva ? nodos.current.get(unidadActiva) : undefined;
  const grupoActivo = unidadActiva ? grupos.find((g) => g.id === unidadActiva) : undefined;
  const figuraActiva = unidadActiva ? figuras.find((f) => f.id === unidadActiva) : undefined;
  const escalaActiva: Vec3 | null = grupoActivo?.escala ?? figuraActiva?.escala ?? null;

  /* ── Alta de figuras (clic o arrastre) ── */

  const agregarFigura = useCallback((tipo: TipoPrimitiva, punto?: THREE.Vector3) => {
    const f = nuevaFigura(tipo, punto);
    mutar((e) => ({ ...e, figuras: [...e.figuras, f] }));
    setSeleccion([f.id]);
  }, [mutar]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const tipo = e.dataTransfer.getData(MIME_FIGURA) as TipoPrimitiva;
    if (!tipo || !camaraRef.current || !lienzoRef.current) return;
    const rect = lienzoRef.current.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, camaraRef.current);
    const punto = new THREE.Vector3();
    if (ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), punto)) {
      punto.clampScalar(-8, 8);
      agregarFigura(tipo, punto);
    } else {
      agregarFigura(tipo);
    }
  }, [agregarFigura]);

  /* ── Deformar con el mouse (modo "Deformar") ──
     Arrastre sobre la figura: horizontal dobla, vertical estrecha,
     con Shift el horizontal tuerce. Devuelve true si capturó el gesto. */

  const iniciarDeformeMouse = useCallback((figId: string, ev: PointerEvent): boolean => {
    if (modoRef.current !== 'deformar') return false;
    const esc = escenaRef.current;
    const fig = esc.figuras.find((f) => f.id === figId);
    if (!fig) return false;

    // Afecta a toda la selección si la figura pertenece a ella; si no, solo a ella
    const unidad = fig.groupId ?? fig.id;
    const afectadas = new Set<string>();
    const expandir = (id: string) => {
      if (esc.grupos.some((g) => g.id === id)) {
        esc.figuras.forEach((f) => { if (f.groupId === id) afectadas.add(f.id); });
      } else afectadas.add(id);
    };
    if (seleccionRef.current.includes(unidad)) seleccionRef.current.forEach(expandir);
    else {
      setSeleccion([unidad]);
      expandir(unidad);
    }

    const base = new Map<string, CamposDeforme>();
    esc.figuras.forEach((f) => {
      if (afectadas.has(f.id)) base.set(f.id, { doblar: f.doblar, torcer: f.torcer, estrechar: f.estrechar });
    });

    const x0 = ev.clientX;
    const y0 = ev.clientY;
    if (orbitRef.current) orbitRef.current.enabled = false;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - x0) / 220;
      const dy = (y0 - e.clientY) / 220;
      mutar((e2) => ({
        ...e2,
        figuras: e2.figuras.map((f) => {
          const b = base.get(f.id);
          if (!b) return f;
          return e.shiftKey
            ? { ...f, torcer: clamp(b.torcer + dx), estrechar: clamp(b.estrechar + dy) }
            : { ...f, doblar: clamp(b.doblar + dx), estrechar: clamp(b.estrechar + dy) };
        }),
      }), 'mouse-deforme');
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (orbitRef.current) orbitRef.current.enabled = true;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return true;
  }, [mutar]);

  /* ── Importar un modelo GLB/GLTF del usuario ── */

  const importarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    let buffer: ArrayBuffer;
    try {
      buffer = await archivo.arrayBuffer();
    } catch {
      window.alert('No se pudo leer el archivo.');
      return;
    }
    new GLTFLoader().parse(
      buffer,
      '',
      (gltf) => {
        // Fusionar todas las mallas del archivo en una sola geometría editable
        const partes: THREE.BufferGeometry[] = [];
        let color: string | undefined;
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          let g = (mesh.geometry as THREE.BufferGeometry).clone();
          g.applyMatrix4(mesh.matrixWorld);
          if (g.index) g = g.toNonIndexed();
          for (const attr of Object.keys(g.attributes)) {
            if (attr !== 'position') g.deleteAttribute(attr);
          }
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (!color && mat?.color) color = `#${mat.color.getHexString()}`;
          partes.push(g);
        });
        if (!partes.length) {
          window.alert('El archivo no contiene mallas 3D.');
          return;
        }
        let geo = partes.length === 1 ? partes[0] : mergeGeometries(partes, false);
        if (!geo) {
          window.alert('No se pudieron combinar las mallas del modelo.');
          return;
        }
        geo = mergeVertices(geo, 1e-4);

        // Normalizar: centrado en el origen y tamaño máximo ~1.6 unidades
        geo.computeBoundingBox();
        const caja = geo.boundingBox!;
        const centro = caja.getCenter(new THREE.Vector3());
        const dims = caja.getSize(new THREE.Vector3());
        const factor = 1.6 / Math.max(dims.x, dims.y, dims.z, 1e-6);
        geo.translate(-centro.x, -centro.y, -centro.z);
        geo.scale(factor, factor, factor);
        geo.computeVertexNormals();

        const gid = nid();
        GEOS_IMPORTADAS.set(gid, geo);
        const f: Figura = {
          id: nid(),
          tipo: 'importado',
          geoId: gid,
          color: color ?? '#94A3B8',
          posicion: [0, (dims.y * factor) / 2, 0],
          rotacion: [0, 0, 0],
          escala: [1, 1, 1],
          redondez: 0,
          doblar: 0,
          torcer: 0,
          estrechar: 0,
          groupId: null,
        };
        mutar((e2) => ({ ...e2, figuras: [...e2.figuras, f] }));
        setSeleccion([f.id]);
      },
      () => window.alert('No se pudo cargar el modelo. Debe ser GLB/GLTF sin compresión Draco.'),
    );
  };

  /* ── Transformación (commit al soltar el gizmo) ── */

  const confirmarTransformacion = useCallback(() => {
    if (!unidadActiva) return;
    const obj = nodos.current.get(unidadActiva);
    if (!obj) return;
    const pos: Vec3 = [obj.position.x, obj.position.y, obj.position.z];
    const rot: Vec3 = [obj.rotation.x, obj.rotation.y, obj.rotation.z];
    const esc: Vec3 = [obj.scale.x, obj.scale.y, obj.scale.z];
    if (grupos.some((g) => g.id === unidadActiva)) {
      setGrupos((gs) => gs.map((g) =>
        g.id === unidadActiva ? { ...g, posicion: pos, rotacion: rot, escala: esc } : g));
    } else {
      setFiguras((fs) => fs.map((f) =>
        f.id === unidadActiva ? { ...f, posicion: pos, rotacion: rot, escala: esc } : f));
    }
  }, [unidadActiva, grupos]);

  /* ── Acciones ── */

  const aplicarColor = (color: string) => {
    if (!figurasSel.length) return;
    setFiguras((fs) => fs.map((f) => (resaltadas.has(f.id) ? { ...f, color } : f)), 'color');
  };

  const aplicarCurvatura = (r: number) => {
    if (!figurasSel.length) return;
    setFiguras((fs) => fs.map((f) => (resaltadas.has(f.id) ? { ...f, redondez: r } : f)), 'curvatura');
  };

  const aplicarDeforme = (campo: keyof CamposDeforme, valor: number) => {
    if (!figurasSel.length) return;
    setFiguras((fs) => fs.map((f) => (resaltadas.has(f.id) ? { ...f, [campo]: valor } : f)), campo);
  };

  const restablecerDeforme = () => {
    if (!figurasSel.length) return;
    setFiguras((fs) => fs.map((f) =>
      resaltadas.has(f.id) ? { ...f, doblar: 0, torcer: 0, estrechar: 0 } : f));
  };

  const aplicarEscalaEje = (eje: 0 | 1 | 2, valor: number) => {
    if (!unidadActiva) return;
    const cambia = <T extends { escala: Vec3 }>(t: T): T => {
      const esc = [...t.escala] as Vec3;
      esc[eje] = valor;
      return { ...t, escala: esc };
    };
    const clave = `escala-${eje}`;
    if (grupoActivo) setGrupos((gs) => gs.map((g) => (g.id === unidadActiva ? cambia(g) : g)), clave);
    else setFiguras((fs) => fs.map((f) => (f.id === unidadActiva ? cambia(f) : f)), clave);
  };

  const eliminarSeleccion = useCallback(() => {
    if (!seleccion.length) return;
    const setSel = new Set(seleccion);
    mutar((e) => ({
      figuras: e.figuras.filter((f) => !setSel.has(f.id) && !(f.groupId && setSel.has(f.groupId))),
      grupos: e.grupos.filter((g) => !setSel.has(g.id)),
    }));
    setSeleccion([]);
  }, [seleccion, mutar]);

  const duplicarSeleccion = () => {
    if (!seleccion.length) return;
    const nuevasFiguras: Figura[] = [];
    const nuevosGrupos: Grupo[] = [];
    const nuevaSel: string[] = [];
    for (const id of seleccion) {
      const g = grupos.find((x) => x.id === id);
      if (g) {
        const gid = nid();
        nuevosGrupos.push({ ...g, id: gid, posicion: [g.posicion[0] + 0.8, g.posicion[1], g.posicion[2] + 0.8] });
        figuras.filter((f) => f.groupId === g.id).forEach((f) => {
          nuevasFiguras.push({ ...f, id: nid(), groupId: gid });
        });
        nuevaSel.push(gid);
      } else {
        const f = figuras.find((x) => x.id === id);
        if (f) {
          const nf = { ...f, id: nid(), posicion: [f.posicion[0] + 0.8, f.posicion[1], f.posicion[2] + 0.8] as Vec3 };
          nuevasFiguras.push(nf);
          nuevaSel.push(nf.id);
        }
      }
    }
    mutar((e) => ({ figuras: [...e.figuras, ...nuevasFiguras], grupos: [...e.grupos, ...nuevosGrupos] }));
    setSeleccion(nuevaSel);
  };

  const unirSeleccion = () => {
    const involucradas = new Set<string>();
    const gruposViejos = new Set<string>();
    for (const id of seleccion) {
      if (grupos.some((g) => g.id === id)) {
        gruposViejos.add(id);
        figuras.forEach((f) => { if (f.groupId === id) involucradas.add(f.id); });
      } else involucradas.add(id);
    }
    if (involucradas.size < 2) return;

    // Transform mundial de cada figura (aplicando la matriz de su grupo previo)
    const mundos = new Map<string, ReturnType<typeof descomponer>>();
    for (const f of figuras) {
      if (!involucradas.has(f.id)) continue;
      let m = matrizDe(f);
      if (f.groupId) {
        const g = grupos.find((x) => x.id === f.groupId);
        if (g) m = matrizDe(g).multiply(matrizDe(f));
      }
      mundos.set(f.id, descomponer(m));
    }
    const centro = new THREE.Vector3();
    mundos.forEach((w) => centro.add(new THREE.Vector3(...w.posicion)));
    centro.divideScalar(mundos.size);

    const nuevo: Grupo = {
      id: nid(),
      posicion: [centro.x, centro.y, centro.z],
      rotacion: [0, 0, 0],
      escala: [1, 1, 1],
    };
    mutar((e) => ({
      figuras: e.figuras.map((f) => {
        const w = mundos.get(f.id);
        if (!w) return f;
        return {
          ...f,
          groupId: nuevo.id,
          posicion: [w.posicion[0] - centro.x, w.posicion[1] - centro.y, w.posicion[2] - centro.z],
          rotacion: w.rotacion,
          escala: w.escala,
        };
      }),
      grupos: [...e.grupos.filter((g) => !gruposViejos.has(g.id)), nuevo],
    }));
    setSeleccion([nuevo.id]);
  };

  const separarSeleccion = () => {
    const ids = new Set(seleccion.filter((id) => grupos.some((g) => g.id === id)));
    if (!ids.size) return;
    const miembros = figuras.filter((f) => f.groupId && ids.has(f.groupId)).map((f) => f.id);
    mutar((e) => ({
      figuras: e.figuras.map((f) => {
        if (!f.groupId || !ids.has(f.groupId)) return f;
        const g = e.grupos.find((x) => x.id === f.groupId)!;
        const w = descomponer(matrizDe(g).multiply(matrizDe(f)));
        return { ...f, groupId: null, ...w };
      }),
      grupos: e.grupos.filter((g) => !ids.has(g.id)),
    }));
    setSeleccion(miembros);
  };

  const vaciarEscena = () => {
    if (!figuras.length) return;
    if (window.confirm('¿Vaciar toda la escena?')) {
      mutar(() => ({ figuras: [], grupos: [] }));
      setSeleccion([]);
    }
  };

  const exportarGLB = () => {
    if (!raizRef.current) return;

    // Copia optimizada: sin UVs (no usamos texturas) y con vértices
    // duplicados soldados — el archivo baja de peso sin perder forma.
    const copia = raizRef.current.clone(true);
    const geosTemporales: THREE.BufferGeometry[] = [];
    copia.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      let g = (mesh.geometry as THREE.BufferGeometry).clone();
      g.deleteAttribute('uv');
      g = mergeVertices(g);
      geosTemporales.push(g);
      mesh.geometry = g;
    });

    const exporter = new GLTFExporter();
    const limpiar = () => geosTemporales.forEach((g) => g.dispose());
    exporter.parse(
      copia,
      (resultado) => {
        limpiar();
        const blob = new Blob([resultado as ArrayBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modelo-medgo.glb';
        a.click();
        URL.revokeObjectURL(url);
      },
      () => { limpiar(); /* exportación fallida: no interrumpir la sesión de modelado */ },
      { binary: true },
    );
  };

  /* Teclado: Ctrl+Z deshace, Ctrl+Shift+Z / Ctrl+Y rehace, Supr elimina, Escape deselecciona */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) rehacer();
        else deshacer();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        rehacer();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') eliminarSeleccion();
      if (e.key === 'Escape') setSeleccion([]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [eliminarSeleccion, deshacer, rehacer]);

  const sueltas = figuras.filter((f) => !f.groupId);
  const haySeleccion = seleccion.length > 0;
  const hayGrupoSel = seleccion.some((id) => grupos.some((g) => g.id === id));

  /* ── Render ── */

  return (
    <div className={styles.wrapper}>
      {/* Cabecera + acciones */}
      <div className={styles.cabecera}>
        <div className={styles.titular}>
          <span className={styles.kicker}>Laboratorio creativo</span>
          <h1 className={styles.titulo}>Modelado 3D</h1>
        </div>
        <div className={styles.acciones}>
          <div className={styles.modos}>
            {([['translate', 'Mover'], ['rotate', 'Rotar'], ['scale', 'Escalar'], ['deformar', 'Deformar']] as [ModoEditor, string][]).map(([m, label]) => (
              <button
                key={m}
                className={`${styles.btnModo} ${modo === m ? styles.btnModoActivo : ''}`}
                onClick={() => setModo(m)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.modos}>
            <button
              className={styles.btnModo}
              onClick={deshacer}
              disabled={!historial.current.length}
              title="Deshacer (Ctrl+Z)"
            >
              ↩ Deshacer
            </button>
            <button
              className={styles.btnModo}
              onClick={rehacer}
              disabled={!futuro.current.length}
              title="Rehacer (Ctrl+Shift+Z)"
            >
              ↪ Rehacer
            </button>
          </div>
          <button className={styles.btnAccion} onClick={unirSeleccion} disabled={resaltadas.size < 2}>
            Unir
          </button>
          <button className={styles.btnAccion} onClick={separarSeleccion} disabled={!hayGrupoSel}>
            Separar
          </button>
          <button className={styles.btnAccion} onClick={duplicarSeleccion} disabled={!haySeleccion}>
            Duplicar
          </button>
          <button className={`${styles.btnAccion} ${styles.btnPeligro}`} onClick={eliminarSeleccion} disabled={!haySeleccion}>
            Eliminar
          </button>
          <button className={styles.btnAccion} onClick={() => archivoRef.current?.click()}>
            Importar
          </button>
          <input
            ref={archivoRef}
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            hidden
            onChange={importarArchivo}
          />
          <button className={styles.btnAccion} onClick={exportarGLB} disabled={!figuras.length}>
            Exportar GLB
          </button>
          <button className={`${styles.btnAccion} ${styles.btnPeligro}`} onClick={vaciarEscena} disabled={!figuras.length}>
            Vaciar
          </button>
        </div>
      </div>

      {/* Toolbar de figuras */}
      <div className={styles.toolbar}>
        {CATALOGO.map(({ tipo, label, icono }) => (
          <div
            key={tipo}
            role="button"
            tabIndex={0}
            className={styles.figuraBtn}
            draggable
            onDragStart={(e) => e.dataTransfer.setData(MIME_FIGURA, tipo)}
            onClick={() => agregarFigura(tipo)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') agregarFigura(tipo); }}
            title={`Arrastra al lienzo o haz clic para añadir: ${label}`}
          >
            <span className={styles.figuraIcono}>{icono}</span>
            <span className={styles.figuraLabel}>{label}</span>
          </div>
        ))}
        <span className={styles.ayuda}>
          {modo === 'deformar'
            ? 'Arrastra sobre una figura: ←→ dobla · ↑↓ estrecha · con Shift el arrastre tuerce'
            : 'Arrastra una figura al lienzo · clic para seleccionar · Ctrl+clic selección múltiple'}
        </span>
      </div>

      {/* Lienzo 3D */}
      <div
        ref={lienzoRef}
        className={styles.lienzo}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [5.5, 4.5, 7], fov: 42 }}
          onCreated={({ camera }) => { camaraRef.current = camera; }}
          onPointerMissed={(e) => { if (e.button === 0) setSeleccion([]); }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight
            position={[6, 10, 4]}
            intensity={1.25}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 4, -6]} intensity={0.35} />

          <Grid
            position={[0, -0.001, 0]}
            args={[30, 30]}
            cellSize={0.5}
            sectionSize={2.5}
            cellColor="#94a3b8"
            sectionColor="#64748b"
            cellThickness={0.6}
            sectionThickness={1.1}
            fadeDistance={26}
            fadeStrength={1.5}
          />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={22} blur={2.4} far={5} />

          <group ref={raizRef}>
            {sueltas.map((f) => (
              <FiguraMesh
                key={f.id}
                figura={f}
                resaltada={resaltadas.has(f.id)}
                registrar={registrar}
                onSelect={seleccionar}
                onDeformar={iniciarDeformeMouse}
              />
            ))}
            {grupos.map((g) => (
              <group
                key={g.id}
                ref={(o) => registrar(g.id, o)}
                position={g.posicion}
                rotation={g.rotacion}
                scale={g.escala}
              >
                {figuras.filter((f) => f.groupId === g.id).map((f) => (
                  <FiguraMesh
                    key={f.id}
                    figura={f}
                    resaltada={resaltadas.has(f.id)}
                    registrar={registrar}
                    onSelect={seleccionar}
                    onDeformar={iniciarDeformeMouse}
                  />
                ))}
              </group>
            ))}
          </group>

          {objetoActivo && modo !== 'deformar' && (
            <TransformControls
              object={objetoActivo}
              mode={modo}
              onMouseUp={confirmarTransformacion}
            />
          )}
          <OrbitControls ref={orbitRef} makeDefault minDistance={2.5} maxDistance={30} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>

        {/* Panel de propiedades */}
        {haySeleccion && (
          <div className={styles.panel}>
            <div className={styles.panelTitulo}>
              {resaltadas.size === 1 ? '1 figura seleccionada' : `${resaltadas.size} figuras seleccionadas`}
              {hayGrupoSel && <span className={styles.panelBadge}>grupo</span>}
            </div>

            <div className={styles.panelSeccion}>
              <span className={styles.panelLabel}>Color</span>
              <div className={styles.paleta}>
                {PALETA.map((c) => (
                  <button
                    key={c}
                    className={styles.swatch}
                    style={{ background: c }}
                    onClick={() => aplicarColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
                <input
                  type="color"
                  className={styles.colorInput}
                  value={figurasSel[0]?.color ?? '#3b9edd'}
                  onChange={(e) => aplicarColor(e.target.value)}
                  aria-label="Color personalizado"
                />
              </div>
            </div>

            {figurasSel.length > 0 && figurasSel[0].tipo !== 'importado' && (
              <div className={styles.panelSeccion}>
                <span className={styles.panelLabel}>
                  Curvatura
                  <span className={styles.valorWrap}>
                    <input
                      type="number"
                      className={styles.valorInput}
                      min={0}
                      max={100}
                      value={Math.round((figurasSel[0]?.redondez ?? 0) * 100)}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n)) aplicarCurvatura(Math.min(1, Math.max(0, n / 100)));
                      }}
                    />%
                  </span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={figurasSel[0]?.redondez ?? 0}
                  onChange={(e) => aplicarCurvatura(parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
            )}

            {figurasSel.length > 0 && (
              <div className={styles.panelSeccion}>
                <span className={styles.panelLabel}>
                  Deformar
                  {(Math.abs(figurasSel[0]?.doblar ?? 0) > 0.01 ||
                    Math.abs(figurasSel[0]?.torcer ?? 0) > 0.01 ||
                    Math.abs(figurasSel[0]?.estrechar ?? 0) > 0.01) && (
                    <button className={styles.btnMini} onClick={restablecerDeforme}>
                      Restablecer
                    </button>
                  )}
                </span>
                {([['doblar', 'Doblar'], ['torcer', 'Torcer'], ['estrechar', 'Estrechar']] as [keyof CamposDeforme, string][]).map(([campo, label]) => (
                  <label key={campo} className={styles.ejeFila}>
                    <span className={styles.ejeLabel}>{label}</span>
                    <input
                      type="range"
                      min={-1}
                      max={1}
                      step={0.01}
                      value={figurasSel[0]?.[campo] ?? 0}
                      onChange={(e) => aplicarDeforme(campo, parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.valorWrap}>
                      <input
                        type="number"
                        className={styles.valorInput}
                        min={-100}
                        max={100}
                        value={Math.round((figurasSel[0]?.[campo] ?? 0) * 100)}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (Number.isFinite(n)) aplicarDeforme(campo, Math.min(1, Math.max(-1, n / 100)));
                        }}
                      />%
                    </span>
                  </label>
                ))}
              </div>
            )}

            {escalaActiva && (
              <div className={styles.panelSeccion}>
                <span className={styles.panelLabel}>Dimensiones</span>
                {(['Ancho X', 'Alto Y', 'Fondo Z'] as const).map((label, i) => (
                  <label key={label} className={styles.ejeFila}>
                    <span className={styles.ejeLabel}>{label}</span>
                    <input
                      type="range"
                      min={0.2}
                      max={3}
                      step={0.05}
                      value={escalaActiva[i as 0 | 1 | 2]}
                      onChange={(e) => aplicarEscalaEje(i as 0 | 1 | 2, parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      className={styles.valorInput}
                      min={0.2}
                      max={3}
                      step={0.1}
                      value={Number(escalaActiva[i as 0 | 1 | 2].toFixed(2))}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n)) aplicarEscalaEje(i as 0 | 1 | 2, Math.min(3, Math.max(0.2, n)));
                      }}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
