'use client';
// Corte transversal de la médula espinal. La sustancia blanca es el disco base;
// los tractos son sectores coloreados; la sustancia gris (mariposa) está formada
// por las mismas regiones que las láminas de Rexed, de modo que activar el modo
// láminas sólo las recolorea (nunca quedan ocultas tras la gris).
//
// Lo que se puede elegir reacciona al puntero (cursor de mano y rótulo en el
// lienzo), las láminas coloreadas llevan su numeral y un tracto elegido rotula
// sus capas somatotópicas, para no tener que emparejar colores de memoria.

import { useEffect, useMemo, type CSSProperties } from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import {
  LAMINA_GROUP_LIST, LEVELS,
  type LevelId, type LaminaGroupId, type TractId,
} from './engine/anatomy';
import {
  createCordOutline, createGrayRegions, createTracts, canalCentral, septoPosterior,
  EXTRUDE, EXTRUDE_GRAY, EXTRUDE_FLAT, Z,
} from './engine/geometry';
import type { Senalado } from './SpinalCordSimulator';

interface Props {
  level: LevelId;
  showTracts: boolean;
  showLaminae: boolean;
  selectedLamina: LaminaGroupId | null;
  selectedTract: TractId | null;
  highlightTracts: Set<TractId>;
  highlightLaminae: Set<LaminaGroupId>;
  highlightSide: 'left' | 'right' | 'both' | 'center' | null;
  senalado: Senalado;
  onSenalar: (s: Senalado) => void;
  onClickLamina?: (id: LaminaGroupId) => void;
  onClickTract?: (id: TractId) => void;
  /**
   * Modo práctica: colores neutros (no delatan la respuesta), sin rótulos, y
   * al corregir la respuesta en verde y lo tocado por error en rojo.
   */
  practica?: { ok: Set<string>; mal: Set<string> } | null;
}

const GRAY_COLOR = '#bdb9c9';
const WHITE_COLOR = '#f1eef7';
const CANAL_COLOR = '#3a3550';
const SEPTUM_COLOR = '#a9a3b8';
/** Violeta de lo clínico: el rojo y el azul quedan para los tractos. */
const CLINICO = '#7c5cd6';
/** Práctica: acierto, error, tracto neutro y realce al pasar el puntero. */
const VERDE = '#2DC99A';
const ROJO = '#E85B4A';
const TRACTO_NEUTRO = '#b5bfd3';
const SENAL = '#3b9edd';

const rotuloStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 800,
  lineHeight: 1,
  padding: '3px 5px',
  borderRadius: '6px',
  background: 'rgba(26, 26, 46, 0.82)',
  color: '#fff',
};

/** Centro aproximado de una forma (media de sus puntos). */
function centro(sh: THREE.Shape): THREE.Vector2 {
  const pts = sh.getPoints(4);
  const c = new THREE.Vector2();
  for (const p of pts) c.add(p);
  return c.divideScalar(pts.length);
}

function cursor(v: 'pointer' | 'auto') {
  document.body.style.cursor = v;
}

export default function CrossSection({
  level,
  showTracts,
  showLaminae,
  selectedLamina,
  selectedTract,
  highlightTracts,
  highlightLaminae,
  highlightSide,
  senalado,
  onSenalar,
  onClickLamina,
  onClickTract,
  practica = null,
}: Props) {
  const { rx: R, ry } = LEVELS[level].corte;
  // Si el corte se desmonta con el puntero encima, el cursor de mano no queda pegado.
  useEffect(() => () => cursor('auto'), []);
  const canal = useMemo(() => canalCentral(level), [level]);
  const septo = useMemo(
    () => septoPosterior(level).map((p) => [p.x, p.y, Z.tracts + 0.055] as [number, number, number]),
    [level],
  );

  // El contorno ya trae la fisura media anterior como muesca y el surco posterior.
  const cordGeo = useMemo(() => new THREE.ExtrudeGeometry(createCordOutline(level), EXTRUDE), [level]);
  const canalGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, canal.r, 0, Math.PI * 2, false);
    return new THREE.ExtrudeGeometry(s, EXTRUDE_FLAT);
  }, [canal.r]);

  const grayEntries = useMemo(() => {
    const regions = createGrayRegions(level);
    return LAMINA_GROUP_LIST.map((g) => {
      const shapes = regions.get(g.id) ?? [];
      return {
        id: g.id,
        color: g.color,
        geos: shapes.map((sh) => new THREE.ExtrudeGeometry(sh, EXTRUDE_GRAY)),
        // Rótulo sobre la pieza derecha (la X es central).
        rotulo: shapes.length ? centro(shapes[0]) : null,
      };
    });
  }, [level]);

  const tractEntries = useMemo(() => {
    const white = new THREE.Color('#ffffff');
    return createTracts(level).map((tr) => ({
      id: tr.id,
      color: tr.color,
      geos: tr.pieces.map((p) => ({
        geo: new THREE.ExtrudeGeometry(p.shape, EXTRUDE_FLAT),
        shade: new THREE.Color(tr.color).lerp(white, p.shade * 0.6),
      })),
      // Capas somatotópicas del lado derecho (piezas pares), con su centro.
      capas: tr.pieces
        .filter((p, i) => i % 2 === 0 && p.layer)
        .map((p) => ({ layer: p.layer!, c: centro(p.shape) })),
    }));
  }, [level]);

  // Las láminas se colorean en modo corte o cuando un síndrome resalta láminas.
  const colorLaminae = showLaminae || highlightLaminae.size > 0;
  const anyLaminaFocus = selectedLamina !== null || highlightLaminae.size > 0;
  const laminaSenalada = senalado?.kind === 'lamina' ? senalado.id : null;
  const tractoSenalado = senalado?.kind === 'tract' ? senalado.id : null;

  const sobreLamina = (id: LaminaGroupId) => onClickLamina ? {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onSenalar({ kind: 'lamina', id }); cursor('pointer'); },
    onPointerOut: () => { onSenalar(null); cursor('auto'); },
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClickLamina(id); },
  } : {};
  const sobreTracto = (id: TractId) => onClickTract ? {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onSenalar({ kind: 'tract', id }); cursor('pointer'); },
    onPointerOut: () => { onSenalar(null); cursor('auto'); },
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClickTract(id); },
  } : {};

  const tractoElegido = tractEntries.find((t) => t.id === selectedTract);

  return (
    <group>
      {/* Sustancia blanca (disco base) */}
      <mesh geometry={cordGeo} position={[0, 0, Z.white]}>
        <meshStandardMaterial color={WHITE_COLOR} roughness={0.6} metalness={0.02} />
      </mesh>

      {/* Septo medio posterior: del surco a la comisura gris */}
      <Line points={septo} color={SEPTUM_COLOR} lineWidth={1.2} />

      {/* Tractos */}
      {showTracts && tractEntries.map(({ id, color, geos }) => {
        const active = selectedTract === id || highlightTracts.has(id);
        const hover = tractoSenalado === id;
        const dim = !practica && (selectedTract !== null || highlightTracts.size > 0) && !active && !hover;
        const marca = practica?.ok.has(id) ? VERDE : practica?.mal.has(id) ? ROJO : null;
        return geos.map(({ geo, shade }, i) => (
          <mesh key={`${id}-${i}`} geometry={geo} position={[0, 0, Z.tracts]} {...sobreTracto(id)}>
            <meshStandardMaterial
              color={practica ? marca ?? TRACTO_NEUTRO : shade}
              emissive={practica ? marca ?? (hover ? SENAL : '#000000') : active || hover ? color : '#000000'}
              emissiveIntensity={practica ? (marca ? 0.35 : hover ? 0.3 : 0) : active ? 0.4 : hover ? 0.25 : 0}
              transparent
              opacity={dim ? 0.2 : 0.95}
              roughness={0.45}
            />
          </mesh>
        ));
      })}

      {/* Capas somatotópicas del tracto elegido (S, L, T, C) */}
      {showTracts && !practica && tractoElegido?.capas.map(({ layer, c }) => (
        <Html key={`capa-${layer}`} position={[c.x, c.y, Z.tracts + 0.12]} center style={rotuloStyle}>
          {layer}
        </Html>
      ))}

      {/* Sustancia gris / láminas (misma geometría) */}
      {grayEntries.map(({ id, color, geos }) => {
        const active = selectedLamina === id || highlightLaminae.has(id);
        const hover = laminaSenalada === id;
        const dim = colorLaminae && anyLaminaFocus && !active && !hover;
        const marca = practica?.ok.has(id) ? VERDE : practica?.mal.has(id) ? ROJO : null;
        const fill = practica ? marca ?? GRAY_COLOR : colorLaminae ? color : GRAY_COLOR;
        return geos.map((geo, i) => (
          <mesh key={`${id}-${i}`} geometry={geo} position={[0, 0, Z.gray]} {...sobreLamina(id)}>
            <meshStandardMaterial
              color={fill}
              emissive={practica ? marca ?? (hover ? SENAL : '#000000') : (colorLaminae && active) || hover ? color : '#000000'}
              emissiveIntensity={practica ? (marca ? 0.3 : hover ? 0.25 : 0) : colorLaminae && active ? 0.3 : hover ? 0.22 : 0}
              roughness={0.5}
              metalness={0.02}
              transparent
              opacity={dim ? 0.4 : highlightSide === 'center' && id === 'X' ? 0.55 : 1}
            />
          </mesh>
        ));
      })}

      {/* Numeral de cada grupo de láminas cuando están coloreadas */}
      {colorLaminae && !practica && grayEntries.map(({ id, rotulo }) => rotulo && (
        <Html key={`num-${id}`} position={[rotulo.x, rotulo.y, Z.gray + 0.24]} center style={rotuloStyle}>
          {id}
        </Html>
      ))}

      {/* Canal central */}
      <mesh geometry={canalGeo} position={[canal.x, canal.y, Z.canal]}>
        <meshStandardMaterial color={CANAL_COLOR} roughness={0.3} />
      </mesh>

      {/* Overlay clínico: hemisección (lado de la lesión) */}
      {highlightSide === 'right' && (
        <>
          <mesh position={[R * 0.5, 0, Z.overlay]}>
            <planeGeometry args={[R, R * ry * 2.2]} />
            <meshStandardMaterial color={CLINICO} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <Html position={[R * 0.5, -R * ry - 0.28, Z.overlay]} center style={{ ...rotuloStyle, background: CLINICO, fontSize: '11px', padding: '4px 8px' }}>
            Lado de la lesión
          </Html>
        </>
      )}
      {/* Overlay clínico: cavidad central (siringomielia, lesión central) */}
      {highlightSide === 'center' && (
        <mesh position={[0, canal.y, Z.overlay]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R * 0.22, R * 0.22, 0.3, 20]} />
          <meshStandardMaterial color={CLINICO} transparent opacity={0.24} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
