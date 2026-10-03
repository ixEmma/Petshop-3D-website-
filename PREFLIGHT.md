# Repository preflight

Inspected before implementation on 2026-10-02. The user requested a separate subfolder, so this version lives in `E:\petshop\goodkind-ultra`.

The parent `E:\petshop` already contained a complete React/Vite project. Its locked-stack-compatible baseline used npm and `package-lock.json`, React/React DOM 19.3.0, Vite 8.3.2, TypeScript 7.0.2, Tailwind CSS and its Vite plugin 4.3.3, GSAP 3.15.0, and Lenis 1.3.26. React's Vite plugin was 6.1.1; React type packages were 19.3.0. No migration was necessary.

The existing folder had `src/components`, `src/sections`, `src/data`, `src/hooks`, `src/lib`, and `src/styles`, with independent pets/products under `public` and original PNGs under `assets/source`. Styling used warm cream, charcoal, coral, and green tokens with system fonts. Existing motion used scoped GSAP/ScrollTrigger effects and a GSAP-ticker-driven Lenis instance. These conventions were reviewed; the new page has its own composition and source files.

Existing scripts were `dev`, `build`, `typecheck`, `preview`, and a Playwright browser `verify` script. No linter or unit-test framework was configured. All locked-stack dependencies were already available in the parent installation; the new project declares its own dependencies and lockfile for standalone installation.

`git status --short` returned `fatal: not a git repository (or any of the parent directories): .git`. Git clean/dirty status therefore does not apply. No Git repository was initialized.

The four product images are copied from the parent's generated asset set. Four new pet images are generated for this version, each stored independently. Original project file hashes are recorded in the local `artifacts/original-project-baseline.json` for the final preservation check.
