# Globe

An animated dashboard of industrial plants in the United Arab Emirates, drawn on an outlined world
map. It opens on the whole world, flies to the UAE, and drops the plants in at their locations.

## The journey

The dashboard reads as a story that goes one level deeper at each step:

| Step     | Route                              | What it shows                                          |
| -------- | ---------------------------------- | ------------------------------------------------------ |
| 1. Map   | `/map`, `/globe`                   | The world, then the UAE and its plants                 |
| 2. Plant | `/plants/:plantId`                 | The plant in 3D, with its assets labelled on the model |
| 3. Asset | `/plants/:plantId/assets/:assetId` | One asset: its model, key figures and six tabs         |

Selecting a plant on the map and choosing **Enter plant** opens its 3D model. The camera descends
onto the plant; selecting an asset on the model or in the list moves in on it, and **Open asset**
leads to its page. The asset page has tabs for Overview, Performance, Maintenance, Inspections,
Documents and Connections. Connections link to the assets upstream and downstream, so the journey
can carry on from asset to asset. The trail in the header leads back up.

The plant models and all asset data are **illustrative samples**. Each plant is shown with one of
five representative layouts (`model` in `plants.json`), and every plant with the same layout shares
the same sample assets. Replace the files in `public/data/plant-layouts/` with real data to change
that.

There are two views of the same data:

| View     | Route    | Built with                                                        |
| -------- | -------- | ----------------------------------------------------------------- |
| Flat map | `/map`   | SVG, `d3-geo` (Natural Earth projection) and `d3-zoom`            |
| Globe    | `/globe` | WebGL, `three` through `@react-three/fiber`, loaded on first open |

Both are pannable and zoomable, share the sector filter, the plant list and the selected plant, and
are styled from the same theme tokens in `src/index.css` (`--map-*` for the map, `--chart-*` for the
sectors).

## Exploring

The dashboard is built as a game of discovery:

- **Discover plants.** Plants start as outlines. Opening one fills it in and earns experience.
- **Explore next** sends the map to the nearest undiscovered plant (shortcut: `N`; `Esc` steps back).
  The play button beside it runs a **guided tour** that moves from plant to plant by itself.
- **Ranks.** Experience raises the explorer from Scout to Director.
- **Achievements** are unlocked by completing a sector, reaching every emirate, opening the globe
  and discovering everything.

Progress is saved in the browser (`localStorage`) and can be reset from the Achievements tab.
Experience values, ranks and achievements are defined in
`src/constants/dashboard/explorerConstants.ts`; the rules are in
`src/lib/dashboard/explorerProgress.ts`.

## Running it

Requires Node 24 and npm 11.3 or newer (see `.nvmrc`).

```bash
npm install
npm run dev
```

| Script                   | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `npm run dev`            | Start the development server                  |
| `npm run build`          | Type-check and build for production           |
| `npm run lint`           | ESLint, enforcing `docs/standards/`           |
| `npm run typecheck`      | TypeScript                                    |
| `npm run format:check`   | Prettier                                      |
| `npm run build:map-data` | Regenerate the map outlines in `public/data/` |

## Data

Everything the dashboard shows is loaded from `public/data/`:

| File                     | Content                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `plants.json`            | The plants: name, operator, sector, emirate, longitude and latitude  |
| `world-countries.json`   | World country outlines (Natural Earth 1:50m, TopoJSON)               |
| `uae-region-detail.json` | The UAE and its neighbours at 1:10m, and the borders of the emirates |

To change what is on the map, edit `plants.json`. The plant locations in it are approximate
positions of well-known public sites, and are meant to be replaced with real asset data.

Sectors and emirates are enums (`src/enums/dashboard/`). Their labels, icons and colours are in
`src/constants/dashboard/plantConstants.ts`.

## Animating and styling the map

| To change                                   | Look in                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| Map and sector colours                      | `src/index.css`                                        |
| Intro delay                                 | `src/constants/dashboard/dashboardConstants.ts`        |
| Flat map zoom levels, flight duration       | `src/constants/dashboard/flat-map/flatMapConstants.ts` |
| Globe camera distances, damping, rotation   | `src/constants/dashboard/globe/globeConstants.ts`      |
| Marker size and stagger                     | `src/constants/dashboard/mapConstants.ts`              |
| Where the map looks (world, UAE, one plant) | `MapFocus` and `PlantDashboardProvider`                |

## Standards

This project follows the standards in [`docs/standards/`](docs/standards/README.md), copied from the
`project-standard` repository together with its lint and format configuration. Where this project
departs from them:

- **No generated API client (03).** There is no backend or OpenAPI document. The data is static JSON,
  loaded through React Query hooks written by hand in `src/api/` and `src/hooks/dashboard/`.
- **No route guards (09, 11).** The dashboard has no sign-in.
- **`src/components/ui/` is excluded from lint and Prettier.** The shadcn CLI writes those files
  (07) with names and code that the naming rules (02) reject, and they must not be edited by hand.
- **Dark theme only.**
