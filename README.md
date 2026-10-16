# Aurelia Heights Residences

An interactive 3D tour of an apartment project, built with Three.js. You get a drone view of the site, two residential
towers (18 and 15 floors), a clubhouse, a pool deck and a central garden. You can walk into sample flats, and a
time-of-day slider takes the scene from day to night. Everything is generated in code, so there are no model or image files.

Open `index.html`, drag to orbit, pick a tower, then step into a sample flat. Each flat is placed at its real floor,
so the view from its window and balcony matches the height. The **View** chip looks over the rail at the garden below.

Useful URL switches: `?nointro` skips the opening fly-in, `?dev` exposes `window.__dbg` for scripting the camera.

## Editing the project

The **data** block near the top of the script holds everything a sales team would change:

- `PROJECT`: name, subtitle and tagline
- `TYPES`: flat types (2 BHK, 3 BHK, penthouse) with price, carpet area, description and in-home amenities
- `SPECS`: the specification list shown for every flat
- `BUILDINGS`: towers (floors, position, colours, sample flats) and the amenity areas

All names, prices and specifications are placeholders.

Built from the `main` branch of the Azure Bay resort tour (`vivek855104/Cacti`).
