import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { FloatType, HalfFloatType, Mesh, Texture } from 'three';
import { modelRegistry } from './models/modelRegistry';
import { QUALITY } from './worldConfig';
import type { ExperienceProps, WorldMetrics } from './types';

export function SceneController({ state, quality, reducedMotion, onReady, onError, onMetrics }: Pick<ExperienceProps, 'state' | 'quality' | 'reducedMotion' | 'onReady' | 'onError' | 'onMetrics'>) {
  const { gl, camera, scene, invalidate } = useThree();
  const measured = useRef({ duration: 0, frames: 0, ready: false, lastReport: 0, forceReport: true, profile: '' });
  useEffect(() => {
    const profile = `${quality}/${reducedMotion}`;
    if (measured.current.profile !== profile) {
      measured.current.duration = 0; measured.current.frames = 0; measured.current.forceReport = true; measured.current.profile = profile;
    }
    state.invalidate = invalidate; invalidate();
    return () => { if (state.invalidate === invalidate) delete state.invalidate; };
  }, [state, invalidate, reducedMotion, quality]);
  useEffect(() => {
    const previous = gl.shadowMap.autoUpdate;
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = QUALITY[quality].shadows;
    invalidate();
    return () => { gl.shadowMap.autoUpdate = previous; };
  }, [gl, quality, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onError(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => { canvas.removeEventListener('webglcontextlost', lost); if (import.meta.env.DEV) delete window.__GOODKIND_3D__; };
  }, [gl, onError]);
  useFrame((_, delta) => {
    const sample = measured.current;
    sample.duration += delta; sample.frames += 1;
    if (!sample.ready) { sample.ready = true; onReady(); invalidate(); return; }
    const now = performance.now();
    if (reducedMotion ? !sample.forceReport && now - sample.lastReport < 1000 : sample.duration < 1) return;
    const textures = new Set<Texture>();
    if (scene.environment) textures.add(scene.environment);
    scene.traverse(object => {
      if (object instanceof Mesh) for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
      }
    });
    let textureBytes = 0;
    textures.forEach(texture => {
      const images = Array.isArray(texture.image) ? texture.image : [texture.image];
      for (const source of images) {
        const image = source as { width?: number; height?: number } | undefined;
        textureBytes += (image?.width ?? 0) * (image?.height ?? 0) * 4 * (texture.type === FloatType ? 4 : texture.type === HalfFloatType ? 2 : 1) * (texture.generateMipmaps ? 4 / 3 : 1);
      }
    });
    const models = Object.values(modelRegistry).filter(model => model.url).length;
    const metrics: WorldMetrics = {
      calls: gl.info.render.calls, triangles: gl.info.render.triangles,
      textures: gl.info.memory.textures, geometries: gl.info.memory.geometries,
      estimatedTextureMiB: Math.round(textureBytes / 1024 / 1024 * 10) / 10,
      fps: reducedMotion ? null : Math.round(sample.frames / sample.duration), frameMs: reducedMotion ? null : Math.round(sample.duration * 1000 / sample.frames * 10) / 10,
      renderMode: reducedMotion ? 'demand' : 'continuous',
      dpr: gl.getPixelRatio(), progress: Math.round(state.progress * 1000) / 1000,
      camera: [camera.position.x, camera.position.y, camera.position.z], quality, petRepresentation: models === 0 ? 'billboards' : models === 4 ? 'models' : 'mixed',
    };
    if (import.meta.env.DEV) window.__GOODKIND_3D__ = metrics;
    onMetrics?.(metrics);
    sample.duration = 0; sample.frames = 0;
    sample.lastReport = now; sample.forceReport = false;
  });
  return null;
}
