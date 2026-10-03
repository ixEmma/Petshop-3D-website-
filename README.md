# GOODKIND — A little world. A lot of good.

A local, scroll-driven pet boutique built around a real-time 3D gallery. Architecture, plinths, lighting, products, camera perspective, and atmospheric effects live in Three.js. Accessible HTML supplies the navigation, story, product information, and dialogs.

**The animals are transparent image billboards, not volumetric or rigged 3D models.** A replacement adapter and asset specification are supplied for future GLBs. The current product objects are procedural 3D proxies. There is no commerce backend or deployment.

## Run locally

Use Node **20.19+ or 22.12+**. The supplied environment uses Node 24.12.0. This folder has its own installed dependencies and lockfile.

```powershell
git clone https://github.com/ixEmma/Petshop-3D-website-.git
cd Petshop-3D-website-
npm ci
npm run dev
```

Open **http://127.0.0.1:5174/**. The fixed port uses `strictPort`. Open **http://127.0.0.1:5174/?view=simple** to start with the illustrated HTML experience.

The original local 3D project is in `E:\petshop\goodkind-ultra`. This repository contains that second-prompt version at its root. The separate 2D project in `E:\petshop` is not included.

```powershell
npm run build
npm run preview
```

The production preview is **http://127.0.0.1:4174/**.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server, port 5174 |
| `npm run typecheck` | Strict TypeScript validation |
| `npm run lint` | Biome source/configuration checks |
| `npm run build` | TypeScript check and production bundle |
| `npm run preview` | Serve the production bundle, port 4174 |
| `npm run verify` | Browser verification script |
| `npm run verify:production` | Production browser verification script |

Browser scripts use externally supplied Playwright/Chromium tooling, not a site dependency. They accept `PLAYWRIGHT_PATH`, `CHROMIUM_PATH`, and `TEST_URL`; inspect the scripts for defaults. The old 2D screenshots and results in `artifacts/` are historical evidence, not acceptance evidence for this rebuild. Final 3D verification is being recorded in [FINAL_REPORT.md](./FINAL_REPORT.md).

## The experience

Five HTML chapters guide a continuous camera journey: arrival, companions, the collection, the Goodkind story, and an elevated closing view of the gallery. A warm plaster environment, forest accents, clay, muted brass, and system typography preserve the original brand direction.

Thick arches, a long floor, walls, fluted plinths, and instanced botanicals give the camera foreground and background depth. Four procedural product forms—a pouch, rope toy, bottle, and bowl—respond to pointer interaction and open the same native product dialog as the HTML controls. Product copy and prices remain illustrative.

The fixed Canvas is decorative to assistive technology. Semantic content stays in the document, with a skip link, keyboard navigation, visible focus, native dialogs, Escape, focus return, and a simpler-view control. WebGL failure, context loss, and sustained poor performance can select the illustrated experience. No account, cart, payment, or purchasing flow is implemented.

## Source organization

```text
src/
  App.tsx                       feature detection, view mode, lazy Canvas, dialogs
  animation/scrollTimeline.ts   normalized scroll progress and HTML chapter state
  components/                   shared icons/dialog and WebGL error boundary
  data/                         retained pet and product metadata
  hooks/                        viewport/reduced motion and adaptive render quality
  lib/                          GSAP registration and the single Lenis lifecycle
  sections/ExperienceUI.tsx     semantic content and illustrated fallback
  three/
    Experience.tsx              Canvas, renderer profile and loading coordination
    CameraRig.tsx               single camera owner
    worldConfig.ts              camera keyframes and quality budgets
    World.tsx                   gallery layout and pet placement
    Lighting.tsx                key, fill, hemisphere and story lighting
    Environment.tsx             local reflection environment
    SceneController.tsx         invalidation, context loss and measured telemetry
    models/                     honest billboard fallback and future GLB adapter
    props/                      architectural geometry and procedural products
    effects/                    fabric shader, dust and atmosphere
  styles/                       Tailwind entry, brand styles and responsive HTML
public/
  pets/                         transparent 800×1200 / 400×600 WebP portraits
  products/                     four optimized product images
assets/source/                  preserved raster originals and generation metadata
scripts/                        local browser verification
artifacts/                      local diagnostics/screenshots; not application assets
```

The 3D module is lazy-loaded. No GLB, external HDR, decoder download, or postprocessing package is required by the current scene. Expected future model paths are declared in `src/three/models/modelRegistry.ts`; their URLs deliberately remain `null`, so absent models do not produce invented or broken model requests.

## Stack

| Package | Pinned version |
| --- | --- |
| React / React DOM | 19.3.0 |
| Vite / React Vite plugin | 8.3.2 / 6.1.1 |
| TypeScript | 7.0.2 |
| Tailwind CSS / Vite plugin | 4.3.3 |
| Three.js | 0.182.0 |
| React Three Fiber | 9.8.1 |
| Drei | 10.7.9 |
| GSAP / ScrollTrigger | 3.15.0 |
| Lenis | 1.3.26 |
| Biome | 2.5.15 |

The runtime was pinned back from Three.js 0.186.1 while addressing the upstream R3F `THREE.Clock` deprecation warning. The manifest and lockfile are the source of truth for the final resolved package set.

## Motion and performance

One scoped GSAP/ScrollTrigger timeline writes a mutable progress value. One Lenis instance uses the GSAP ticker; it does not create another RAF loop. R3F owns rendering. No per-frame React state updates drive camera or object transforms.

| Viewport profile | DPR cap | Shadows | Dust points | Geometry |
| --- | ---: | --- | ---: | --- |
| Desktop, over 1050 px | 1.5 | 1024 px map | 110 | Highest configured detail |
| Tablet, 701–1050 px | 1.25 | 512 px map | 55 | Reduced detail |
| Mobile, 700 px or below | 1 | Off | 24 | Lowest configured detail |

The camera retains viewport-appropriate composition when adaptive quality lowers GPU work. After a six-second settling window per profile, three consecutive slow samples lower the render profile; below 24 FPS on desktop/tablet advances one level, and below 12 FPS at the mobile level selects the illustrated view. Hidden tabs, open dialogs, and reduced motion do not count toward this decision. The view control permits a fresh attempt.

Repeated plinth flutes and plant parts use instancing. Shadow maps update on scene progression rather than every idle frame. Texture sizes, environment resolution, radial segments, and particles are profile-dependent. The texture-memory value in development telemetry is an estimate from active texture dimensions and types; it excludes driver overhead, shadow/render targets, and unused loader-cache entries.

Reduced motion switches R3F to demand rendering, disables Lenis and autonomous/pointer movement, and selects discrete camera chapter poses. Scroll and product focus explicitly invalidate the Canvas. HTML and native scrolling remain usable.

**No 60 FPS claim is made.** An earlier software-rendered browser probe measured approximately 0–1 FPS, which prompted adaptive degradation and the illustrated fallback. Final browser acceptance, current renderer counts, console status, and hardware measurements remain pending in [FINAL_REPORT.md](./FINAL_REPORT.md); that earlier probe is not a final benchmark.

## Assets and further work

All **20 original PNG/WebP files** remain. Four independently generated pets are reused as sRGB textures on camera-facing planes, and the same artwork remains useful for loading and fallback HTML. Existing product WebPs serve the illustrated collection and dialogs. Full-size pet WebPs total about 805 KB; small variants total about 216 KB. Preserved source PNGs are outside `public`.

- [ASSETS.md](./ASSETS.md): original generation provenance, prompts and raster dimensions; preserved.
- [3D_ASSET_REQUIREMENTS.md](./3D_ASSET_REQUIREMENTS.md): classification, missing GLBs, conventions and future budgets.
- [BLENDER_PIPELINE.md](./BLENDER_PIPELINE.md): reproducible modeling, rigging, material, export and validation work.
- [ANIMATION_ARCHITECTURE.md](./ANIMATION_ARCHITECTURE.md): camera, scroll, render ownership and cleanup.
- [AUDIT_3D.md](./AUDIT_3D.md): rebuild baseline and source review.
- [FINAL_REPORT.md](./FINAL_REPORT.md): delivery status, verification, limits and file inventory.
- [PREFLIGHT.md](./PREFLIGHT.md): historical baseline of the earlier 2D implementation.

Blender and final GLB assets were not available. A real pet model integration and target-device performance pass are the most valuable next steps. Native Safari/Firefox and physical mobile testing also remain necessary before production acceptance.

TypeScript, Biome lint, and the production build passed on October 3, 2026. Browser and physical-device acceptance remain separately documented in the delivery report. This repository publishes the 3D source and assets; a live hosting deployment has not been configured.
