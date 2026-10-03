# Animation and 3D architecture

This replaces the earlier DOM parallax architecture. The old hero/section animation hook is removed. A continuous Three.js world supplies the camera, geometry, material response and atmosphere; semantic HTML supplies the reading and interaction experience.

## Ownership

```text
App
├─ ExperienceUI                 HTML chapters, menu, product controls and fallback
├─ ProductDialog                native modal and Lenis pause
├─ createScrollTimeline         one ScrollTrigger -> mutable WorldState.progress
├─ useDisplayProfile            viewport composition and live reduced motion
├─ useAdaptiveQuality           measured render quality and illustrated fallback
└─ lazy Experience / Canvas
   ├─ CameraRig                 only camera transform/FOV owner
   ├─ Lighting / Environment    illumination and reflection environment
   ├─ World                     architecture, plants, plinths and pet placement
   ├─ ProductObjects            procedural product meshes and pointer interaction
   ├─ Atmosphere / Particles    fabric shader, fog and sparse dust
   └─ SceneController           invalidation, context loss and telemetry
```

`WorldState` is a shared mutable object, not per-frame React state. It contains scroll progress, the selected product index, and an invalidation callback owned by the mounted Canvas. HTML focus and pointer selection reach the same product details. The Canvas is hidden from the accessibility tree.

## Scroll, chapters and GSAP

`src/animation/scrollTimeline.ts` creates one scoped `gsap.context` and one `fromTo` tween of world progress from 0 to 1. Its ScrollTrigger is `goodkind-world-journey`, spanning `#journey` from `top top` to `bottom bottom`. Normal motion uses a 0.65-second scrub; reduced and illustrated modes use immediate scrub.

Chapter thresholds come from measured HTML section offsets, not assumptions about fixed screen heights. React chapter state updates only when the chapter changes. The progress rail is a CSS custom property. The tween invalidates R3F after updating progress, which also supports demand rendering.

Fonts becoming ready cause a guarded refresh. Texture loading does not define document length. Cleanup reverts the scoped tween/trigger, stops the owned Lenis lifecycle, removes the progress property, and prevents a late font callback from refreshing a disposed page.

The HTML chapters remain the scroll source even if WebGL is unavailable. Changing the view manually preserves the current chapter through an immediate scroll to its matching element.

## Camera choreography

`worldConfig.ts` defines nine keyframes with normalized progress, position, look-at target and FOV. `CameraRig` is the sole camera writer. It interpolates between adjacent keyframes using smoothstep and reuses four vectors; it does not allocate new vectors each frame or use OrbitControls.

| Progress | Camera beat |
| --- | --- |
| 0–0.12 | Arrival and a restrained orbit around the dog tableau |
| 0.12–0.36 | Travel through arches toward the companion room |
| 0.36–0.62 | Collection approach and product display |
| 0.62–0.84 | Warm story room, followed by a rising perspective |
| 0.84–1 | Elevated closing view across the whole gallery |

The world uses one unit per meter, Y up, and forward-facing authored assets along +Z. Principal tableaux occupy approximately Z = 0, −11, −21 and −33. These are world placements, not CSS parallax values.

Desktop adds at most 0.1 world units of pointer-driven camera X offset and 0.06 Y offset. Tablet increases FOV by four degrees. Mobile shifts the camera/target for portrait framing and increases FOV by twelve degrees. Adaptive render quality does not replace these viewport-specific camera choices.

Reduced motion snaps camera progress to the nearest stop at 0, 0.24, 0.5, 0.74 or 1. Pointer movement is disabled. This retains spatial views without continuous travel through the gallery.

## Two explicit clocks

GSAP's ticker owns smooth scrolling; R3F owns rendering. These are separate responsibilities, not duplicated owners of the same animation.

`src/lib/lenis.ts` creates at most one active Lenis instance with `autoRaf: false`. Its GSAP ticker callback calls `lenis.raf(seconds * 1000)`, and Lenis scroll events call `ScrollTrigger.update`. Touch scrolling remains native. Lenis is absent in reduced motion and the illustrated view.

Native menus and product dialogs pause the shared Lenis instance and restore it on close, including momentum. The pause state survives a preference change that recreates Lenis while a dialog remains open. Native dialog behavior contains focus and supports Escape; the HTML components restore focus and body overflow.

The cleanup sequence is:

1. Revert the page GSAP context and kill its owned timeline/trigger.
2. Remove the Lenis GSAP ticker callback and scroll callback.
3. Stop Lenis before destroying it, preventing pending native-scroll state timeouts from restoring its classes.
4. Clear the active reference and restore GSAP lag smoothing.

R3F uses `frameloop="always"` for normal motion and `"demand"` for reduced motion. No component adds an independent handwritten render RAF. In demand mode, scroll, product focus/selection, and profile changes explicitly invalidate the Canvas; autonomous animation does not request a perpetual loop.

## Geometry, lighting and effects

`World` composes a floor, side bands, walls, thick extruded arches, plinths and botanical accents. Repeated plinth flutes, leaves and stems use instancing. Their instance transforms are prepared outside the render loop.

`ProductObjects` creates a pouch, a rope toy, a bottle and a bowl using extrusions, tubes and lathed profiles. These are actual volumetric objects with product-shaped silhouettes, but remain procedural proxies. Pouch/bottle labels use generated Canvas textures. Hover/focus lift and rotation use damped transforms under normal motion; reduced motion keeps them static.

Lighting combines a warm shadow-casting directional key, cool fill, hemisphere light and a warm story-room point light. The key tracks scroll progression so its shadow camera covers the active room. Shadow maps are cached during idle periods and marked dirty when the lighting position/progression or quality changes. The controller restores the prior shadow auto-update flag on cleanup. PCF shadows are explicitly selected on profiles that enable shadows.

A locally generated Drei environment with three Lightformers supplies reflections; it renders once per configured environment rather than downloading an HDR. Materials use standard/physical PBR parameters with restrained roughness, metalness and clearcoat. Tone mapping is ACES Filmic at exposure 1.05.

Atmosphere includes distance fog, an animated fabric shader and one sparse dust point cloud. Time-driven shader motion stops under reduced motion. No bloom, depth of field, SSAO, physics, or postprocessing composer is installed.

## Pet assets and future model ownership

Every current model registry URL is `null`. `PetPortrait` therefore loads an existing WebP as an sRGB texture on a 2:3 camera-facing plane. These are billboards; their flatness is a known limitation. Mobile render quality chooses the 400×600 files, with 800×1200 files otherwise. A stylized circular contact mark supports the fallback portrait rather than pretending to be a volumetric animal shadow.

A future non-null registry URL activates `GltfPet`. The adapter uses `useGLTF`, clones the hierarchy with `SkeletonUtils`, measures its bounds, centers X/Z, places its lowest point on Y=0, and scales to the requested tableau height. Registry display heights can be overridden by the world composition; they are not claimed as biological dimensions.

The adapter prefers an authored `Idle` clip, then `Breathe`; it pauses/stops animation when reduced motion is active. There are no working skeletal pet clips in the delivered scene because no GLBs were supplied.

Each mounted clone owns its skeletons and animation mixer state. Cleanup stops actions, uncaches its root, and disposes its unique skeleton resources. Shared loader-cached geometries/materials are not disposed by one clone; `dispose={null}` protects those shared resources. Generated product label textures have explicit cleanup. Declarative R3F geometry/material resources follow R3F disposal ownership.

An invalid future GLB can reach the world error boundary and select the illustrated experience. The loader path has been reviewed in source but has not been validated with a real supplied model. See [3D_ASSET_REQUIREMENTS.md](./3D_ASSET_REQUIREMENTS.md) and [BLENDER_PIPELINE.md](./BLENDER_PIPELINE.md) before replacing registry URLs.

## Quality, telemetry and fallback

Viewport profiles cap DPR at 1.5 / 1.25 / 1, shadow resolution at 1024 / 512 / off, radial segments at 64 / 40 / 24, and dust at 110 / 55 / 24. Reflection environment resolution and arch detail also reduce. A separate adaptive render profile can lower these costs while preserving viewport camera composition.

`useAdaptiveQuality` waits six seconds after each measured quality change. Three consecutive samples below 24 FPS lower desktop/tablet one level. Three samples below 12 FPS at the mobile level switch to the illustrated experience. Hidden documents, open dialogs, and reduced-motion samples are excluded. Visibility changes reset the sample window; retry resets adaptive state. These thresholds are recovery heuristics, not a promise of a target frame rate.

`SceneController` reports:

- Renderer draw calls, triangles, geometry/texture counts, DPR, camera position and progress.
- Sampled FPS/frame duration in continuous mode; `null` for those values in demand mode.
- An estimated active texture allocation derived from dimensions, data type and mipmaps, not total GPU memory.
- Registry-derived pet representation: billboards, mixed, or models.

Reports are throttled to approximately one-second intervals and reset when quality/motion mode changes. Development exposes the latest sample through `window.__GOODKIND_3D__`. Counts describe observed rendering; they are not manufactured budget results. Memory estimates exclude driver overhead, shadow/render targets and unused loader-cache entries.

WebGL capability is checked before mounting the lazy 3D bundle. A context-loss listener switches to the illustrated view and is removed on unmount. The world boundary handles loading/render failures. The HTML loading overlay stays outside Canvas; the Drei progress store subscription defers its HTML update to a microtask and unsubscribes/guards pending work on cleanup. There is no nested Drei Html loading root.

Live reduced-motion subscriptions and viewport media queries remove their listeners on unmount. Canvas invalidation and the development telemetry global are cleared only by their owning controller. Source review covered StrictMode/HMR ownership; browser acceptance evidence is tracked separately.

## Validation status

The earlier software-rendered probe was severely slow, approximately 0–1 FPS. That evidence prompted adaptive degradation and a complete illustrated fallback; it does not establish hardware performance. Three.js was pinned to 0.182.0 while addressing an upstream `THREE.Clock` warning in the initial 0.186.1 run. Final build, browser, console, and performance results are pending in [FINAL_REPORT.md](./FINAL_REPORT.md).

No Blender export or real GLB animation test has been performed. The original asset provenance document and raster files remain intact.
