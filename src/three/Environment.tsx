import { Environment as StudioEnvironment, Lightformer } from '@react-three/drei';
import type { QualityProfile } from './types';

/** Local procedural studio reflections: no HDR download or external request. */
export function Environment({ quality }: { quality: QualityProfile }) {
  return <StudioEnvironment resolution={quality === 'desktop' ? 128 : 64} frames={1} environmentIntensity={.65}>
    <Lightformer form="rect" intensity={3} color="#fff4db" scale={[15, 8, 1]} position={[-5, 9, 2]} rotation={[Math.PI / 2, 0, 0]} />
    <Lightformer form="rect" intensity={2} color="#ffffff" scale={[5, 13, 1]} position={[9, 3, -8]} rotation={[0, -Math.PI / 2, 0]} />
    <Lightformer form="rect" intensity={1.2} color="#cbd4b5" scale={[12, 6, 1]} position={[-8, 4, -14]} rotation={[0, Math.PI / 2, 0]} />
  </StudioEnvironment>;
}
