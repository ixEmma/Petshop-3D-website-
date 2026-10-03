import type { PetId } from '../../data/petAssets';

/** Set url only after the actual GLB exists. No speculative network requests. */
export const modelRegistry: Record<PetId, { url: string | null; expectedUrl: string; targetHeight: number }> = {
  dog: { url: null, expectedUrl: '/models/pets/dog-golden-retriever.glb', targetHeight: 3.25 },
  cat: { url: null, expectedUrl: '/models/pets/cat-fluffy.glb', targetHeight: 2.35 },
  rabbit: { url: null, expectedUrl: '/models/pets/rabbit-white.glb', targetHeight: 1.45 },
  parrot: { url: null, expectedUrl: '/models/pets/parrot-colorful.glb', targetHeight: 1.65 },
};
