import type { Point3, QualityProfile } from './types';

export const PALETTE = {
  cream: '#e8dfc9', plaster: '#e7d4b7', pale: '#f3ecd9', forest: '#244536',
  sage: '#9fAD8a', orange: '#c66b44', clay: '#bc7457', brass: '#a48a52',
};

export const QUALITY = {
  desktop: { dpr: 1.5, shadows: true, shadowSize: 1024, radialSegments: 64, particles: 110, archSegments: 40 },
  tablet: { dpr: 1.25, shadows: true, shadowSize: 512, radialSegments: 40, particles: 55, archSegments: 28 },
  mobile: { dpr: 1, shadows: false, shadowSize: 512, radialSegments: 24, particles: 24, archSegments: 20 },
} satisfies Record<QualityProfile, { dpr: number; shadows: boolean; shadowSize: number; radialSegments: number; particles: number; archSegments: number }>;

export interface CameraWaypoint { progress: number; position: Point3; target: Point3; fov: number; chapter: string }
export const CAMERA_PATH: CameraWaypoint[] = [
  { progress: 0, position: [-2.8, 3.2, 10.8], target: [0.3, 2.0, 0], fov: 40, chapter: 'hero' },
  { progress: .12, position: [-.8, 3.0, 6.8], target: [2.0, 2.1, -1.0], fov: 43, chapter: 'orbit' },
  { progress: .24, position: [-3.5, 3.7, -3.1], target: [.8, 1.9, -11], fov: 44, chapter: 'companions' },
  { progress: .36, position: [-.3, 3.3, -10.6], target: [1.2, 1.8, -20], fov: 45, chapter: 'gallery' },
  { progress: .50, position: [-3.6, 3.2, -14.5], target: [1.2, 1.6, -21.5], fov: 43, chapter: 'products' },
  { progress: .62, position: [-.5, 3.1, -23], target: [1.5, 2.0, -33], fov: 44, chapter: 'passage' },
  { progress: .74, position: [-3.5, 3.4, -26.1], target: [.9, 2.0, -33], fov: 43, chapter: 'story' },
  { progress: .84, position: [-3, 6.1, -23.8], target: [1, 1.3, -30], fov: 47, chapter: 'rise' },
  { progress: 1, position: [18, 21, 20], target: [0, 1.4, -16], fov: 46, chapter: 'finale' },
];

export const CHAPTER_STOPS = [0, .24, .50, .74, 1];
export const PRODUCT_IDS = ['daily-goodness', 'good-tug', 'fresh-start', 'everyday-bowl'];

export const PRODUCT_PLACEMENTS: { position: Point3; rotation: number; pedestal: number; scale: number }[] = [
  { position: [-.5, 0, -21], rotation: .12, pedestal: 1.3, scale: 1.25 },
  { position: [2.2, 0, -19.8], rotation: -.28, pedestal: .75, scale: 1.05 },
  { position: [3.2, 0, -23], rotation: -.2, pedestal: 1.65, scale: 1.55 },
  { position: [5.2, 0, -21], rotation: -.3, pedestal: .95, scale: 1.3 },
];
