import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, type DirectionalLight, MathUtils } from 'three';
import { QUALITY } from './worldConfig';
import type { QualityProfile, WorldState } from './types';

const warm = new Color('#fff0d3');
const story = new Color('#edd3ae');

export function Lighting({ quality, state }: { quality: QualityProfile; state: WorldState }) {
  const key = useRef<DirectionalLight>(null);
  const lastProgress = useRef(-1);
  const gl = useThree(value => value.gl);
  const profile = QUALITY[quality];
  useFrame(() => {
    if (!key.current) return;
    if (Math.abs(lastProgress.current - state.progress) < .001) return;
    lastProgress.current = state.progress;
    const atmosphere = Math.max(0, 1 - Math.abs(state.progress - .75) / .18);
    key.current.intensity = MathUtils.lerp(3.2, 2.1, atmosphere);
    key.current.color.copy(warm).lerp(story, atmosphere);
    // Track the moving gallery chapter so one shadow camera covers the active room.
    const z = -Math.min(state.progress / .74, 1) * 32;
    key.current.position.z = z + 8;
    key.current.target.position.set(1, 0, z);
    key.current.target.updateMatrixWorld();
    gl.shadowMap.needsUpdate = true;
  });
  return <>
    <hemisphereLight args={['#fff7e4', '#afa790', 1.1]} />
    <directionalLight ref={key} position={[-5, 13, 8]} intensity={3.2} color="#fff0d3" castShadow={profile.shadows} shadow-mapSize={[profile.shadowSize, profile.shadowSize]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-camera-near={.5} shadow-camera-far={45} shadow-bias={-.0005} shadow-normalBias={.025} />
    <directionalLight position={[9, 6, -20]} color="#eef5e1" intensity={1.1} />
    <pointLight position={[2, 5.5, -33]} color="#ffc18d" intensity={28} distance={13} decay={2} />
  </>;
}
