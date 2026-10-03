# 3D asset requirements

## Current asset reality

The rebuild starts with **zero supplied GLB, GLTF, or Blender files**. The four generated pets are transparent raster portraits. A portrait mapped onto a plane is a billboard, not a volumetric animal, rig, or reconstructed model. Their silhouettes cannot provide new side/back views, physically correct self-shadowing, or skeletal animation.

The scene can render real geometry, camera perspective, depth, lights, material response, occlusion, and procedural product proxies while retaining those honest limitations. Final animal modeling, retopology, UVs, rigging, and animation remain future asset work. No raster asset is obsolete merely because the renderer changed. See [ASSETS.md](./ASSETS.md) for preserved generation provenance.

## Existing asset classification

Classes can overlap: **A** direct reuse, **B** texture input, **C** billboard/sprite, **D** visual reference, **E** obsolete.

| Existing group | Classification | Appropriate reuse and limitation |
| --- | --- | --- |
| `public/favicon.svg` | A | Browser/UI identity; no scene geometry implied. |
| `public/products/*.webp` | A, B, D | HTML product details/fallback and spatial texture planes; references for volumetric packaging. Existing photographs include lighting and perspective, so they are not ready-made UV atlases or clean flat labels. |
| `public/pets/*.webp`, including `-small` variants | A, B, C, D | Loading/fallback HTML, alpha textures on upright 2:3 planes, distant cutouts, and modeling references. No animal volume, skeleton, depth map, or multi-view reconstruction is present. |
| `assets/source/pets/*.png` | D; source for A/B/C | Preserve original portraits outside the runtime public directory. Downsample from these for future raster derivatives. |
| `assets/source/products/*.png` | D; source for A/B | Preserve original product art for packaging/layout references and optimized derivatives. |
| Previous verification screenshots in `artifacts/` | D | Historical layout evidence, not runtime scene textures. |
| Existing raster artwork classified E | None | No original image is scheduled for deletion. |

The dog, cat, rabbit, and parrot each have a 1024×1536 RGBA original, an 800×1200 WebP, and a 400×600 WebP. Standard pet WebPs total 805,134 bytes; small versions total 216,324 bytes. Four product WebPs total 137,070 bytes. File size is transfer/storage size, not GPU texture memory.

| Product | Preserved PNG dimensions | Runtime WebP dimensions |
| --- | --- | --- |
| Daily goodness | 1145×1374 | 600×720 |
| The good tug | 1536×1024 | 600×400 |
| Fresh start | 1024×1536 | 600×900 |
| The everyday bowl | 1536×1024 | 600×400 |

## Required future animal deliveries

Deliver one self-contained GLB per animal, with a documented neutral pose and no embedded set, pedestal, camera, or light. These are **requested assets, not files currently shipped**.

| Animal / registry ID | Expected URL | Canonical neutral-pose dimensions in meters (W×H×D) | Required visual traits |
| --- | --- | --- | --- |
| `dog` | `/models/pets/dog-golden-retriever.glb` | Approximately 0.38×0.60×0.50 | Golden Retriever puppy, seated, soft cream/golden fur, friendly expression; all sides modeled. |
| `cat` | `/models/pets/cat-fluffy.glb` | Approximately 0.32×0.48×0.42 | Seated fluffy cream/ginger cat; tail has actual geometry and a coherent back view. |
| `rabbit` | `/models/pets/rabbit-white.glb` | Approximately 0.22×0.38×0.32 | White rabbit with complete upright ears and grounded feet; ear silhouette stays intact in LODs. |
| `parrot` | `/models/pets/parrot-colorful.glb` | Approximately 0.18×0.42×0.26, including tail | Green conure, peach/yellow chest, folded wings; head about 0.30 m above feet, full tail above the floor in the delivered standing pose. |

These are art-direction targets, not species measurements. A long tail must not extend below the declared contact plane. Supply a perch separately if the chosen pose needs one. Camera composition uses a configurable display `targetHeight`; an enlarged stage presentation must not be mistaken for the source model's physical scale.

## Coordinate and loading contract

- One world unit is one meter. The delivered GLB is right-handed, **Y-up**, facing **+Z**. This matches the [glTF coordinate convention](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.pdf).
- Place the root origin on the floor/contact plane, centered horizontally under the animal. Root translation and rotation are zero; root scale is `[1, 1, 1]`. All feet/contact points sit at Y=0 in the neutral pose. Do not use a face/hip origin.
- Use a single root such as `Dog_Root`, with `Dog_Rig` and meaningful mesh names beneath it. Names must be unique within each asset. Materials use names such as `Dog_Fur`, `Dog_Eyes`, `Dog_Nose`.
- Keep rig and meshes inside the exported hierarchy. Apply scale before rigging; do not repair export scale by leaving a giant rotated/scaled parent above the model.
- The implementation contract is `src/three/models/modelRegistry.ts`: a nullable URL selects billboard versus GLB, alongside an expected URL and display height. Null means intentional fallback and must not trigger a missing-file request.
- The agreed GLB adapter clones the loaded scene with `SkeletonUtils`, fits it to configured height, centers X/Z, and grounds its bounding box. This protects scene composition but does **not** fix reversed facing, broken bind poses, bad texture color spaces, or inaccurate animation bounds.
- Registry display-height defaults are dog 3.25 m, cat 2.35 m, rabbit 1.45 m, and parrot 1.65 m. These are deliberately enlarged boutique displays. `World.tsx` can override height for an individual tableau; inspect that call site as well as the registry when changing the staging size.
- Supply LOD files only when they are validated: `dog-golden-retriever-tablet.glb` and `dog-golden-retriever-mobile.glb`, with the same naming pattern for other pets. Filename suffixes do not enable automatic switching; register/select each URL in the quality-profile integration before claiming LOD support.

`src/three/models/Pet.tsx` implements the adapter and `modelRegistry.ts` remains the integration authority. All four URLs are currently null. Do not add a model merely by making its expected path return a file; enable its registry URL after the acceptance checks below. A rejected model load currently reaches the world error boundary and the usable HTML/portrait view; per-model error recovery is not claimed.

## Animation delivery

Use these exact case-sensitive clip names. One action exports as one named clip, with no accidental concatenated timeline. Each clip begins at time zero. Deliver in-place motion; scroll choreography owns global stage travel.

| Clip | Animals | Contract |
| --- | --- | --- |
| `Idle` | All | Required, calm 4–8 s seamless loop; low-amplitude body/ear/feather movement. |
| `Breathe` | Dog, cat, rabbit; optional parrot | Optional 4–6 s restrained loop. Alternative fallback to `Idle`, not an additive layer unless expressly authored and integrated as one. |
| `Look` | All | Optional 1–2 s head/eye turn and return; no sudden whole-body movement. |
| `Walk` | Dog, cat | Optional 1–2 s in-place loop; no root translation; feet should avoid obvious sliding. |
| `TailWag` | Dog | Optional 2–4 s gentle motion, not an always-running exuberant loop. |
| `Hop` | Rabbit | Optional short in-place anticipation/hop/settle; horizontal placement stays with scene control. |
| `WingSettle` | Parrot | Optional subtle folded-wing adjustment; no perpetual flapping or unrequested flight. |

The initial adapter is specified to choose `Idle`, otherwise `Breathe`; other supplied clips require explicit interaction/timeline mapping. Their presence in a GLB is not proof they run. A static GLB without clips remains valid visually but is not an animated pet. Reduced-motion mode must hold a calm pose and pause mixers. Crossfades, if later added, should be short and interruptible. Rig budget: at most 60/40/24 deform bones per desktop/tablet/mobile pet and at most four skin influences per vertex.

## Materials and texture contract

Use a metallic-roughness PBR material that maps to Three.js `MeshStandardMaterial`. Prefer one atlas plus a small shared eyes/nose material. Fur and feathers should read through silhouette, painted variation, and baked normal detail; do not export strand hair systems, offline subsurface shaders, or many stacked transparent shells.

- Base color: sRGB; no baked studio backdrop or painted cast shadow. Alpha only where genuinely necessary.
- Normal: tangent-space, non-color/linear data. Roughness, metallic, and occlusion are data maps, not sRGB. If packed ORM is supplied, use R=occlusion, G=roughness, B=metallic.
- Pets are dielectric: metallic 0; start roughness around 0.65–0.95 for coat and 0.15–0.35 for small eye/nose surfaces. These are project art targets, not measured material properties.
- Prefer opaque surfaces. Use alpha masking for a limited number of feather/fur cards; avoid widespread alpha blending, double-sided faces, transmission, refraction, and emissive fur.
- Bake Blender procedural texture graphs to standard image maps. Arbitrary Blender node graphs/custom shaders are not the web material contract. The exporter supports recognized [Principled BSDF/glTF material paths](https://docs.blender.org/manual/id/5.0/addons/import_export/scene_gltf2.html).
- First delivery uses embedded PNG/JPEG textures in an uncompressed GLB. Draco, Meshopt, and KTX2 are later opt-in optimizations. Compressed formats require the corresponding configured decoders/transcoder in [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html); a smaller file alone is not evidence of runtime compatibility.

## Future model budgets

These are **acceptance ceilings for future assets**, not measured scene statistics. Count exported triangles, including duplicated material/UV boundaries; do not quote Blender quad counts. All LODs preserve the same floor pivot, facing, overall bounds, root names, and clips.

| Per animal | Desktop | Tablet | Mobile |
| --- | ---: | ---: | ---: |
| Dog / cat triangles | 35,000 each | 18,000 each | 8,000 each |
| Rabbit triangles | 18,000 | 10,000 | 5,000 |
| Parrot triangles | 16,000 | 8,000 | 4,000 |
| Material slots / typical base draw calls | ≤3 | ≤2 | ≤1 |
| Largest texture edge | 2048 px | 1024 px | 512 px |
| Delivered GLB transfer size, including textures | ≤3 MB | ≤1.5 MB | ≤0.7 MB |
| Concurrent detailed pets | Up to 4, subject to whole-scene budget | Up to 3 | 1–2; other pets may remain billboards |

One uncompressed RGBA8 2048² texture is approximately 16 MiB without mipmaps or 21.3 MiB with a full mip chain. Three such maps are roughly 64 MiB for one pet; JPG/WebP network compression does not remove that GPU cost. Reuse maps/materials, lower resolution, and avoid loading every unused LOD. Account separately for shadow maps, render targets, and environment textures.

Initial whole-scene review targets after models arrive: desktop ≤180k visible triangles / 150 draw calls, tablet ≤100k / 100, mobile ≤45k / 65. These are project ceilings to test, not universal performance promises. Shadow passes add submissions. The renderer's observed counts and real device frame timings decide whether a profile needs lower detail.

## Optional future product GLBs

Current spatial packaging/rope/bowl geometry is procedural proxy work. A product photograph on a plane remains a texture. Final product models may use `/models/products/daily-goodness.glb`, `good-tug.glb`, `fresh-start.glb`, and `everyday-bowl.glb` after a dedicated product registry integration. Use the same axes/pivot contract; target ≤8k/4k/2k triangles, ≤2 materials, and ≤1024/512/512 px maps for desktop/tablet/mobile. Do not imply that these optional GLBs are already supported by the pet loader.

## Acceptance before enabling a URL

1. Validate the binary with the Khronos glTF Validator; retain the report and resolve errors. Inspect warnings deliberately.
2. Confirm meters, +Y up, +Z facing, centered contact pivot, positive scales, correct normals, complete bounds, and no surprise camera/light/environment objects.
3. Inspect actual GLB clips, skinning, bind pose, materials, external URLs, triangles, primitive/material counts, texture sizes, and file bytes. A `.glb` extension alone establishes none of these.
4. Test one animal at a time with the actual application adapter. Confirm seated pose, floor contact, height normalization, lighting, shadows, camera approach, and all supported clips.
5. Confirm malformed/missing-model fallback, loading state, context loss, reduced-motion transitions, and repeated mount/unmount. Avoid disposing shared cached textures/geometry while another clone uses them.
6. Re-run the six viewport checks and browser console checks. Record measured renderer counts separately from these target budgets.

Authoring and export steps are in [BLENDER_PIPELINE.md](./BLENDER_PIPELINE.md). Existing assets and their original files remain preserved until replacements have been inspected.
