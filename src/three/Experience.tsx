import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { CameraRig } from './CameraRig';
import { Lighting } from './Lighting';
import { Environment } from './Environment';
import { World } from './World';
import { SceneController } from './SceneController';
import { ProductObjects } from './props/ProductObjects';
import { Atmosphere } from './effects/Atmosphere';
import { Particles } from './effects/Particles';
import { QUALITY } from './worldConfig';
import type { ExperienceProps } from './types';

export default function Experience(props: ExperienceProps) {
  const renderQuality = props.renderQuality ?? props.quality;
  const profile = QUALITY[renderQuality];
  const onProgress = props.onProgress;
  useEffect(() => {
    // Texture loading starts during R3F rendering. Defer the HTML update so it
    // cannot synchronously update another React root during that render.
    let active = true;
    const report = (progress: number) => queueMicrotask(() => { if (active) onProgress?.(progress); });
    report(useProgress.getState().progress);
    const unsubscribe = useProgress.subscribe(progress => { report(progress.progress); });
    return () => { active = false; unsubscribe(); };
  }, [onProgress]);
  return <Canvas frameloop={props.reducedMotion ? 'demand' : 'always'} shadows={profile.shadows ? 'percentage' : false} dpr={[1, profile.dpr]} camera={{ position: [-2.8, 3.2, 10.8], fov: 40, near: .08, far: 160 }} gl={{ antialias: props.quality !== 'mobile', alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }} fallback={<span>The illustrated view is available if 3D rendering is unsupported.</span>} style={{ width: '100%', height: '100%' }}>
    <color attach="background" args={['#e8dfc9']} />
    <fog attach="fog" args={['#e8dfc9', 24, 95]} />
    <Suspense fallback={null}>
      <CameraRig state={props.state} quality={props.quality} reducedMotion={props.reducedMotion} />
      <Lighting quality={renderQuality} state={props.state} />
      <Environment quality={renderQuality} />
      <World quality={renderQuality} reducedMotion={props.reducedMotion} />
      <ProductObjects {...props} quality={renderQuality} />
      <Atmosphere state={props.state} quality={renderQuality} reducedMotion={props.reducedMotion} />
      <Particles quality={renderQuality} reducedMotion={props.reducedMotion} />
      <SceneController {...props} quality={renderQuality} />
    </Suspense>
  </Canvas>;
}
