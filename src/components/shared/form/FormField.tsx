import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProperties {
  /** The `id` of the control inside, so the label and the messages are tied to it. */
  controlId: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** One field of a form: label above, control, then a hint or the field's error. */
export const FormField = ({ controlId, label, hint, error, children }: FormFieldProperties) => (
  <div className="flex min-w-0 flex-col gap-2">
    <Label htmlFor={controlId}>{label}</Label>
    {children}
    {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    {error && (
      <p role="alert" className="text-xs text-destructive">
        {error}
      </p>
    )}
  </div>
);
