import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Group } from 'three';
import type { QualityProfile, WorldState } from '../types';

function LinenCurtain({ position, rotation, reducedMotion }: { position: [number, number, number]; rotation: number; reducedMotion: boolean }) {
  const time = useMemo(() => ({ value: 0 }), []);
  useFrame(({ clock }) => { time.value = reducedMotion ? 0 : clock.elapsedTime * .55; });
  return <mesh position={position} rotation={[0, rotation, 0]} castShadow receiveShadow>
    <planeGeometry args={[2.35, 6.5, 18, 40]} />
    <meshStandardMaterial color="#f1e4c9" side={DoubleSide} roughness={.96} onBeforeCompile={shader => {
      shader.uniforms.uTime = time;
      shader.vertexShader = `uniform float uTime; varying vec2 vFabric;\n${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vFabric = uv;
        float freeEdge = pow(1.0 - uv.y, 1.3);
        transformed.z += sin(uv.x * 35.0) * 0.10;
        transformed.z += sin(position.y * 1.15 + uTime) * 0.14 * freeEdge;
        transformed.x += cos(position.y * 1.0 + uTime * 0.8) * 0.06 * freeEdge;`);
      shader.fragmentShader = `varying vec2 vFabric;\n${shader.fragmentShader}`;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        float weave = sin(vFabric.x * 600.0) * sin(vFabric.y * 1200.0);
        diffuseColor.rgb *= 0.965 + weave * 0.025;`);
    }} customProgramCacheKey={() => 'goodkind-linen-v1'} />
  </mesh>;
}

export function Atmosphere({ state, quality, reducedMotion }: { state: WorldState; quality: QualityProfile; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame(() => { if (group.current) group.current.visible = quality !== 'mobile' || state.progress > .56; });
  return <group ref={group}>
    <LinenCurtain position={[-5.4, 3.35, -27.8]} rotation={.25} reducedMotion={reducedMotion} />
    <LinenCurtain position={[5.4, 3.35, -28.1]} rotation={-.25} reducedMotion={reducedMotion} />
    {quality === 'desktop' ? <LinenCurtain position={[6, 3.35, -5.6]} rotation={-.4} reducedMotion={reducedMotion} /> : null}
  </group>;
}
