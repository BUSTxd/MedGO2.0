'use client';
// Un músculo extraocular como cilindro(s) entre su origen (fijo en la órbita) y
// su inserción (sobre el globo, por eso sigue la rotación). El oblicuo superior
// se dibuja en dos tramos: origen→tróclea y tróclea→inserción. Cuando el globo
// rota en la dirección del músculo, la inserción se acerca al origen y el músculo
// se acorta de forma natural (biomecánicamente, no fingido).

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Muscle as MuscleData } from './engine/muscles';

const Y = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** Orienta y escala un cilindro unitario (eje Y, altura 1) entre A y B con radio r. */
function orientCylinder(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, r: number) {
  _dir.subVectors(b, a);
  const len = _dir.length();
  _mid.addVectors(a, b).multiplyScalar(0.5);
  _q.setFromUnitVectors(Y, _dir.normalize());
  mesh.position.copy(_mid);
  mesh.quaternion.copy(_q);
  mesh.scale.set(r, len, r);
}

interface Props {
  muscle: MuscleData;
  quatRef: { current: THREE.Quaternion };
  active: boolean;
  dimmed: boolean;
  onDown: (id: MuscleData['id']) => void;
  onUp: () => void;
}

const BASE_R = 0.06;
const ACTIVE_R = 0.105;

export default function Muscle({ muscle, quatRef, active, dimmed, onDown, onUp }: Props) {
  const movingRef = useRef<THREE.Mesh>(null);
  const staticRef = useRef<THREE.Mesh>(null);
  const insWorld = useRef(new THREE.Vector3());
  const radius = useRef(BASE_R);

  useFrame((_, dt) => {
    // Inserción en coordenadas de mundo = inserción local rotada por el globo.
    insWorld.current.copy(muscle.insercion).applyQuaternion(quatRef.current);

    // Radio animado (engrosa al contraerse).
    const target = active ? ACTIVE_R : BASE_R;
    radius.current += (target - radius.current) * (1 - Math.exp(-12 * dt));

    if (muscle.troclea) {
      // Tramo posterior (origen→tróclea): fijo.
      if (staticRef.current) orientCylinder(staticRef.current, muscle.origen, muscle.troclea, radius.current);
      // Tramo reflejado (tróclea→inserción): sigue al globo.
      if (movingRef.current) orientCylinder(movingRef.current, muscle.troclea, insWorld.current, radius.current);
    } else if (movingRef.current) {
      orientCylinder(movingRef.current, muscle.origen, insWorld.current, radius.current);
    }
  });

  const emissiveIntensity = active ? 0.55 : 0;
  const opacity = dimmed ? 0.35 : 1;

  const handleDown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onDown(muscle.id);
  };

  return (
    <group>
      {muscle.troclea && (
        <>
          <mesh ref={staticRef}>
            <cylinderGeometry args={[1, 1, 1, 14]} />
            <meshStandardMaterial
              color={muscle.color}
              emissive={muscle.color}
              emissiveIntensity={emissiveIntensity}
              roughness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Tróclea (polea) */}
          <mesh position={muscle.troclea}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#cfd3dc" roughness={0.4} transparent opacity={opacity} />
          </mesh>
        </>
      )}
      <mesh
        ref={movingRef}
        onPointerDown={handleDown}
        onPointerUp={(e) => { e.stopPropagation(); onUp(); }}
        onPointerLeave={() => onUp()}
      >
        <cylinderGeometry args={[1, 1, 1, 14]} />
        <meshStandardMaterial
          color={muscle.color}
          emissive={muscle.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
