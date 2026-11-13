# 08 · UI Consistency and Quality

Covers how the established look of the application is kept, and the quality bar every generated or hand-built UI must meet.

## Reference pages set the standard

- The first pages built for an application (one to three) establish its **theme, layout and components**. These are the reference pages.
- Every page and component built afterwards MUST match them. Do not drift in colour, typography, spacing, layout structure or component choice.
- Before building any UI, look at the existing pages and components. Build on what is there.

## Consistency rules

- **Reuse before creating.** Use an existing component for the same job. Create a new one only when nothing existing fits, and then make it follow the same theme and conventions.
- **One way to do each thing.** The same job (a table, a form, a dialog, a confirmation, a page header, a primary action) looks and behaves the same on every page.
- **No new patterns without cause.** Do not introduce a new layout, navigation pattern, colour, font or spacing value on one page. If the reference needs to change, change it everywhere and update the shared component.
- Use theme tokens and the shared spacing scale. No one-off values (see [06](06-ui-states-and-layout.md) and [07](07-ui-library.md)).

## Quality bar

Generated UI MUST meet an industry-standard level of UI and UX. Sloppy, unfinished or non-standard UI is not acceptable, and is never to be generated and left for later.

**Placement and structure**
- Place elements where users expect them. Primary actions are prominent and consistently positioned. Secondary and destructive actions are visually distinct. Related items sit together, unrelated items are separated.
- Order content by importance and by the task flow. The most important information and action are the easiest to find.
- Use space efficiently and based on context. Put related short fields side by side where it helps, use full width where content needs it, and avoid large empty gaps or cramped clusters.

**Visual quality**
- Alignment, spacing and sizing are even and follow a consistent scale. Nothing overlaps, overflows or is cut off.
- Clear visual hierarchy: headings, labels, content and actions are distinguishable at a glance.
- Interactive elements show hover, focus, active, disabled and loading states.

**Behaviour and accessibility**
- Layouts work at all common screen sizes.
- Everything is usable by keyboard, has visible focus, and uses semantic elements with accessible labels. Text has sufficient contrast.
- Every input has a visible label. A placeholder is not a label.
- Required, loading, error, retry and empty states are handled as in [06](06-ui-states-and-layout.md).

**Correctness**
- No console errors or warnings, no broken layout, no placeholder or lorem-ipsum content, no leftover debug UI.

## For AI agents

Think through the layout and reasoning before generating, not after. For every UI you produce:

1. Look at the existing pages and components first, and name which you are matching and reusing.
2. Decide the placement of each element and why, based on the task and the available space.
3. Build it using existing components and theme tokens.
4. Review the result against the quality bar above. Where the app can be run, render it and look at it at desktop and narrow widths. Fix problems before reporting the work.
5. Report anything that could not be matched to the reference, and why, instead of silently diverging.

If a request would break consistency with the reference pages or fall below this bar, say so and ask before generating it.
