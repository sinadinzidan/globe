import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProperties extends ComponentProps<typeof Button> {
  isSubmitting: boolean;
  submittingLabel: string;
}

/** The submit button of a form. While submitting it shows progress and cannot be pressed again. */
export const SubmitButton = ({
  isSubmitting,
  submittingLabel,
  children,
  ...buttonProperties
}: SubmitButtonProperties) => (
  <Button type="submit" disabled={isSubmitting} {...buttonProperties}>
    {isSubmitting && <LoaderCircle aria-hidden="true" className="animate-spin" />}
    {isSubmitting ? submittingLabel : children}
  </Button>
);
