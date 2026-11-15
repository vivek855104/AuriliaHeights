---
name: threejs-property-showcase
description: Build a premium, smooth, single-page Three.js real-estate showcase (site, buildings, walk-through flats, Dollhouse floor plans, day/night, multilingual UI) or rebuild a specific building from a reference photo. Use when starting or extending a 3D property visualisation for a developer or client, when matching a building to a photo, or when adding Dollhouse views, night lighting, loading screens or Hindi/Marathi UI. Distilled from the Aurelia Heights and Row House Study projects.
---

# Three.js property showcase

Proven patterns from two projects: **Aurelia Heights** (two-tower site with walk-through sample flats) and the
**Row House Study** (a row-house terrace rebuilt from one photo). Follow the rules in order of priority.

## 1. Non-negotiable rules

1. **Smoothness first.** Motion and frame rate outrank visual richness, on phones above all. Before adding any
   effect (particles, CSS filters, post passes, extra lights, big textures), measure its frame cost on a
   phone-sized viewport and pick the lighter option. Report the before/after numbers.
2. **No CSS `filter`/`blur` on an animating full-screen canvas.** It crashed Chrome's GPU process on an
   integrated Intel laptop and got WebGL blocked for the site.
3. **Never rasterise heavy 2D canvas work on the GPU during load.** Hundreds of GPU-drawn canvas frames at load
   starved the 3D scene of its WebGL context. Use `getContext('2d',{willReadFrequently:true})` (software) or a
   worker with OffscreenCanvas.
4. **Loading screens animate only `transform` and `opacity`.** The compositor keeps those smooth while the main
   thread is busy building the scene. No per-frame JS, no animated colours, no particle backgrounds.
5. **Work on a branch; keep `main` deployable.** Preserve a known-good version as a branch (`version-1.0`)
   before big changes. Merge only after the owner has seen it.
6. **Verify in a real browser before claiming done.** Headless Chrome with `--use-angle=swiftshader` for
   screenshots; `--use-angle=d3d11` to test on the real GPU. Check the console is clean. Compare against the
   reference image side by side.
7. **No pricing UI** unless the client asks. Placeholder data is labelled as such.

## 2. Architecture

- **One `index.html`** with an import map (`three@0.170.0` from jsDelivr), plus small plain scripts loaded on
  demand. No build step, no asset pipeline; deploys to GitHub Pages as-is.
- **Heavy optional parts load lazily with a plain `<script>` tag**, not dynamic `import()`: module imports are
  blocked when `index.html` is opened from disk (`file://`). The file registers `window.X = {build...}`.
- **Pass shared things in through an API object** (THREE, materials `M`, helpers, environment) so lazy files
  never duplicate them.
- **Procedural materials** from canvas textures (plaster, wood, tiles, brick, panels) keep the page tiny.
  Photo textures (Poly Haven, 1K, CC0) are optional, desktop-only, and must fall back to procedural ones on
  phones, offline and on `file://` (Chrome refuses file:// images as WebGL textures).
- **Batch static geometry**: bake each piece's transform into its geometry and `mergeGeometries` per material.
  A whole flat or building becomes a few dozen draw calls. Use `InstancedMesh` for repeats.
- **A single plan object (`SPEC`) is the source of truth** for every dimension, colour and option.

## 3. Rendering defaults that worked

- `WebGLRenderer({antialias:true})`, pixel ratio `min(dpr, 2)` (1.5 on phones), ACES tone mapping outdoors,
  AgX indoors, `PCFSoftShadowMap`, one directional sun with a tight shadow camera.
- Environment from `PMREMGenerator.fromScene(RoomEnvironment)` or a generated sky; `environmentIntensity`
  0.3–0.8. A HemisphereLight for fill.
- Composer: RenderPass, light UnrealBloom (lit windows at night), OutputPass, a cheap film/vignette pass.
  The composer needs its own MSAA target (`samples:4`, or 2 on high-DPI screens), because the canvas
  `antialias` flag doesn't reach it.
- **Skip SSAO** (owner decision; too costly on integrated GPUs and phones).
- Glass: `MeshPhysicalMaterial`, metalness 0, ior 1.5, low roughness, opaque (no transmission). Use a
  `polygonOffset` bias for panes near walls, and frames built as rings around the opening, never plates
  behind the glass (that z-fights).
- `sheen`/`clearcoat` only on `MeshPhysicalMaterial`, never on `MeshStandardMaterial` (console warning).

## 4. Views that clients loved

**Signature exterior shot** (the owner's favourite, Aurelia Heights Pool Deck):
- Camera about 40–48 m from a ~45 m subject, 25–35° elevation, a three-quarter view from the garden-side corner.
- Frame the subject in the left two-thirds, beside a right-hand info panel; crop a neighbour at the frame edge.
- Near-night lighting: warm 2700K window glow, cyan underwater pool light, path lamps, long soft shadows, a navy
  sky with stars, exposure ~1.5. Palette: cream facades and teak against saturated green and turquoise.

**Dollhouse view** (a roof-off 3D floor plan), the default start when a flat opens:
- Cut every wall at ~2.3–2.35 m with a horizontal clipping plane. To isolate one unit, add two vertical planes,
  applied per material (`material.clippingPlanes`, `clipShadows:true`, `renderer.localClippingEnabled=true`)
  so the studio floor isn't clipped.
- Put solid **cap** boxes on every wall the cut passes through (shown only in this view), or walls read hollow.
- Hide the outside world; show a warm vignette backdrop and a shadow catcher (`ShadowMaterial`) under the model.
- Use a high key light from the far corner, opposite the camera, so shadows fall toward the viewer. At night,
  drop the room lamps below the cut and boost them.
- Orbit limits: distance 10–34 m, polar 0.3–1.2. Leaving the view restores every light and visibility exactly.
- Make sure no feature wall or panel crosses a doorway.

**First-person rooms**: a wide lens (68–80°) from room corners. Enlarge the architecture (about ×1.18 in plan,
3.1 m ceilings), anchor furniture to its wall, and never stretch furniture.

## 5. Lighting for night

- Drive everything from one time-of-day value `k` (0 day, 1 night): sun to moon colour/position/intensity,
  hemisphere, sky gradient, fog, exposure, stars, emissive strengths.
- Prefer **emissive** fixtures (lit windows on ~55% of panes, lamp globes, LED strips) to real lights.
  Add only a few real lights (point and spot, no shadows), always present, with intensity scaled by `k`.
  Toggling `visible` recompiles shaders and causes a hitch.
- Add golden accents (brass sconces, pendants, lanterns) and warm the room lights toward gold as `k` rises.
- Brighten existing lamps instead of adding fixtures when the owner asks for "more light".

## 6. UI

- Dark gold-black glass panels, Fraunces (serif) with Inter, hairline gold borders. A hero band, KPI tiles,
  chips, numbered section headers and card lists, so each kind of information looks different.
- Floating building tags: a gold diamond pin, a hairline leader and a slim plate; they shrink on phones, avoid
  overlapping, and stay below the top bar.
- Loading screen: a centred wordmark, a breathing gold diamond, one thin progress line and a quiet stage
  caption, ending with "Welcome · स्वागत है · स्वागत आहे". The same screen is used for entering a flat.
- Languages: EN / हिं / मरा switch; strings in `i18n.js` keyed by the English text (missing keys fall back to
  English); Noto Sans/Serif Devanagari; no letter-spacing on Devanagari. Brand names are not translated.
  Have native speakers review translations before client use.

## 7. Rebuilding a building from a photo

Follow `references/photo-to-3d-method.md` (adapted from the WorldClaw paper): plan, then coarse massing, then
facade detail, then grounding checks, then a render-and-compare loop against the photo with a matched camera
and an overlay slider. Expect a structural match, not an exact one, unless the client supplies dimensions or
more photos.

## 8. Troubleshooting

- **"This needs WebGL" / slow on one laptop**: check `chrome://gpu`. If it shows "Software only" with
  `--use-gl=disabled`, close Chrome and delete `User Data\GrShaderCache`, `GraphiteDawnCache`, `ShaderCache`
  and `Default\GPUCache`. Also check "Use graphics acceleration" plus Relaunch. If a site was blocked after a
  context loss, run `chrome://restart`.
- **A 2 BHK click does nothing**: a dynamic import was blocked on `file://`; use the script-tag loader.
- **Diagonal streaks on windows**: z-fighting; use ring frames and a polygon offset.
- **Downloads fail on a corporate network with curl error 35**: use `curl --ssl-no-revoke`.
- **Local testing**: run `python -m http.server 8000` in the project folder (needed for photo textures).

## 9. Before handing anything to a client

Treat output as a draft. A second qualified reviewer checks it. Confirm placeholder data is labelled,
translations are reviewed, asset licences are recorded (`assets/CREDITS.md`; ThreeUI components are paid and
need a licence check), and no client-sensitive data is in the repo.
