import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three';
import { CAMERA_PATH, CHAPTER_STOPS } from './worldConfig';
import type { QualityProfile, WorldState } from './types';

export function CameraRig({ state, quality, reducedMotion }: { state: WorldState; quality: QualityProfile; reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const vectors = useMemo(() => ({ position: new Vector3(), target: new Vector3(), a: new Vector3(), b: new Vector3() }), []);
  useFrame(() => {
    let progress = MathUtils.clamp(state.progress, 0, 1);
    if (reducedMotion) progress = CHAPTER_STOPS.reduce((nearest, value) => Math.abs(value - progress) < Math.abs(nearest - progress) ? value : nearest, 0);
    let index = CAMERA_PATH.findIndex((point, i) => i < CAMERA_PATH.length - 1 && progress <= CAMERA_PATH[i + 1].progress && progress >= point.progress);
    if (index < 0) index = CAMERA_PATH.length - 2;
    const start = CAMERA_PATH[index];
    const end = CAMERA_PATH[index + 1];
    const t = MathUtils.smoothstep(progress, start.progress, end.progress);
    vectors.position.fromArray(start.position).lerp(vectors.a.fromArray(end.position), t);
    vectors.target.fromArray(start.target).lerp(vectors.b.fromArray(end.target), t);
    let fov = MathUtils.lerp(start.fov, end.fov, t);
    if (quality === 'mobile') {
      // Mobile uses a shorter, portrait-framed camera with a centered subject.
      vectors.target.x += 1.7;
      vectors.position.x += 2.1;
      vectors.position.z += 1.1;
      vectors.target.y += .35;
      fov += 12;
    } else if (quality === 'tablet') fov += 4;
    if (!reducedMotion && quality === 'desktop') {
      vectors.position.x += pointer.x * .1;
      vectors.position.y += pointer.y * .06;
    }
    camera.position.copy(vectors.position);
    camera.lookAt(vectors.target);
    const perspective = camera as PerspectiveCamera;
    if (Math.abs(perspective.fov - fov) > .01) { perspective.fov = fov; perspective.updateProjectionMatrix(); }
  });
  return null;
}
