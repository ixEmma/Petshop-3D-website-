import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Points, type ShaderMaterial } from 'three';
import { QUALITY } from '../worldConfig';
import type { QualityProfile } from '../types';

export function Particles({ quality, reducedMotion }: { quality: QualityProfile; reducedMotion: boolean }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const count = QUALITY[quality].particles;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { const seed = (i * 16807 % 2147483647) / 2147483647; array[i * 3] = Math.sin(i * 12.989) * 6; array[i * 3 + 1] = .4 + ((i * .618033) % 1) * 6.5; array[i * 3 + 2] = 6 - ((i * .754877 + seed) % 1) * 45; }
    return array;
  }, [quality]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: quality === 'mobile' ? 12 : 20 } }), [quality]);
  useFrame(({ clock }) => { if (points.current) (points.current.material as ShaderMaterial).uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime; });
  return <points ref={points} frustumCulled={false}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <shaderMaterial uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending}
      vertexShader={`uniform float uTime; uniform float uSize; varying float vFade;
        void main(){ vec3 p=position; p.x+=sin(uTime*.15+position.z)*.16; p.y+=sin(uTime*.2+position.x)*.1;
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=clamp(uSize/-mv.z,1.,3.5); vFade=clamp(1.-(-mv.z)/42.,0.,1.); }`}
      fragmentShader={`varying float vFade; void main(){ float d=length(gl_PointCoord-.5); float a=(1.-smoothstep(.1,.5,d))*vFade*.30; gl_FragColor=vec4(1.,.91,.69,a); }`} />
  </points>;
}
