'use client';
// Corte transversal de la médula espinal. La sustancia blanca es el disco base;
// los tractos son sectores coloreados; la sustancia gris (mariposa) está formada
// por las mismas regiones que las láminas de Rexed, de modo que activar el modo
// láminas sólo las recolorea (nunca quedan ocultas tras la gris).

import { useMemo } from 'react';
import * as THREE from 'three';
import {
  LAMINA_GROUP_LIST, LEVELS,
  type LevelId, type LaminaGroupId, type TractId,
} from './engine/anatomy';
import {
  createCordOutline, createFissureShape, createGrayRegions, createTracts,
  EXTRUDE, EXTRUDE_GRAY, EXTRUDE_FLAT, Z,
} from './engine/geometry';

interface Props {
  level: LevelId;
  showTracts: boolean;
  showLaminae: boolean;
  selectedLamina: LaminaGroupId | null;
  selectedTract: TractId | null;
  highlightTracts: Set<TractId>;
  highlightLaminae: Set<LaminaGroupId>;
  highlightSide: 'left' | 'right' | 'both' | 'center' | null;
  onClickLamina?: (id: LaminaGroupId) => void;
  onClickTract?: (id: TractId) => void;
}

const GRAY_COLOR = '#bdb9c9';
const WHITE_COLOR = '#f1eef7';
const CANAL_COLOR = '#3a3550';
const FISSURE_COLOR = '#cfcad9';

export default function CrossSection({
  level,
  showTracts,
  showLaminae,
  selectedLamina,
  selectedTract,
  highlightTracts,
  highlightLaminae,
  highlightSide,
  onClickLamina,
  onClickTract,
}: Props) {
  const R = LEVELS[level].gm.cordRadius;

  const cordGeo = useMemo(() => new THREE.ExtrudeGeometry(createCordOutline(level), EXTRUDE), [level]);
  const fissureGeo = useMemo(() => new THREE.ExtrudeGeometry(createFissureShape(level), EXTRUDE_FLAT), [level]);
  const canalGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, Math.max(R * 0.028, 0.03), 0, Math.PI * 2, false);
    return new THREE.ExtrudeGeometry(s, EXTRUDE_FLAT);
  }, [R]);

  const grayEntries = useMemo(() => {
    const regions = createGrayRegions(level);
    return LAMINA_GROUP_LIST.map((g) => ({
      id: g.id,
      color: g.color,
      geos: (regions.get(g.id) ?? []).map((sh) => new THREE.ExtrudeGeometry(sh, EXTRUDE_GRAY)),
    }));
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
    }));
  }, [level]);

  // Las láminas se colorean en modo corte o cuando un síndrome resalta láminas.
  const colorLaminae = showLaminae || highlightLaminae.size > 0;
  const anyLaminaFocus = selectedLamina !== null || highlightLaminae.size > 0;

  return (
    <group>
      {/* Sustancia blanca (disco base) */}
      <mesh geometry={cordGeo} position={[0, 0, Z.white]}>
        <meshStandardMaterial color={WHITE_COLOR} roughness={0.6} metalness={0.02} />
      </mesh>

      {/* Fisura media anterior */}
      <mesh geometry={fissureGeo} position={[0, 0, Z.fissure]}>
        <meshStandardMaterial color={FISSURE_COLOR} roughness={0.6} />
      </mesh>

      {/* Tractos */}
      {showTracts && tractEntries.map(({ id, color, geos }) => {
        const active = selectedTract === id || highlightTracts.has(id);
        const dim = (selectedTract !== null || highlightTracts.size > 0) && !active;
        return geos.map(({ geo, shade }, i) => (
          <mesh
            key={`${id}-${i}`}
            geometry={geo}
            position={[0, 0, Z.tracts]}
            onClick={onClickTract ? (e) => { e.stopPropagation(); onClickTract(id); } : undefined}
          >
            <meshStandardMaterial
              color={shade}
              emissive={active ? color : '#000000'}
              emissiveIntensity={active ? 0.4 : 0}
              transparent
              opacity={dim ? 0.2 : 0.95}
              roughness={0.45}
            />
          </mesh>
        ));
      })}

      {/* Sustancia gris / láminas (misma geometría) */}
      {grayEntries.map(({ id, color, geos }) => {
        const active = selectedLamina === id || highlightLaminae.has(id);
        const dim = colorLaminae && anyLaminaFocus && !active;
        const fill = colorLaminae ? color : GRAY_COLOR;
        return geos.map((geo, i) => (
          <mesh
            key={`${id}-${i}`}
            geometry={geo}
            position={[0, 0, Z.gray]}
            onClick={onClickLamina ? (e) => { e.stopPropagation(); onClickLamina(id); } : undefined}
          >
            <meshStandardMaterial
              color={fill}
              emissive={colorLaminae && active ? color : '#000000'}
              emissiveIntensity={colorLaminae && active ? 0.3 : 0}
              roughness={0.5}
              metalness={0.02}
              transparent
              opacity={dim ? 0.4 : highlightSide === 'center' && id === 'X' ? 0.55 : 1}
            />
          </mesh>
        ));
      })}

      {/* Canal central */}
      <mesh geometry={canalGeo} position={[0, 0, Z.canal]}>
        <meshStandardMaterial color={CANAL_COLOR} roughness={0.3} />
      </mesh>

      {/* Overlay clínico: hemisección (lado derecho) */}
      {highlightSide === 'right' && (
        <mesh position={[R * 0.5, 0, Z.overlay]}>
          <planeGeometry args={[R, R * 2.2]} />
          <meshStandardMaterial color="#E85B4A" transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Overlay clínico: cavidad central (siringomielia) */}
      {highlightSide === 'center' && (
        <mesh position={[0, 0, Z.overlay]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R * 0.22, R * 0.22, 0.3, 20]} />
          <meshStandardMaterial color="#9b7bdf" transparent opacity={0.22} />
        </mesh>
      )}
    </group>
  );
}
