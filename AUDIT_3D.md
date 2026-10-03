# Audit for the 3D rebuild

Audited on 2026-10-02 in `E:\petshop\goodkind-ultra`. This file distinguishes the inherited 2D baseline from the new renderer. Historical 2D verification is not proof that a new WebGL scene passes. Implementation-specific results are recorded below as the new files become available.

## Baseline before the 3D rewrite

| Area | Observed state |
| --- | --- |
| Framework | React / React DOM 19.3.0, Vite 8.3.2, TypeScript 7.0.2 |
| Styling | Tailwind CSS and Vite plugin 4.3.3, custom CSS, system Arial/Helvetica and Georgia serif |
| Animation | GSAP / ScrollTrigger 3.15.0; Lenis 1.3.26 |
| Other tooling | React Vite plugin 6.1.1; React type packages 19.3.0; npm / `package-lock.json` |
| Folder structure | `src/components`, `sections`, `data`, `hooks`, `lib`, `styles`; `public/pets`, `public/products`; original images in `assets/source`; verification scripts and artifacts |
| Prior render architecture | Semantic sections plus independently positioned 2D portraits, scoped entrance/reveal/parallax timelines, CSS hover effects |
| Pet models | No GLB, GLTF, `.blend`, rig, skeleton, or animation clips supplied |
| Blender | No executable found in rebuild preflight; no Blender asset authoring/export claimed |
| Git | Folder/parent are not a Git repository; clean/dirty status is not applicable; no repository was initialized |
| Commands | `npm run dev` (5174), `typecheck`, `build`, `preview` (4174), `verify`, `verify:production` |
| Lint/unit framework | None configured in baseline |

Installed additions in the reviewed manifest are Three.js 0.186.1, React Three Fiber 9.8.1, Drei 10.7.9, Three.js declarations 0.186.0, and Biome 2.5.15 for linting. `npm run lint` now runs `biome lint src vite.config.ts`. An attempted incompatible TypeScript-ESLint setup was not added. No postprocessing or physics package is installed. No backend, cart, auth, CMS, or deployment is part of this change.

## What to retain and what to replace

| Existing source/decision | Disposition | Reason |
| --- | --- | --- |
| `src/data/products.ts`, useful category/value copy | Retain/adapt | Believable fictional products, descriptions, accessible details, no invented health/review claims |
| `src/data/petAssets.ts` source/alt mappings | Retain | Independent standard/small raster references remain useful for billboards, loading, and fallback |
| Old `heroPets` CSS coordinates | Replace as primary scene coordinates | Percent-based document positions do not define a 3D world or camera path |
| Responsive HTML image behavior from `PetAsset` | Reimplemented as `ExperienceUI`'s `PetPortrait` | Preserves useful alt text, stable image ratios, optimized raster variants |
| `ParallaxPet` nested CSS transform system | Retire from primary visual architecture | Useful historical technique, but the new primary movement must come from world/camera choreography |
| Navigation/CTA behavior and native product dialog | New navigation/CTA markup; retained/adapted `ProductDialog` | Keyboard operation, Escape, focus return, and modal scroll locking remain valuable |
| Product card layout | Replace as primary visual experience | Product geometry and spatial staging should lead; semantic product controls/details remain in HTML |
| Hero/category/story/final section concepts | Recompose as continuous chapters | Keep their narrative purpose while camera travel links the scenes |
| `useSiteMotion` many independent 2D reveals | Replace as main motion controller | One readable scene/scroll state should synchronize camera, lights, world, and HTML |
| `src/lib/gsap.ts` | Retain | Central plugin registration |
| `src/lib/lenis.ts` lifecycle | Retain/adapt | One GSAP-driven Lenis instance, explicit `autoRaf:false`, stop-before-destroy, modal pause state |
| Warm cream/forest/terracotta palette | Retain in UI and materials | Existing brand direction fits an abstract premium pet boutique |
| Responsive hierarchy / focus contrast / reduced motion | Preserve intent and retest | A Canvas changes projection and motion cost; old screenshots are insufficient |
| Prior verify scripts and screenshots | Historical reference; update tests | Old selectors/assertions describe the former 2D page |

The rewrite removed the old `Hero`, `Categories`, `FeaturedProducts`, `BrandStory`, `Benefits`, `FinalCTA`, and `Footer` section files; `Header`, `AnimatedText`, `CTAButton`, `PetAsset`, `ParallaxPet`, and `ProductCard` components; `useSiteMotion`; and the old `siteContent` data file. The unused `heroPets` placement block was removed from `petAssets`. It retained `Icons`, `ProductDialog`, product data, pet image metadata, and the GSAP/Lenis libraries. `App`, styles, and visual orchestration were rewritten; `ExperienceUI`, `WorldBoundary`, `useDisplayProfile`, and `animation/scrollTimeline` provide the new HTML and choreography structure. All 20 PNG/WebP files in `public` and `assets/source` remain present; no original raster image was removed in the reviewed rewrite.

## Asset inventory and reality check

The four animal PNGs are 1024×1536 RGBA. Each has 800×1200 and 400×600 WebPs. The full/small runtime pet sets total 805,134 / 216,324 bytes. The four product originals are 1145×1374, 1536×1024, 1024×1536, and 1536×1024, respectively; optimized product WebPs total 137,070 bytes. The detailed A/B/C/D/E classification and future model contract are in [3D_ASSET_REQUIREMENTS.md](./3D_ASSET_REQUIREMENTS.md).

There are no volumetric pet assets at baseline. Pets on alpha planes must be called billboards. Runtime-created platforms, arches, packaging forms, rope, bowl, and other geometric props can be genuine 3D geometry while remaining stylized procedural proxies rather than supplied production GLBs. Do not turn a model-loading slot or a successful `useGLTF` import into a claim that real models have been delivered.

## Agreed architecture contract

The primary application keeps semantic HTML navigation, headings, copy, links, product information, and dialogs separate from a persistent WebGL world. Camera waypoints and chapter ranges belong in readable data. GSAP/ScrollTrigger writes shared scene progress; Lenis stays attached to GSAP's ticker; R3F owns rendering and consumes scene state. No component should add a separate hand-written RAF loop to duplicate those clocks.

The implemented model registry has disabled/null URLs until validated files exist. `models/Pet.tsx` can replace a billboard, normalize height and contact placement, clone skinned scenes, and prefer `Idle`/`Breathe`. This is readiness for future assets, not evidence that model loading/rig animation has been exercised with real pet models.

The new renderer is split into `Experience`, `CameraRig`, `Lighting`, `Environment`, `World`, `SceneController`, `worldConfig`, pet registry/adapter, `props/Architecture`, `props/ProductObjects`, `effects/Atmosphere`, and `effects/Particles`. Camera position, look target, FOV, and progress stops are in `worldConfig`. The GLB adapter is shared rather than duplicated into four wrappers that do the same work.

Actual runtime geometry includes thick gallery walls and arches, a floor, cylindrical/fluted pedestals, botanical forms, and volumetric pouch, bottle, twisted-rope, and bowl proxies. Flutes, leaves, and stems use GPU instances. Pouch/bottle labels use owned canvas textures. A locally rendered Drei/Lightformer environment supplies reflections without an HDR download. One moving directional shadow light, hemisphere/fill lighting, and a warm end-room point light shape the scene. Fabric vertex displacement, fragment weave, fog, and a small point-based dust field supply effects. No DOF, bloom, or postprocessing pass is claimed.

| Current configured quality | DPR cap | Shadow map | Dust points | Radial / arch segments |
| --- | ---: | --- | ---: | --- |
| Desktop | 1.5 | 2048², enabled | 110 | 64 / 40 |
| Tablet | 1.25 | 1024², enabled | 55 | 40 / 28 |
| Mobile | 1.0 | Disabled; configured size unused | 24 | 24 / 20 |

These are settings, not benchmark results. Viewport camera framing is separate from a lower GPU render-quality override. Reduced motion uses demand rendering, quantized camera stops, still fabric/particles, and no active pet idle. GSAP invalidates the demand Canvas when scroll progression changes. The simpler view unmounts the world and reuses preserved raster/HTML content.

For a cold profile, the four unique 800×1200 pet maps plus two 512² product-label maps have an estimated RGBA8 allocation of 23,275,560 bytes (22.20 MiB) including full mip chains. Using 400×600 pets reduces that estimate to 7,915,560 bytes (7.55 MiB). This is a calculation from image dimensions and assumed texture format, not a VRAM measurement or total allocation cap. It excludes the generated environment/PMREM targets, shadow maps, framebuffer/depth storage, and driver overhead. Previously loaded quality variants may also stay in loader caches. `gl.info.memory.textures` reports a count, not bytes.

## Review gates for the implementation

- Resource ownership: stable/memoized geometry, textures, materials, curve/vector scratch objects; no allocations or React setState on every frame; dispose owned GPU resources without invalidating shared loader caches.
- Clocks: one Lenis ticker callback, one coordinated scene scroll controller, R3F's render loop only; kill owned GSAP context/trigger/tweens and remove listeners on unmount/HMR.
- Camera: one owner of position/look target/FOV; deterministic seek from scroll; no conflict with automatic OrbitControls; framing and clipping checked at six widths.
- Quality: bounded DPR, explicit desktop/tablet/mobile settings, controlled shadows and particle counts; no automatic all-effects postprocessing stack.
- Motion: live preference changes stop long travel and automatic motion while preserving a visual fallback/still scene and semantic content. Still mode must not leave an unnecessary continuous expensive render loop.
- Loading/failure: useful branded initial imagery; progress only for real tracked work; errors/context loss reveal a usable raster/HTML experience; optional null model URLs never create expected 404s.
- Interaction: meaningful pointer/raycast behavior supplements keyboard-accessible HTML actions; transparent full-screen overlays must not silently block intended Canvas interactions.
- Measurement honesty: renderer draw calls/triangles are sampled values; texture bytes require explicit estimation; FPS is measured for the stated environment only, never invented from a quality preset.
- Models: mixer/actions cleaned up, independent skeletons per clone, no mutation/disposal of shared cached assets, optional clip handling; no real model/clip validation claim while the manifest uses null URLs.

## Status of the new implementation audit

The first complete `src/three` source pass has been reviewed read-only alongside App, HTML UI, profile handling, and the scroll controller. Confirmed: no added manual RAF loop; mutable scene progress avoids per-frame React state; CameraRig reuses vectors; geometry generation is memoized where needed; label textures have explicit disposal; Lenis/context/listener cleanup remains scoped; null GLB paths do not request absent files; loading percentages come from actual Drei loading state; unavailable/lost WebGL uses a retained visual/HTML fallback.

Source findings corrected and checked in the revised implementation:

1. `models/Pet.tsx` now explicitly disposes each unique owned cloned skeleton, while leaving loader-cached geometry, materials, and textures shared. Mixer actions still stop and uncache on cleanup. Ownership was checked against the installed Three.js SkeletonUtils/Skeleton source. Actual skinned-pet runtime validation remains pending delivery of a GLB.
2. `SceneController.tsx` resets telemetry counters on mode/quality changes and refreshes throttled demand snapshots on invalidated frames. FPS remains null in demand mode. Pet representation derives from enabled registry URLs, rather than being permanently hardcoded. Texture allocation is explicitly estimated from referenced image dimensions/type/mips, separate from the renderer's texture count.
3. The footer was changed to cream with a forest focus outline, removing the orange-on-dark-green contrast issue.

No remaining actionable source defect was found in this reviewed revision. The primary agent owns browser testing and final build/lint verification; composition and device performance need that separate evidence. No hardware frame-rate guarantee, real GLB/clip test, or final six-width visual pass is asserted by this source review. The current registry remains all-null, and no GLB/GLTF/Blender file is present in the asset directories.

The [Blender pipeline](./BLENDER_PIPELINE.md) and asset budgets are future delivery requirements. Runtime behavior and measured results must be checked against the final source and browser artifacts before the rebuild is declared complete.
