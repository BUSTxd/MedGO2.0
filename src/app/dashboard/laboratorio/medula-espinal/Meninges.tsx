'use client';
// Capas meníngeas concéntricas alrededor del corte transversal.
// Cada meninge es un anillo (ExtrudeGeometry con hole) toggleable.

import { useMemo } from 'react';
import * as THREE from 'three';
import { MENINGE_LIST, LEVELS, type LevelId, type MeningeId } from './engine/anatomy';
import { createMeningeShape, EXTRUDE_FLAT } from './engine/geometry';

interface Props {
  level: LevelId;
  visible: Record<MeningeId, boolean>;
}

export default function Meninges({ level, visible }: Props) {
  const cordR = LEVELS[level].gm.cordRadius;

  const rings = useMemo(() => {
    return MENINGE_LIST.map((m) => {
      const inner = cordR * m.rMul;
      const outer = inner + cordR * m.thickness;
      const shape = createMeningeShape(inner, outer);
      const geo = new THREE.ExtrudeGeometry(shape, EXTRUDE_FLAT);
      return { id: m.id, geo, color: m.color, opacity: m.opacity };
    });
  }, [cordR]);

  return (
    <group>
      {rings.map(({ id, geo, color, opacity }) =>
        visible[id] ? (
          <mesh key={id} position={[0, 0, -0.02]}>
            <primitive object={geo} attach="geometry" />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity}
              roughness={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        ) : null
      )}

      {/* Ligamentos dentados (proyecciones laterales de la piamadre) */}
      {visible.piamadre && (
        <>
          {[-1, 1].map((dir) => (
            <mesh
              key={dir}
              position={[dir * (cordR * 1.12), 0, 0.14]}
              rotation={[0, 0, 0]}
            >
              <boxGeometry args={[cordR * 0.18, 0.02, 0.28]} />
              <meshStandardMaterial
                color="#E88B8B"
                transparent
                opacity={0.5}
                roughness={0.5}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
