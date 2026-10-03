import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { CanvasTexture, CatmullRomCurve3, type Group, MathUtils, type MeshStandardMaterial, Shape, SRGBColorSpace, Vector2, Vector3 } from 'three';
import { PALETTE, PRODUCT_IDS, PRODUCT_PLACEMENTS, QUALITY } from '../worldConfig';
import { Plinth } from './Architecture';
import type { ExperienceProps, QualityProfile, WorldState } from '../types';

function labelTexture(title: string, subtitle: string, background = '#f0e5d1') {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = background; ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#284734'; ctx.textAlign = 'center';
  ctx.font = 'bold 48px Arial'; ctx.fillText('goodkind', 256, 100);
  ctx.beginPath(); ctx.arc(256, 226, 50, 0, Math.PI * 2); ctx.fillStyle = '#ce784f'; ctx.fill();
  ctx.fillStyle = '#284734'; ctx.font = '34px Georgia'; ctx.fillText(title, 256, 350);
  ctx.font = '14px Arial'; ctx.fillText(subtitle.toUpperCase(), 256, 390);
  ctx.fillRect(178, 433, 156, 1); ctx.font = '11px Arial'; ctx.fillText('THE EVERYDAY COLLECTION', 256, 466);
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Pouch() {
  const shape = useMemo(() => {
    const s = new Shape(); s.moveTo(-.64, .03); s.quadraticCurveTo(-.74, .1, -.69, .32); s.lineTo(-.6, 1.64); s.lineTo(-.64, 1.91); s.quadraticCurveTo(0, 1.98, .64, 1.91); s.lineTo(.6, 1.64); s.lineTo(.69, .32); s.quadraticCurveTo(.74, .1, .64, .03); s.closePath(); return s;
  }, []);
  const label = useMemo(() => labelTexture('daily goodness', 'The everyday dog food', '#d99470'), []);
  useEffect(() => () => label.dispose(), [label]);
  return <group>
    <mesh castShadow receiveShadow position={[0, 0, -.23]}><extrudeGeometry args={[shape, { depth: .46, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 3, steps: 1, curveSegments: 12 }]} /><meshStandardMaterial color="#c57855" roughness={.69} /></mesh>
    <mesh position={[0, 1.03, .298]}><planeGeometry args={[1.11, 1.34]} /><meshStandardMaterial map={label} roughness={.69} /></mesh>
    {[1.80, 1.84, 1.88].map(y => <mesh key={y} position={[0, y, .035]} castShadow><boxGeometry args={[1.25, .018, .55]} /><meshStandardMaterial color="#b76a48" roughness={.8} /></mesh>)}
  </group>;
}

function Bottle({ quality }: { quality: QualityProfile }) {
  const label = useMemo(() => labelTexture('fresh start', 'For a tidy little ritual'), []);
  const profile = useMemo(() => [[0, 0], [.31, 0], [.37, .08], [.38, .22], [.38, 1.1], [.35, 1.22], [.2, 1.34], [.18, 1.47], [0, 1.47]].map(([x, y]) => new Vector2(x, y)), []);
  useEffect(() => () => label.dispose(), [label]);
  return <group>
    <mesh castShadow receiveShadow><latheGeometry args={[profile, QUALITY[quality].radialSegments]} /><meshPhysicalMaterial color="#6e3219" roughness={.25} metalness={.05} clearcoat={.6} clearcoatRoughness={.25} /></mesh>
    <mesh position={[0, .72, 0]} rotation={[0, Math.PI, 0]}><cylinderGeometry args={[.386, .386, .75, QUALITY[quality].radialSegments, 1, true]} /><meshStandardMaterial map={label} roughness={.73} /></mesh>
    <mesh position={[0, 1.45, 0]} castShadow><cylinderGeometry args={[.205, .21, .19, 32]} /><meshStandardMaterial color="#26332a" roughness={.3} /></mesh>
    <mesh position={[0, 1.62, 0]} castShadow><cylinderGeometry args={[.07, .07, .24, 20]} /><meshStandardMaterial color="#283329" roughness={.28} /></mesh>
    <mesh position={[.13, 1.75, 0]} castShadow><boxGeometry args={[.53, .13, .22]} /><meshStandardMaterial color="#26332a" roughness={.32} /></mesh>
    <mesh position={[.34, 1.68, 0]} castShadow><boxGeometry args={[.1, .15, .18]} /><meshStandardMaterial color="#26332a" roughness={.32} /></mesh>
  </group>;
}

function Bowl({ quality }: { quality: QualityProfile }) {
  const profile = useMemo(() => [[0, .08], [.56, .08], [.77, .12], [.9, .53], [.91, .59], [.85, .63], [.79, .59], [.68, .25], [.56, .2], [0, .2]].map(([x, y]) => new Vector2(x, y)), []);
  return <group><mesh castShadow receiveShadow><latheGeometry args={[profile, QUALITY[quality].radialSegments]} /><meshPhysicalMaterial color="#839174" roughness={.23} metalness={.02} clearcoat={.62} clearcoatRoughness={.18} /></mesh>
    <mesh position={[0, .22, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.12, .14, 32]} /><meshStandardMaterial color="#4b654e" roughness={.5} /></mesh></group>;
}

function Rope({ quality }: { quality: QualityProfile }) {
  const curves = useMemo(() => {
    const base = new CatmullRomCurve3([new Vector3(-.86, .12, 0), new Vector3(-.5, .3, .15), new Vector3(0, .22, 0), new Vector3(.5, .3, -.15), new Vector3(.9, .12, 0)]);
    return [0, 1, 2].map(index => new CatmullRomCurve3(Array.from({ length: 90 }, (_, i) => {
      const t = i / 89; const p = base.getPoint(t); const angle = t * Math.PI * 15 + index * Math.PI * 2 / 3;
      p.y += Math.cos(angle) * .062; p.z += Math.sin(angle) * .062; return p;
    })));
  }, []);
  const knots = useMemo(() => [-.76, .8].map(x => new CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => {
    const t = i / 79 * Math.PI * 4; return new Vector3(x + Math.sin(t * 1.5) * .18, .25 + Math.cos(t) * .14, Math.sin(t) * .16);
  }))), []);
  return <group rotation={[.08, -.2, -.06]}>
    {curves.map((curve, index) => <mesh key={index} castShadow receiveShadow><tubeGeometry args={[curve, quality === 'desktop' ? 140 : 80, .071, 7, false]} /><meshStandardMaterial color={index === 0 ? '#bc6e52' : index === 1 ? '#e9d9b7' : '#8d987a'} roughness={1} /></mesh>)}
    {knots.map((curve, index) => <mesh key={index} castShadow receiveShadow><tubeGeometry args={[curve, quality === 'desktop' ? 100 : 60, .086, 8, false]} /><meshStandardMaterial color={index ? '#e9d9b7' : '#bc6e52'} roughness={1} /></mesh>)}
  </group>;
}

function Product({ index, state, quality, reducedMotion, onSelect }: { index: number; state: WorldState; quality: QualityProfile; reducedMotion: boolean; onSelect: (id: string) => void }) {
  const ref = useRef<Group>(null);
  const highlight = useRef<MeshStandardMaterial>(null);
  const gl = useThree(value => value.gl);
  const [hover, setHover] = useState(false);
  const placement = PRODUCT_PLACEMENTS[index];
  useFrame((_, delta) => {
    if (!ref.current) return;
    const active = hover || state.selectedProduct === index;
    const previousRotation = ref.current.rotation.y;
    const previousHeight = ref.current.position.y;
    const rotation = placement.rotation + (active && !reducedMotion ? .24 : 0);
    ref.current.rotation.y = reducedMotion ? placement.rotation : MathUtils.damp(ref.current.rotation.y, rotation, 7, delta);
    ref.current.position.y = reducedMotion ? placement.pedestal + .14 : MathUtils.damp(ref.current.position.y, placement.pedestal + .14 + (active ? .12 : 0), 7, delta);
    highlight.current?.color.set(active ? '#cf754a' : PALETTE.brass);
    if (Math.abs(previousRotation - ref.current.rotation.y) + Math.abs(previousHeight - ref.current.position.y) > .001) gl.shadowMap.needsUpdate = true;
  });
  useEffect(() => { if (!hover) return; const previous = document.body.style.cursor; document.body.style.cursor = 'pointer'; return () => { document.body.style.cursor = previous; }; }, [hover]);
  const over = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); setHover(true); };
  return <group position={placement.position}>
    <Plinth position={[0, 0, 0]} radius={index === 1 || index === 3 ? 1.05 : .85} height={placement.pedestal} color={index % 2 ? PALETTE.sage : PALETTE.pale} quality={quality} />
    <group ref={ref} position={[0, placement.pedestal + .14, 0]} rotation={[0, placement.rotation, 0]} scale={placement.scale} onPointerOver={over} onPointerOut={() => setHover(false)} onClick={event => { event.stopPropagation(); onSelect(PRODUCT_IDS[index]); }}>
      {index === 0 ? <Pouch /> : index === 1 ? <Rope quality={quality} /> : index === 2 ? <Bottle quality={quality} /> : <Bowl quality={quality} />}
    </group>
    <mesh position={[0, placement.pedestal + .105, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[index === 1 || index === 3 ? .96 : .76, index === 1 || index === 3 ? .985 : .785, 48]} /><meshStandardMaterial ref={highlight} color={PALETTE.brass} roughness={.35} metalness={.6} /></mesh>
  </group>;
}

export function ProductObjects({ state, quality, reducedMotion, onProductSelect }: Pick<ExperienceProps, 'state' | 'quality' | 'reducedMotion' | 'onProductSelect'>) {
  return <group name="real-3d-product-gallery">{PRODUCT_PLACEMENTS.map((_, index) => <Product key={index} index={index} state={state} quality={quality} reducedMotion={reducedMotion} onSelect={onProductSelect} />)}</group>;
}
