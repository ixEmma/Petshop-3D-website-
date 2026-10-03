# Blender pipeline for Goodkind

No Blender executable or `.blend` source was found during this rebuild's preflight. No Blender export, rig validation, or real animal-model animation has therefore been completed. This document is the delivery workflow for future authored assets; the current pet portraits remain flat image assets.

## Deliverables and working files

Keep editable `.blend` projects and texture masters outside `public`, for example under `assets/source/models/`. Only validated, optimized runtime GLBs belong in `public/models/pets/`. Use the basenames and budgets in [3D_ASSET_REQUIREMENTS.md](./3D_ASSET_REQUIREMENTS.md). Preserve all existing PNG/WebP artwork as fallback and reference.

Each delivery should include the `.blend`, one uncompressed self-contained GLB, optional separately validated LOD GLBs, and a short manifest stating Blender/exporter version, dimensions in meters, file bytes, triangles, material count, texture resolutions, bone count, clip names/durations, author/license information, and validator result. Record real measurements; do not copy the maximum budgets into the measured fields.

## Prepare the model

1. Set Scene Units to Metric with unit scale 1.0. Model at the physical dimensions agreed for the animal. Use a known one-meter guide while authoring; remove it from the export selection.
2. In Blender's native coordinates, keep Z up and face the animal toward **-Y**. The standard glTF **+Y Up** conversion maps that pose to runtime Y-up and +Z forward. Confirm the result in a glTF viewer; do not add an extra -90° application rotation merely to compensate for an unverified export.
3. Put the neutral-pose contact plane at Blender Z=0. Center the root horizontally below the body, with feet grounded. A tail crossing below the floor must be reposed or supported by a separately authored perch.
4. Apply rotation and scale on meshes **before rigging**. Establish an identity export root. For an existing rig, use a duplicate export collection and verify bind pose after any transform change; blindly applying transforms to a finished skinned rig can break animation.
5. Retopologize and create LODs deliberately. Evaluate exported triangle counts, not the modeling viewport's quad count. Check normals, seams, silhouette, and deformations around ears, paws, face, tail, and folded wings.
6. UV unwrap and bake normal/material detail. Keep material count low. Strand hair, geometry nodes, curves, and procedural offline effects need an explicit web-compatible geometry/texture result; they do not become efficient real-time fur automatically.

The official [glTF coordinate specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.pdf) defines the runtime axes. Project pivots and dimensions are the additional Goodkind delivery contract.

## Build exportable materials

Use a simple Principled BSDF graph for metallic-roughness output. Wire base-color images directly to Base Color; use tangent-space normal images through a Normal Map node. Mark normal, roughness, metallic, and occlusion textures as non-color data. Keep base color in sRGB. Bake procedural graphs and inspect the exported result under the application's light setup; a Blender viewport match is not sufficient.

The first accepted version should avoid transmission, glass, layered transparent fur shells, emissive tricks, material animation extensions, and custom shader dependencies. Eyes can use a small roughness change rather than an expensive refractive layer. Preserve alpha only where needed. Verify channel packing if ORM is used. Supported material conversion is described in the [Blender glTF manual](https://docs.blender.org/manual/id/5.0/addons/import_export/scene_gltf2.html).

## Rig and animation

Use one deform rig per animal and at most four influences per vertex. Export the meshes and their armature together. Name actions exactly `Idle`, `Breathe`, `Look`, and the applicable species-specific clips in the asset requirements. Use explicit action ranges with clean loop boundaries and no unwanted rest frames.

Keep root translation and rotation fixed for in-place clips. Stage motion belongs to GSAP/scene choreography. Bake constraint-driven motion to deform-bone transforms on an export copy when needed. Inspect the exported clip list: exporter versions differ in action/NLA controls, so do not assume that merely naming an action exports it as the intended clip. Ensure clips begin at zero and do not accidentally combine unrelated actions.

Only `Idle`, with `Breathe` as an alternative, is in the initial pet-adapter contract. Extra actions are useful future deliverables but need deliberate runtime mapping. A parrot should settle its wings rather than loop frantic flapping; a rabbit uses `Hop`, not a dog-style `Walk`.

## Export settings

Use **File → Export → glTF 2.0**, then check the options in the installed Blender version. The relevant exporter concepts are documented in the [official glTF export reference](https://docs.blender.org/manual/id/3.6/addons/import_export/scene_gltf2.html); labels can differ in newer versions.

| Setting | Project requirement |
| --- | --- |
| Format | glTF Binary `.glb`; self-contained textures and buffers |
| Include | Selected export root, meshes, and armature only; exclude references, cameras, lights, staging props, and helpers |
| Transform | `+Y Up` enabled; one meter units; no hidden parent scale or compensating runtime rotation |
| Mesh attributes | Export normals and UVs; include tangents when the baked normal workflow requires them |
| Modifiers | Evaluate intended mesh modifiers on the export copy; verify skinning/shape keys are retained and avoid applying the armature deformation twice |
| Materials | Export recognized PBR material inputs and required images; no external absolute file paths |
| Skinning | Include the armature and weights; four influences maximum; omit non-deforming controls when they are unnecessary |
| Animation | Export intended actions as separate named clips; bake constraints where necessary; include exact clip ranges and starting time zero |
| Cameras / lights | Disabled; the application owns the camera and lighting |
| Compression | Off for the first validated delivery; enable only after the application decoder path is configured and tested |
| Custom properties | Export only useful asset metadata, not machine-local paths or unrelated production data |

Save these export settings with the source project where the installed exporter supports it. Reopen the exported GLB in a clean scene or viewer rather than judging only the source `.blend`.

## Compression comes after a working baseline

Draco compresses mesh data; Meshopt can compress geometry/animation buffers; KTX2 targets GPU texture delivery. They are different integrations. No decoder is considered ready because a library happens to support it. Configure local decoder/transcoder files, verify network paths, exercise the mobile build, and compare decode cost and total transfer size before making a compressed asset the default. Three.js describes the required [GLTFLoader decoder configuration](https://threejs.org/docs/pages/GLTFLoader.html).

Do not export KTX2 into a GLB and assume the ordinary image-texture path will load it. Do not silently depend on a remote CDN for decoder WASM in a local/offline experiment. Keep the first uncompressed verified GLB available for diagnosis.

## Application handoff

1. Validate the GLB and record its actual metadata. Put the file at its expected `public/models/pets/` path.
2. Inspect the existing `src/three/models/modelRegistry.ts` entry. Leave `url: null` until the file is present and tested. Set that animal's URL; preserve its registry ID and fallback artwork.
3. Compare the registry `targetHeight` with the exported dimensions. The loader may normalize height and ground/center the model for staging; that convenience does not repair an incorrect rig, animation bounds, or facing direction.
4. Confirm that each use has an independent cloned skeleton. The application should share immutable source geometry/textures appropriately while giving each animated instance its own mixer/action state.
5. Confirm idle selection, pause behavior, animation cleanup, and bounding boxes during the clip. Then review the full camera path at all quality profiles.
6. Test missing/corrupt URL behavior before accepting the integration. The HTML content and preserved portrait presentation must still work if a model cannot load.
7. Record new measured renderer counts, transfer size, estimated texture allocation, browser/device details, and frame timings. A desktop screenshot or successful build is not a mobile frame-rate test.

## Visual acceptance

Review hero front and three-quarter views, orbit transitions, product-world occlusion, the story's softer lighting, and the final grouping. Confirm paws meet the platform, ears/tails stay in frame, eyes face the intended camera target, and the silhouette survives lower LODs. Check that the new pet responds to scene lighting without painted-in highlights contradicting the key light.

Keep UI text and keyboard targets clear. Inspect 1440, 1280, 1024, 768, 430, and 375 px; reduced motion; still/fallback presentation; failed WebGL/model loading; and context loss. Final approval is based on the exported asset inside this application, not its appearance in Blender alone.
