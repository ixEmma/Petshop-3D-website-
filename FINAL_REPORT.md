# Goodkind 3D rebuild — delivery report

**Status: 3D source prepared for GitHub; TypeScript, Biome lint, and the production build passed on October 3, 2026. Browser and physical-device acceptance remain incomplete.** This report separates the delivered source from unverified outcomes. No target-hardware 60 FPS claim, completed Blender work, or volumetric pet model claim is made.

## Requested report

1. **Retained:** Goodkind branding, useful product copy/data, four pet portraits, four product images, semantic content, native product-dialog behavior, icons, and the GSAP/Lenis integration foundations.
2. **Removed:** The old section-based pet parallax architecture, `useSiteMotion`, independent 2D hero placement data, and obsolete hero/category/story/product-card components. Original raster assets were retained.
3. **Rewritten:** App orchestration, page composition, styles, navigation/chapters and scroll choreography now coordinate a fixed real-time gallery with accessible HTML and an illustrated fallback.
4. **Existing assets reused:** All four pet image pairs, product WebPs, favicon and preserved PNG sources. The original generation/provenance record remains in `ASSETS.md`.
5. **Textures/billboards:** Existing pet WebPs are sRGB textures on camera-facing 2:3 planes. Product images remain useful HTML images. Two procedural label textures are generated for product meshes.
6. **Real 3D assets used:** Authored-in-code volumetric architecture, plinths, botanical forms and four procedural product objects. No externally supplied GLB or Blender model is present.
7. **Proxies remaining:** All four animals are billboards. The pouch, rope toy, bottle and bowl are product-shaped procedural proxies, not final manufactured-product models.
8. **New packages:** Three.js 0.182.0, React Three Fiber 9.8.1, Drei 10.7.9, Three type declarations and Biome 2.5.15. Existing React/Vite/TypeScript/Tailwind/GSAP/Lenis remain. Three was pinned back from the initial 0.186.1 install while resolving an upstream clock warning.
9. **Three.js architecture:** A lazy `Experience` owns Canvas; camera, world, lighting, environment, products, effects and telemetry have separate components. HTML stays outside the renderer and remains accessible.
10. **Camera path:** Nine position/look-at/FOV keyframes interpolate along normalized scroll progress, with one camera owner, restrained desktop pointer offset, portrait framing and discrete reduced-motion poses.
11. **Scene structure:** One continuous gallery supports arrival, companion, collection, story and closing chapters. Rooms occupy successive world depths rather than being separate stacked image sections.
12. **Lighting:** Warm directional key with PCF shadows, cool fill, hemisphere light, a warm story light and locally generated reflection environment. The key tracks the active room; idle shadow maps are cached.
13. **Materials:** Plaster, fabric, clay, brass and product surfaces use restrained standard/physical PBR materials. Billboards use transparent image materials. ACES Filmic tone mapping unifies the scene.
14. **Postprocessing:** None installed. No bloom, depth of field or SSAO is claimed; lighting, material response, fog and composition supply the visual treatment.
15. **Particles/effects:** A sparse single dust point cloud, subtle fabric displacement/weave shader and distance fog. Time-driven effects stop under reduced motion.
16. **GSAP:** A scoped tween owns the shared world progress value. Cleanup reverts its context; no per-frame React state updates drive the camera.
17. **ScrollTrigger:** One `goodkind-world-journey` trigger maps document scroll to 0–1 progress. HTML chapter thresholds are measured, and timeline changes invalidate demand rendering.
18. **Lenis:** One instance, driven by GSAP's ticker with `autoRaf: false`. Native dialogs pause it. Cleanup removes callbacks, stops then destroys it, and restores ticker lag smoothing. Reduced and illustrated modes use native scrolling.
19. **Model animation:** The future GLB adapter selects `Idle` or `Breathe` and owns mixer/skeleton cleanup. No rigged animal, skeletal animation, gait or expression is delivered or tested.
20. **Optimizations:** Lazy 3D bundle, DPR caps, lower mobile tessellation/textures/environment detail, instanced repeated geometry, cached shadows, sampled telemetry and demand rendering under reduced motion. Sustained poor measured performance lowers quality and ultimately selects illustrated HTML.
21. **Desktop:** Wider camera composition, full configured geometry, capped 1.5 DPR and shadows. Real camera travel leads through the gallery; final 1440/1280 px evidence is pending.
22. **Tablet:** Wider FOV, intermediate geometry, 1.25 DPR cap and 512 px shadows. Final 1024/768 px evidence is pending.
23. **Mobile:** Portrait camera offsets, lowest geometry profile, 1 DPR, small pet textures, 24 dust points and no shadows. All HTML product interactions remain available; final 430/375 px evidence is pending.
24. **Reduced motion:** Live preference changes disable smooth scroll and autonomous/pointer motion, select fixed chapter camera poses, and switch Canvas to demand rendering. Scroll/focus still invalidate the required frames.
25. **Build/test results:** TypeScript and production build passed on October 3, 2026; Biome checked 29 files with no findings. Browser acceptance remains incomplete. Earlier 2D acceptance results do not prove this rebuild.
26. **Console status:** Initial nested-root loading errors and shader/shadow warnings were addressed. Three 0.182.0 addresses the upstream clock compatibility concern. A fresh final console capture is pending; no clean-console claim is made yet.
27. **Known limitations:** Flat pets, provisional procedural products, no commerce service, no real-model integration test, no physical-device performance evidence, and poor observed software-renderer throughput. The complete illustrated fallback is an intentional recovery path.
28. **Missing final assets:** Four optimized pet GLBs—dog, cat, rabbit and parrot—with final PBR textures and appropriate authored clips; production product meshes/materials if greater fidelity is required.
29. **Blender work remaining:** Model/sculpt, retopologize, unwrap, bake compatible PBR textures, rig, author clips, create LODs, export and validate. Blender was unavailable; the documented pipeline was not executed.
30. **Strongest next iteration:** Integrate one final dog GLB end to end and profile it on target hardware before scaling to all pets. Validate ground contact, material response, animation, camera silhouette and frame cost, then replace the remaining billboards within measured budgets.

## Evidence and acceptance

An **earlier diagnostic software-rendered run**, before the final runtime and adaptive-quality fixes, recorded approximately **0–1 FPS**, **1.77–5.58 seconds per frame**, **85–175 draw calls**, **46,180–79,712 triangles**, **12 renderer textures**, approximately **22.9 MiB estimated active textures**, and **DPR 1** across sampled scroll positions. Its files are `artifacts/world-probe.json` and `world-*.png`. These values demonstrate a severe software-renderer limitation and motivated degradation/fallback; they are not final acceptance or target-hardware measurements.

Telemetry estimates active texture allocation from image dimensions/type/mipmaps. It is not measured total GPU memory and excludes driver overhead, render/shadow targets and unused cached resources. Demand mode reports FPS/frame time as `null`, not a fabricated continuous frame rate.

| Check | Current evidence/status |
| --- | --- |
| TypeScript | Passed via `npm run build`, October 3, 2026 |
| Biome lint | Passed: 29 files, no findings, October 3, 2026 |
| Production build and output size | Passed: CSS 28.88 kB; initial JS 377.98 kB; lazy 3D JS 1,037.35 kB (284.64 kB gzip). Vite reports its large-chunk advisory. |
| Updated 3D development browser suite | Pending final run |
| Production browser smoke | Pending final run |
| 1440 / 1280 / 1024 / 768 / 430 / 375 px | Pending final 3D captures and results |
| Keyboard menu, dialog, focus return and background scroll | Pending final browser evidence |
| Dynamic reduced motion and scroll/render cleanup | Pending final browser evidence |
| WebGL unavailable/context loss | Pending final browser evidence |
| Sustained poor-performance degradation/fallback | Implemented; final runtime evidence pending |
| Final draw calls, triangles, texture counts and estimates | Pending final profile samples |
| Final console/resource errors | Pending fresh capture after fixes |
| Real hardware FPS / physical mobile | Not measured |
| Blender / real GLB animation integration | Not performed; required assets unavailable |

The verification owner will replace pending entries with observed results, preserving any remaining limitations. The historical 2D screenshots and `verification.json` artifacts must not be presented as final 3D evidence.

## Exact local commands

```powershell
Set-Location E:\petshop\goodkind-ultra
npm ci
npm run dev
```

Open **http://127.0.0.1:5174/**, or **http://127.0.0.1:5174/?view=simple** for illustrated mode. Use `npm run build` followed by `npm run preview` for **http://127.0.0.1:4174/**. Node must satisfy Vite's **20.19+ or 22.12+** requirement.

## File inventory

This inventory describes the 3D rebuild relative to the existing local `goodkind-ultra` implementation, not a Git diff. Final verification-script/artifact additions are still being confirmed.

**Modified:**

- `package.json`, `package-lock.json`, `vite.config.ts`
- `src/App.tsx`, `src/styles/index.css`, `src/data/petAssets.ts`
- `README.md`, `ANIMATION_ARCHITECTURE.md`
- `scripts/verify.cjs`, `scripts/verify-production.cjs` now target the 3D experience; their full browser acceptance run remains incomplete.

**New application/configuration files:**

- `biome.json`
- `src/animation/scrollTimeline.ts`
- `src/components/WorldBoundary.tsx`
- `src/hooks/useDisplayProfile.ts`, `src/hooks/useAdaptiveQuality.ts`
- `src/sections/ExperienceUI.tsx`
- `src/three/Experience.tsx`, `src/three/CameraRig.tsx`, `src/three/Lighting.tsx`, `src/three/Environment.tsx`
- `src/three/World.tsx`, `src/three/SceneController.tsx`, `src/three/worldConfig.ts`, `src/three/types.ts`
- `src/three/models/Pet.tsx`, `src/three/models/modelRegistry.ts`
- `src/three/props/Architecture.tsx`, `src/three/props/ProductObjects.tsx`
- `src/three/effects/Atmosphere.tsx`, `src/three/effects/Particles.tsx`

**New documentation:**

- `3D_ASSET_REQUIREMENTS.md`, `BLENDER_PIPELINE.md`, `AUDIT_3D.md`, `FINAL_REPORT.md`

**Removed obsolete source:**

- `src/sections/Hero.tsx`, `Categories.tsx`, `FeaturedProducts.tsx`, `BrandStory.tsx`, `Benefits.tsx`, `FinalCTA.tsx`, `Footer.tsx`
- `src/components/Header.tsx`, `AnimatedText.tsx`, `CTAButton.tsx`, `PetAsset.tsx`, `ParallaxPet.tsx`, `ProductCard.tsx`
- `src/hooks/useSiteMotion.ts`, `src/data/siteContent.ts`

**Diagnostics already created:** `artifacts/probe-3d.cjs`, `artifacts/world-probe.json`, and `artifacts/world-0.png`, `world-24.png`, `world-50.png`, `world-74.png`, `world-100.png`. Final verification artifacts will be added to this list when available. `dist/` is generated build output; `node_modules/` is a local installation, not authored source.

**Original assets deleted:** No. All 20 PNG/WebP source/runtime files are retained, along with the favicon and original `ASSETS.md` provenance.

**Git publication:** A standalone Git repository was initialized in `E:\petshop\goodkind-ultra` for the user-requested push to `ixEmma/Petshop-3D-website-`. Only this 3D version belongs to its `main` branch. The parent 2D project is outside this repository. Local diagnostics, generated `dist`, installed dependencies, and npm caches are ignored. Live hosting has not been configured.

## Supporting documentation

- [README.md](./README.md): setup, architecture and runtime limits.
- [ANIMATION_ARCHITECTURE.md](./ANIMATION_ARCHITECTURE.md): camera, scroll, render and cleanup ownership.
- [3D_ASSET_REQUIREMENTS.md](./3D_ASSET_REQUIREMENTS.md): asset classification, conventions, budgets and replacement contract.
- [BLENDER_PIPELINE.md](./BLENDER_PIPELINE.md): remaining authoring/export workflow.
- [AUDIT_3D.md](./AUDIT_3D.md): earlier baseline and source audit; its dependency snapshot precedes the runtime pin.
