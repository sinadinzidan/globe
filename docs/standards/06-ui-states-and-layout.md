# 06 · UI States, Forms and Layout

Covers loading, error, retry and empty states, form consistency, and page layout. Applies to every component and page that is built, by a person or an AI agent.

## Required states

Any component or page that loads or shows data MUST handle all of the following from the start. They are part of building the component, not a later addition.

| State | When | Requirement |
|-------|------|-------------|
| **Loading** | Data is being fetched | Show the shared loading state. Never show a blank area or stale content as if it were ready. |
| **Error** | The request failed | Show the shared error state with a clear message. Never fail silently. |
| **Retry** | The failure can be repeated | The error state MUST offer a retry that re-runs the failed request (the `refetch` of RTK Query or React Query). |
| **Empty** | The request succeeded and there is nothing to show | Show the shared empty state. Never render an empty table, list or blank area. |

- Handle the states in this order: loading, then error, then empty, then the data.
- Actions that can fail (submitting a form, a mutation) MUST show their failure and allow trying again. Do not discard what the user entered.
- Anything that needs a retry MUST have one. When unsure, add it.

## Uniform states

- Loading, error, retry and empty states MUST come from **one shared implementation each**. Do not build a custom version inside a page or component.
- They look and behave the same everywhere: same layout, spacing, wording style, icons and button.
- They MUST use the project theme (colours, typography, spacing). No hard-coded colours, font sizes or pixel values. Use theme tokens.
- State messages are named constants, not inline strings (see [02](02-react-coding.md)).
- If a state needs to look different, change the shared component for everyone. Do not fork it.

## Forms

- All forms MUST look and behave the same: the same field layout, spacing, label position, input sizing, validation message style and button placement.
- Use the shared form components. Do not style a field one-off.
- Forms MUST NOT be cut off or clipped at any screen size. No content may be hidden by fixed widths or heights, or by `overflow: hidden`, and fields must wrap or stack on narrow screens.
- Show validation errors next to the field they belong to, in the shared error style.
- Show a loading state on the submit action while submitting, and prevent duplicate submits.

## Page layout

- Pages MUST NOT have a `max-width`. Page content uses the full available width.
- Do not wrap pages or page sections in a width-capped container.
- Content MUST fit without horizontal scrolling at any screen width.
- Spacing, alignment and sizing follow the theme, so pages look even and consistent.

## For AI agents

When you create any component or page, before reporting it done, check each of these:

1. Loading state present.
2. Error state present, with retry where the action can be repeated.
3. Empty state present.
4. All of the above use the shared components and the theme.
5. Forms use the shared form components and are not cut off.
6. No `max-width` on the page.

If a shared component for a state does not exist yet, create it once as the shared version. Do not write a local one.
