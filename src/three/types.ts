export type QualityProfile = 'desktop' | 'tablet' | 'mobile';

/** Mutated by the single GSAP scroll timeline; never set React state per frame. */
export interface WorldState {
  progress: number;
  selectedProduct: number;
  invalidate?: () => void;
}

export interface WorldMetrics {
  calls: number;
  triangles: number;
  textures: number;
  estimatedTextureMiB: number;
  geometries: number;
  fps: number | null;
  frameMs: number | null;
  renderMode: 'continuous' | 'demand';
  dpr: number;
  progress: number;
  camera: [number, number, number];
  quality: QualityProfile;
  petRepresentation: 'billboards' | 'models' | 'mixed';
}

export interface ExperienceProps {
  state: WorldState;
  quality: QualityProfile;
  /** Lower GPU settings without changing viewport-dependent camera framing. */
  renderQuality?: QualityProfile;
  reducedMotion: boolean;
  onReady: () => void;
  onError: () => void;
  onProductSelect: (id: string) => void;
  onMetrics?: (metrics: WorldMetrics) => void;
  onProgress?: (progress: number) => void;
}

export type Point3 = [number, number, number];

declare global {
  interface Window { __GOODKIND_3D__?: WorldMetrics; }
}
