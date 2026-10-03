import { useLayoutEffect, useMemo, useRef } from 'react';
import { type InstancedMesh, Object3D, Shape } from 'three';
import { PALETTE, QUALITY } from '../worldConfig';
import type { Point3, QualityProfile } from '../types';

function archShape() {
  const shape = new Shape();
  shape.moveTo(-7.2, 0); shape.lineTo(-7.2, 3.2);
  shape.absarc(0, 3.2, 7.2, Math.PI, 0, true);
  shape.lineTo(7.2, 0); shape.lineTo(5.9, 0); shape.lineTo(5.9, 3.2);
  shape.absarc(0, 3.2, 5.9, 0, Math.PI, false);
  shape.lineTo(-5.9, 0); shape.closePath();
  return shape;
}

export function Portal({ z, quality, color = PALETTE.plaster }: { z: number; quality: QualityProfile; color?: string }) {
  const shape = useMemo(archShape, []);
  return <group position={[0, 0, z]}>
    <mesh castShadow receiveShadow>
      <extrudeGeometry args={[shape, { depth: .8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .12, bevelThickness: .1, curveSegments: QUALITY[quality].archSegments }]} />
      <meshStandardMaterial color={color} roughness={.88} />
    </mesh>
    {[-6.7, 6.7].map(x => <mesh key={x} position={[x, .19, .4]} receiveShadow><boxGeometry args={[1.7, .38, 1.4]} /><meshStandardMaterial color={PALETTE.pale} roughness={.65} /></mesh>)}
    <mesh position={[0, .012, .3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[11.7, .055]} /><meshStandardMaterial color={PALETTE.brass} metalness={.5} roughness={.38} /></mesh>
  </group>;
}

function Flutes({ radius, height, count, color }: { radius: number; height: number; count: number; color: string }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const instance = ref.current;
    if (!instance) return;
    const transform = new Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2;
      transform.position.set(Math.sin(angle) * radius, height / 2, Math.cos(angle) * radius);
      transform.updateMatrix(); instance.setMatrixAt(i, transform.matrix);
    }
    instance.instanceMatrix.needsUpdate = true; instance.computeBoundingSphere();
  }, [radius, height, count]);
  return <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow><cylinderGeometry args={[.034, .034, height - .08, 6]} /><meshStandardMaterial color={color} roughness={.85} /></instancedMesh>;
}

export function Plinth({ position, radius, height, color = PALETTE.clay, quality, fluted = false }: { position: Point3; radius: number; height: number; color?: string; quality: QualityProfile; fluted?: boolean }) {
  const segments = QUALITY[quality].radialSegments;
  return <group position={position}>
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow><cylinderGeometry args={[radius, radius + .04, height, segments]} /><meshStandardMaterial color={color} roughness={.73} /></mesh>
    <mesh position={[0, height + .045, 0]} castShadow receiveShadow><cylinderGeometry args={[radius + .055, radius + .055, .09, segments]} /><meshStandardMaterial color={color} roughness={.45} /></mesh>
    <mesh position={[0, .08, 0]} receiveShadow><cylinderGeometry args={[radius + .09, radius + .1, .16, segments]} /><meshStandardMaterial color={color} roughness={.8} /></mesh>
    {fluted && quality !== 'mobile' ? <Flutes radius={radius} height={height} count={quality === 'desktop' ? 24 : 16} color={color} /> : null}
  </group>;
}

function Leaves({ count }: { count: number }) {
  const leaves = useRef<InstancedMesh>(null);
  const stems = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const transform = new Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399; const y = .95 + i * .15; const scale = .6 + i * .018;
      transform.position.set(Math.cos(angle) * .36, y + .25, Math.sin(angle) * .36);
      transform.rotation.set(.1, angle, -.5); transform.scale.set(scale * .24, scale, scale * .09); transform.updateMatrix(); leaves.current?.setMatrixAt(i, transform.matrix);
      transform.position.set(Math.cos(angle) * .13, y, Math.sin(angle) * .13);
      transform.rotation.set(0, angle, -.28); transform.scale.set(1, y, 1); transform.updateMatrix(); stems.current?.setMatrixAt(i, transform.matrix);
    }
    for (const mesh of [leaves.current, stems.current]) if (mesh) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); }
  }, [count]);
  return <><instancedMesh ref={leaves} args={[undefined, undefined, count]} castShadow><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={PALETTE.forest} roughness={.82} /></instancedMesh><instancedMesh ref={stems} args={[undefined, undefined, count]}><cylinderGeometry args={[.012, .018, 1, 5]} /><meshStandardMaterial color="#64724c" roughness={.85} /></instancedMesh></>;
}

export function Botanical({ position, quality, scale = 1 }: { position: Point3; quality: QualityProfile; scale?: number }) {
  const count = quality === 'mobile' ? 5 : 8;
  return <group position={position} scale={scale}>
    <mesh position={[0, .4, 0]} castShadow receiveShadow><cylinderGeometry args={[.48, .36, .8, 28]} /><meshStandardMaterial color={PALETTE.clay} roughness={.83} /></mesh>
    <mesh position={[0, .81, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.43, 28]} /><meshStandardMaterial color="#453f2d" roughness={1} /></mesh>
    <Leaves count={count} />
  </group>;
}
