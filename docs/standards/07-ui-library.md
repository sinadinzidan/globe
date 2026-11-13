# 07 · UI Library: shadcn/ui

Covers how the shadcn/ui library is installed, and how Tailwind CSS is added when it is required.

## Library

- The UI library is **shadcn/ui**.
- Use its components for UI. Do not add a second UI library.

## Installing shadcn/ui

1. **Read the docs first.** Before installing anything, read the current shadcn/ui installation guide for Vite: <https://ui.shadcn.com/docs/installation/vite>. Follow the steps it gives now, not steps remembered from earlier.
2. **Use the latest shadcn CLI.** Run it as `npx shadcn@latest …`. Do not use an older pinned version, and do not use the deprecated `shadcn-ui` package.
3. **Install with the CLI only.** Initialise the library and add every component with the CLI (`init`, `add`). Do not copy component code by hand, paste it from another project, or write the files yourself.
4. **Read the docs before adding a component too.** Check the component's page in the docs, then add it with the CLI.

Versions verified on 2026-11-09: `shadcn` CLI 4.23.x (Node `>=20.18.1`, satisfied by our Node 24 minimum in [01](01-frontend.md)).

## Tailwind CSS

shadcn/ui depends on Tailwind CSS. When the project does not have it yet:

1. **Read the Tailwind docs first.** Follow the current guide for installing Tailwind with Vite: <https://tailwindcss.com/docs/installation/using-vite>.
2. **Add it to Vite as the docs describe.** Use the Tailwind Vite plugin (`@tailwindcss/vite`) in `vite.config.ts`, as the guide states. Do not set it up through PostCSS or other legacy routes unless the docs say to.
3. **Do it before initialising shadcn/ui,** so the CLI finds a working Tailwind setup.

Versions verified on 2026-11-09: `tailwindcss` and `@tailwindcss/vite` 4.3.x. `@tailwindcss/vite` supports Vite 5 to 8, which includes our Vite major (see [01](01-frontend.md)).

Re-check these versions and both guides whenever the shadcn CLI, Tailwind or Vite changes major version.

## Theme

shadcn/ui and Tailwind provide the project theme. Colours, typography and spacing come from theme tokens, as required in [06](06-ui-states-and-layout.md).

## For AI agents

- Read the shadcn/ui and Tailwind docs before installing, every time. Do not rely on memory.
- Use `npx shadcn@latest` and the CLI for every install and every component. Never write shadcn component files by hand.
- If Tailwind is missing, add it by the Tailwind Vite guide first, then run the shadcn CLI.
- If the docs and this standard disagree, say so and ask before proceeding.
