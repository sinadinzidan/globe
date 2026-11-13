import type { ReactNode } from 'react';

interface PageHeadingProperties {
  title: string;
  description: string;
  /** The page's primary action, shown at the end of the heading. */
  action?: ReactNode;
}

/** The heading every plain content page opens with. */
export const PageHeading = ({ title, description, action }: PageHeadingProperties) => (
  <header className="flex flex-wrap items-start justify-between gap-4">
    <div className="flex min-w-0 flex-col gap-1">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {action}
  </header>
);
