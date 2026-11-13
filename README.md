# Globe · ADNOC Asset Explorer

A gamified explorer of ADNOC group sites, centred on ADNOC Gas. It opens on the world, flies to the
UAE, and leads from the map into each plant in 3D and down to its assets, with access controlled
by role.

> **The content is illustrative.** The sites are real, publicly known ADNOC facilities, but their
> positions are approximate, and the 3D layouts, assets, readings, work orders, inspections and
> documents are generated samples, not ADNOC records. This project is not affiliated with or
> endorsed by ADNOC. Replace the files in `backend/seed-data/` with real data before relying on it.

## The portfolio

| Company        | Sites                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| ADNOC Gas      | Habshan complex, Habshan 5, Bab, Asab and Bu Hasa gas plants, Ruwais NGL fractionation, Das Island LNG |
| ADNOC Sour Gas | Shah gas plant                                                                                         |
| ADNOC Onshore  | Bu Hasa field, Jebel Dhanna terminal, Fujairah oil terminal                                            |
| ADNOC Offshore | Zirku Island, Upper Zakum                                                                              |
| ADNOC Refining | Ruwais refinery                                                                                        |
| Borouge        | Ruwais petrochemical complex                                                                           |
| Fertiglobe     | Ruwais fertilizer plant                                                                                |

Each plant is shown with one of five representative layouts. The three gas ones follow the gas
value chain:

- **Gas processing** (Habshan and the field gas plants): slug catcher, inlet separator, amine
  absorber, dehydration, gas chiller, demethaniser, residue gas compressor, sulphur recovery, NGL
  sphere and flare.
- **NGL fractionation** (Ruwais): feed sphere, deethaniser, depropaniser, debutaniser, ethane
  compressor, product spheres and a loading jetty.
- **LNG** (Das Island): gas treatment, main cryogenic heat exchanger, refrigerant compressors, LNG
  tanks, boil-off compressor, loading pump and jetty.

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
five representative layouts (`model` in `plants.json`), and every plant with the same layout starts
with the same sample assets. Work orders are real records: they can be raised and changed.

There are two views of the same data:

| View     | Route    | Built with                                                        |
| -------- | -------- | ----------------------------------------------------------------- |
| Flat map | `/map`   | SVG, `d3-geo` (Natural Earth projection) and `d3-zoom`            |
| Globe    | `/globe` | WebGL, `three` through `@react-three/fiber`, loaded on first open |

Both are pannable and zoomable, share the sector filter, the plant list and the selected plant, and
are styled from the same theme tokens in `src/index.css` (`--map-*` for the map, `--chart-*` for the
sectors).

## Exploring

The whole journey is a game of discovery, and progress is kept on the server for each user:

- **Discover plants.** Plants start as outlines on the map. Opening one fills it in.
- **Inspect assets.** Opening an asset's page inspects it. In a plant, **Inspect next** moves in on
  the next asset; on an asset page, **Next in the process** follows the flow downstream, from the
  slug catcher to the sales gas compressor.
- **Explore next** on the map goes to the nearest undiscovered plant (shortcut `N`), and the play
  button runs a guided tour.
- **Experience and ranks.** A plant earns 100 XP, an asset 25, an achievement 250, taking the
  explorer from Scout to Director.
- **Achievements** include _Follow the gas_ (visit each stage of the gas value chain), _Gas
  master_ (every gas plant), _Plant surveyed_ (every asset of one plant) and _One group_ (a plant
  of every company). Only plants a user can reach count, so everyone can complete their own set.
- **Explorer profile** (the chip in the header) shows rank, achievements and a leaderboard of
  names and experience.

The rules are in `backend/src/explorer/`: experience values, ranks and missions in
`constants/explorer.constant.ts`, the evaluation in `utilities/explorer-rules.utility.ts`. The
labels and icons shown for them are in `src/constants/dashboard/explorerConstants.ts`.

## Running it

Requires Node 24.11 or newer, npm 11.3 or newer, and PostgreSQL 16.

```bash
# 1. A database. Any PostgreSQL works; this starts one in Docker.
POSTGRES_PASSWORD=choose-one docker compose up -d

# 2. The API
cd backend
cp .env.example .env          # then fill in DATABASE_URL, JWT_SECRET and SEED_PASSWORD
npm install
npm run migration:run
npm run seed
npm run start:dev             # http://localhost:3000, docs at /api/docs

# 3. The web application, in another terminal
cd ..
npm install
npm run dev                   # http://localhost:5173
```

The web application reaches the API through the development server's `/api` proxy, so both are on
one origin and the session cookies are first-party. Serve them from one origin in production too.

Seeding creates one account per role, all with the password you set as `SEED_PASSWORD`:

| Email                                | Role                 | Plants                     |
| ------------------------------------ | -------------------- | -------------------------- |
| `administrator@globe.example`        | Administrator        | Every plant                |
| `plant.manager@globe.example`        | Plant manager        | The three Ruwais plants    |
| `reliability.engineer@globe.example` | Reliability engineer | Every plant                |
| `maintenance.planner@globe.example`  | Maintenance planner  | Ruwais Refinery, Habshan   |
| `inspector@globe.example`            | Inspector            | Das Island LNG, Ruwais NGL |
| `operator@globe.example`             | Operator             | Ruwais Refinery            |
| `viewer@globe.example`               | Viewer               | Barakah, Noor Abu Dhabi    |

| Script                   | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `npm run dev`            | Start the development server                               |
| `npm run build`          | Type-check and build for production                        |
| `npm run lint`           | ESLint, enforcing `docs/standards/`                        |
| `npm run typecheck`      | TypeScript                                                 |
| `npm run format:check`   | Prettier                                                   |
| `npm test`               | Unit tests of the request layer and redirect handling      |
| `npm run api:generate`   | Regenerate `src/api/generated` from `backend/openapi.json` |
| `npm run build:map-data` | Regenerate the map outlines in `public/data/`              |

The backend's scripts are listed in [`backend/README.md`](backend/README.md).

## Access control

Every user has one **role**. A role is a fixed set of **permissions**, defined in one place:
`backend/src/common/constants/role-permission.constant.ts`. Routes and services check permissions,
never role names. The Roles and permissions page in the application shows the same matrix.

| Role                 | Reaches         | Can do                                                                             |
| -------------------- | --------------- | ---------------------------------------------------------------------------------- |
| Administrator        | Every plant     | Everything, including managing users                                               |
| Plant manager        | Assigned plants | See everything about them, raise and change any work order, see users              |
| Reliability engineer | Every plant     | See performance, inspections and documents; raise work orders and change their own |
| Maintenance planner  | Assigned plants | See documents; raise and change any work order                                     |
| Inspector            | Assigned plants | See inspections and documents; raise work orders and change their own              |
| Operator             | Assigned plants | See performance; raise work orders and change their own                            |
| Viewer               | Assigned plants | See plants and assets, nothing more                                                |

On top of the role, access is checked per record:

- **Plants.** A role without "see every plant" only reaches the plants the user is assigned. A
  plant outside that scope is answered exactly like one that does not exist.
- **Work orders.** "Change their own" means only work orders the user raised.
- **Users.** Nobody can change their own role or deactivate their own account.
- **Sessions.** Users see and end only their own sessions.

The API enforces all of this. The web application only reflects it: it hides tabs, buttons and
pages a role does not include, and the API checks every request again.

### How signing in works

- Sign-in sets two cookies that scripts cannot read (`HttpOnly`, `Secure`, `SameSite=Strict`): a
  ten-minute signed access token for the API, and a refresh token sent only to `/api/auth`.
- The refresh token is random, stored only as a hash, and replaced on every use. Presenting an
  already-used one ends the whole session, since it means two parties hold it.
- Each request re-reads the session and the user, so signing out, deactivating a user or changing
  their role takes effect at once, not when the token expires.
- Passwords are hashed with Argon2id. Five wrong passwords lock an account for fifteen minutes.
  Sign-in answers an unknown email and a wrong password identically.
- State-changing requests need a custom header and must come from the application's own origin.
- The web application refreshes an expired session once, shares that refresh between simultaneous
  requests, signs out every tab together, and returns the user to the page they asked for.

### Not included

- **Password reset by email, email verification and multi-factor authentication.** There is no
  mail service. An administrator sets a user's password, which signs the user out everywhere.
- **Rate limiting across several servers.** Request counts are kept in memory, per server.
  Use a shared store such as Redis before running more than one instance.
- **Refusing to be embedded in a frame** has to be set as a response header where the built
  application is hosted. The Content Security Policy in the built page cannot express it.

## Data

The map outlines are static files in `public/data/`. Everything else comes from the API, which
keeps it in PostgreSQL. The sample content the database is seeded with is in `backend/seed-data/`:

| File                     | Content                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `plants.json`            | The plants: name, operator, sector, emirate, longitude and latitude  |
| `world-countries.json`   | World country outlines (Natural Earth 1:50m, TopoJSON)               |
| `uae-region-detail.json` | The UAE and its neighbours at 1:10m, and the borders of the emirates |

The plant locations are approximate positions of well-known public sites, and are meant to be
replaced with real asset data.

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
departs from them, or had to decide something they leave open:

- **Authentication uses NestJS's own packages, not Passport (11).** `@nestjs/authentication` and
  `@nestjs/authorization` are what the current NestJS documentation prescribes, and they provide the
  token model the standard asks for. Permissions are checked through their `@Can()` decorator and
  policy classes, which read the role and permission enums.
- **Security headers come from NestJS's built-in `useSecurityHeaders()`, not `helmet` (10).** It
  sets the same headers.
- **The backend has its own lint configuration (05, 10).** The standard ships one for the frontend
  only. `backend/eslint.config.js` is derived from it, with NestJS file naming, and without the
  boolean-prefix rule on object literals, because the option objects of NestJS, TypeORM and
  class-validator (`whitelist`, `nullable`, ...) are named by those libraries.
- **Generated and tool-written files are excluded from lint and Prettier:** `src/components/ui/`
  (shadcn CLI, 07), `src/api/generated/` (Orval, 03), `backend/src/migrations/` (TypeORM CLI, 10)
  and `orval.config.ts`, whose option names are set by the tool.
- **The map outlines are fetched by hand (03).** They are static files, not API data.
- **Asset specifications, readings, inspections and documents are JSON columns (10).** They are
  sample content whose shape varies by asset type.
- **Dark theme only.**
