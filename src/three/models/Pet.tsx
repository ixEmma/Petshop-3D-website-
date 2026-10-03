import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Billboard, useAnimations, useGLTF, useTexture } from '@react-three/drei';
import { Box3, type Group, type Skeleton, SkinnedMesh, SRGBColorSpace, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { petAssets, type PetId } from '../../data/petAssets';
import { modelRegistry } from './modelRegistry';
import type { Point3, QualityProfile } from '../types';

function Portrait({ id, height, quality }: { id: PetId; height: number; quality: QualityProfile }) {
  const texture = useTexture(quality === 'mobile' ? petAssets[id].small : petAssets[id].src);
  useEffect(() => { texture.colorSpace = SRGBColorSpace; texture.anisotropy = quality === 'desktop' ? 4 : 2; texture.needsUpdate = true; }, [texture, quality]);
  return <Billboard follow lockX lockZ position={[0, height / 2, 0]}><mesh renderOrder={2}>
    <planeGeometry args={[height * 2 / 3, height]} />
    <meshBasicMaterial map={texture} transparent alphaTest={.035} depthWrite toneMapped={false} />
  </mesh></Billboard>;
}

function GltfPet({ url, height, reducedMotion }: { url: string; height: number; reducedMotion: boolean }) {
  const { scene, animations } = useGLTF(url);
  const group = useRef<Group>(null);
  const asset = useMemo(() => {
    const copy = clone(scene);
    const bounds = new Box3().setFromObject(copy);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = height / Math.max(size.y, .001);
    copy.scale.multiplyScalar(scale);
    copy.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
    copy.traverse(object => { if ('isMesh' in object) { object.castShadow = true; object.receiveShadow = true; } });
    return copy;
  }, [scene, height]);
  const { actions, mixer } = useAnimations(animations, group);
  useEffect(() => () => {
    const skeletons = new Set<Skeleton>();
    asset.traverse(object => { if (object instanceof SkinnedMesh) skeletons.add(object.skeleton); });
    skeletons.forEach(skeleton => { skeleton.dispose(); });
  }, [asset]);
  useEffect(() => {
    const animationRoot = group.current;
    if (!reducedMotion) (actions.Idle ?? actions.Breathe)?.reset().fadeIn(.4).play();
    return () => { mixer.stopAllAction(); if (animationRoot) mixer.uncacheRoot(animationRoot); };
  }, [actions, mixer, reducedMotion]);
  return <group ref={group}><primitive object={asset} dispose={null} /></group>;
}

/** A genuinely flat portrait until its independently authored GLB is enabled. */
export function Pet({ id, position, height = modelRegistry[id].targetHeight, quality, reducedMotion }: { id: PetId; position: Point3; height?: number; quality: QualityProfile; reducedMotion: boolean }) {
  const model = modelRegistry[id];
  return <group position={position} name={`pet-${id}-${model.url ? 'glb' : 'billboard'}`}>
    <Suspense fallback={<Portrait id={id} height={height} quality={quality} />}>
      {model.url ? <GltfPet url={model.url} height={height} reducedMotion={reducedMotion} /> : <Portrait id={id} height={height} quality={quality} />}
    </Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .015, -.03]}>
      <circleGeometry args={[height * .22, 40]} /><meshBasicMaterial color="#303c23" transparent opacity={.13} depthWrite={false} />
    </mesh>
  </group>;
}
