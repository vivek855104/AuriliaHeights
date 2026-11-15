# Photo-to-3D building method (adapted from WorldClaw)

## Source

**WorldClaw: Agentic 3D Open-World Generation at Scale**, by Chunchao Guo, Jinpeng Li, Yang Li and Zilong Huang.
arXiv:2608.05248 (submitted 5 August 2026), https://arxiv.org/abs/2608.05248

Confidence note: this summary comes from the arXiv abstract and about the first 70% of the HTML full text. The
paper reports qualitative results only in what was read; no metrics or thresholds were verified. Re-read the
paper before citing it to a client.

## What the paper does (summary)

WorldClaw generates large explorable 3D worlds from a text prompt using cooperating agents:

1. **Structured plan.** Planning agents turn the prompt into a standard specification of regions,
   terrain, assets, materials and spatial relations (a plan tuple of regions, terrain requirements and object
   requirements).
2. **Global first, then local.** It builds coherent terrain from a semantic layout map and a region-aware
   height field, then adds detailed objects only to the regions that need them.
3. **Procedural and generative materials.** Large areas use tileable, parameter-adjustable procedural
   materials; detailed surfaces use generated textures.
4. **Placement and contact recovery.** Objects are reconstructed, scaled by an iterative bounding-box check, and
   placed by raycasting onto the terrain. Floating and penetration are corrected until enough of the object's
   base touches its support.
5. **Render-based refinement.** Agents re-render from fixed viewpoints, critique terrain, objects and contacts,
   and correct parameters until no major issue remains or an iteration budget runs out.

## How we applied it to a single building photo (Row House Study)

The paper targets text-to-world; we kept the parts that transfer to photo-to-building:

| Paper idea | Our implementation |
|---|---|
| Structured plan | One `SPEC` object holds every dimension, opening, colour, unit type and camera. Nothing is hard-coded elsewhere. |
| Global, then local | `buildRowHouse(stage)`: a massing stage (slabs, bodies, stair heads) then facade detail (pilasters, bays, corner block, rear, interiors). A **Massing** button shows the coarse stage. |
| Procedural materials | Canvas textures driven by the palette: plaster, jali panels, slatted gates, grilles, planks, tiles, a facade module. |
| Contact recovery | `grounded(name, supportY, fn)` captures a composite object, snaps its lowest point onto the support and logs the gap it corrected (`console.table`, plus a badge in the UI). |
| Render-and-critique loop | A **Photo view** camera matched to the photo (same aspect and field of view), and a **Compare** slider that fades the photo over the render. Each pass: render at photo size, compare side by side and zoomed, fix `SPEC`, repeat. |

## Step-by-step for a new building

1. Put the reference photo next to `index.html`. Note its aspect ratio.
2. Read the photo: count units and bays, storeys, the rhythm of pilasters, window types, balconies, roof
   elements, corner treatment and the ground floor (stilts, gates). Write all of it into `SPEC`.
3. Build the massing only. Match the camera: tune `SPEC.reference.camera` (position, target, fov) until the
   massing silhouette sits on the photo at 50% overlay.
4. Add facade detail bay by bay, using functions per element type (window, railing, pilaster with panel,
   gable parapet, curved balcony stack).
5. Ground all free objects (cars, trees, lamps) with `grounded()`.
6. Run the critique loop: screenshot at the photo's resolution, compare side by side and zoomed on the problem
   area (the corner was the hardest part), correct `SPEC`, re-render. Stop when the structure matches.
7. Add the rear, a Dollhouse interior (one hollow unit, clipped and capped) and a day/night slider as in
   `SKILL.md`.

## Limits to tell the client

- A single photo gives proportions, not measurements. Ask for drawings, dimensions or more photos for an
  exact match.
- Trees, wires and distant city are simplified on purpose (performance).
