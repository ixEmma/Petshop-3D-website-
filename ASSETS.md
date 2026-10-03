# Goodkind Ultra assets

## Fresh pet portraits

Generated on 2026-10-02 with the built-in `image_gen` tool. Each animal used one independent generation request with `transparent_background: true`. No variants were generated. The four portraits share a commercial studio style, upper-left light, warm natural color, full-body framing, and a 2:3 aspect ratio.

Original RGBA PNGs are preserved in `assets/source/pets/`. All originals are **1024 × 1536**. Responsive runtime assets are in `public/pets/`: standard files are **800 × 1200**, and `-small.webp` files are **400 × 600**. Only proportional downscaling and WebP encoding were applied: no background extraction, repainting, cropping, compositing, or subject modification. WebP quality is 86 with lossless alpha. Alpha bytes are compared against the resized RGBA source after encoding. The tool returned source alpha values from 0 to 254; these are preserved rather than forced to opaque.

| Animal | Preserved original | Runtime files | Generator source filename |
| --- | --- | --- | --- |
| Golden Retriever | `assets/source/pets/dog-golden-retriever.png` | `public/pets/dog-golden-retriever.webp`, `public/pets/dog-golden-retriever-small.webp` | `exec-46cd7751-e426-40c7-8a74-c773873029b1.png` |
| Fluffy cat | `assets/source/pets/cat-fluffy.png` | `public/pets/cat-fluffy.webp`, `public/pets/cat-fluffy-small.webp` | `exec-ba204ac4-91e0-4d57-85b7-e2c07b6b553e.png` |
| White rabbit | `assets/source/pets/rabbit-white.png` | `public/pets/rabbit-white.webp`, `public/pets/rabbit-white-small.webp` | `exec-f99c8a05-92d8-4577-a600-094f09f9336e.png` |
| Colorful conure | `assets/source/pets/parrot-colorful.png` | `public/pets/parrot-colorful.webp`, `public/pets/parrot-colorful-small.webp` | `exec-74d11e2e-fef3-48a5-95b7-ffad8042f5e1.png` |

Original generator directory: `C:\Users\aning\.codex\generated_images\01a0fce2-59b7-7d62-b460-9cb468022935`. Project files are independent copies. Detailed dimensions, byte counts, and alpha checks are recorded in `assets/source/pets/asset-metadata.json`.

### Shared generation prompt

```text
Use case: ads-marketing
Asset type: transparent full-body animal cutout for a premium pet-shop landing page, one of a matching four-animal set.
Scene/backdrop: genuinely transparent background with alpha, absolutely no background scene.
Style/medium: premium semi-realistic photographic commercial studio animal portrait, believable anatomy, tender expressive eyes, exceptionally detailed natural fur or feathers, soft upper-left studio light, warm natural color, clean finely detailed cutout edges.
Composition/framing: vertical portrait 2:3 aspect, full body centered, eye-level camera, generous enough framing to preserve every ear, paw, foot, wing and tail tip but otherwise minimal margins; subject occupies most of image height.
Constraints: one animal only, no props, no floor or cast shadow, no text, no watermark, no collar or clothes. Preserve transparent empty pixels around the animal.
```

Each request appended exactly one of these subject lines:

```text
Subject: Dominant cute Golden Retriever puppy sitting frontally in a subtle three-quarter pose, looking at camera; adorable joyful expression with a tiny open mouth, fluffy warm golden cream fur, both front paws visible.
```

```text
Subject: Fluffy cream and pale ginger longhaired cat seated upright in a subtle three-quarter pose, looking at camera; calm gentle regal expression, full fluffy tail and paws visible.
```

```text
Subject: White rabbit seated in a three-quarter pose, alert yet gentle, looking toward camera; both long upright ears entirely visible, tiny pink nose, bright natural eyes, soft plush white fur, all visible feet intact.
```

```text
Subject: Small colorful green conure parrot standing in a slight three-quarter pose, looking toward camera; vivid natural green wings, peach and yellow chest, detailed feathers, both feet and entire long tail visible, cheerful inquisitive expression.
```

## Product imagery

Product images in `public/products/` and preserved source files in `assets/source/products/` are reused AI-generated assets from the parent `E:\petshop` project. They were copied for this standalone version rather than newly generated with the four pet portraits.
