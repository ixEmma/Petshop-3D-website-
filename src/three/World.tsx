import { Pet } from './models/Pet';
import { Botanical, Plinth, Portal } from './props/Architecture';
import { PALETTE } from './worldConfig';
import type { ExperienceProps } from './types';

export function World({ quality, reducedMotion }: Pick<ExperienceProps, 'quality' | 'reducedMotion'>) {
  return <group name="goodkind-boutique-world">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.05, -16]} receiveShadow><planeGeometry args={[80, 110]} /><meshStandardMaterial color={PALETTE.cream} roughness={.57} metalness={.03} /></mesh>
    <mesh position={[0, -.13, -16]} receiveShadow><boxGeometry args={[14.6, .22, 54]} /><meshStandardMaterial color={PALETTE.plaster} roughness={.9} /></mesh>
    {[-6.1, 6.1].map(x => <mesh key={x} position={[x, .012, -16]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.055, 53]} /><meshStandardMaterial color={PALETTE.brass} metalness={.55} roughness={.35} /></mesh>)}
    {[5.5, -5.5, -16.5, -27.5, -38.5].map((z, index) => <Portal key={z} z={z} quality={quality} color={index === 3 ? '#c0c6a7' : PALETTE.plaster} />)}
    {/* Thick gallery walls create real occlusion and shadow, not a backdrop plane. */}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 7.7, 2.0, -16]} receiveShadow castShadow><boxGeometry args={[.8, 4, 45]} /><meshStandardMaterial color={PALETTE.plaster} roughness={.9} /></mesh>
      <mesh position={[side * 7.65, 4.12, -16]} receiveShadow><boxGeometry args={[1.1, .24, 45]} /><meshStandardMaterial color={PALETTE.pale} roughness={.7} /></mesh>
    </group>)}
    {/* Arrival: a sculptural stage with a photographic pet portrait. */}
    <Plinth position={[2.8, 0, 0]} radius={2.15} height={.85} color={PALETTE.clay} quality={quality} fluted />
    <Plinth position={[2.8, .89, 0]} radius={1.94} height={.13} color={PALETTE.pale} quality={quality} />
    <Pet id="dog" position={[2.8, 1.14, 0]} height={3.4} quality={quality} reducedMotion={reducedMotion} />
    <Plinth position={[-3.8, 0, 4.9]} radius={1.15} height={1.65} color={PALETTE.sage} quality={quality} />
    <Botanical position={[5.7, 0, -2.7]} quality={quality} scale={1.4} />
    {/* The companion garden reveals several physically separated displays. */}
    <Plinth position={[2.5, 0, -10.6]} radius={1.65} height={1.25} color={PALETTE.sage} quality={quality} fluted />
    <Pet id="cat" position={[2.5, 1.4, -10.6]} height={2.6} quality={quality} reducedMotion={reducedMotion} />
    <Plinth position={[.1, 0, -9.1]} radius={.95} height={.55} color={PALETTE.clay} quality={quality} />
    <Pet id="rabbit" position={[.1, .7, -9.1]} height={1.5} quality={quality} reducedMotion={reducedMotion} />
    <Plinth position={[5.2, 0, -12.4]} radius={.82} height={2.15} color={PALETTE.pale} quality={quality} />
    <Pet id="parrot" position={[5.2, 2.28, -12.4]} height={1.65} quality={quality} reducedMotion={reducedMotion} />
    <Botanical position={[-4.4, 0, -12]} quality={quality} scale={1.15} />
    <Botanical position={[5.7, 0, -8]} quality={quality} scale={.85} />
    {/* Quiet end chamber: raised semicircular steps and a reading companion. */}
    <Plinth position={[2, 0, -33.4]} radius={3.25} height={.24} color={PALETTE.sage} quality={quality} />
    <Plinth position={[2, .26, -33.4]} radius={2.9} height={.3} color={PALETTE.sage} quality={quality} />
    <Plinth position={[2.8, .61, -33.5]} radius={1.2} height={.7} color={PALETTE.pale} quality={quality} />
    <Pet id="cat" position={[2.8, 1.43, -33.5]} height={2.65} quality={quality} reducedMotion={reducedMotion} />
    <Botanical position={[-2.5, 0, -35.6]} quality={quality} scale={1.8} />
    <Botanical position={[5.5, .55, -34.5]} quality={quality} scale={1.1} />
    <mesh position={[0, 2.8, -40]} receiveShadow><boxGeometry args={[16, 5.6, .7]} /><meshStandardMaterial color={PALETTE.sage} roughness={.85} /></mesh>
  </group>;
}
