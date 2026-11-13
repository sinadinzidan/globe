import { CircleAlert, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormMessageProperties {
  message: string;
  isSuccess?: boolean;
}

/** The outcome of submitting a form, shown above its buttons. */
export const FormMessage = ({ message, isSuccess = false }: FormMessageProperties) => {
  const Icon = isSuccess ? CircleCheck : CircleAlert;

  return (
    <p
      role={isSuccess ? 'status' : 'alert'}
      className={cn(
        'flex items-start gap-2 rounded-lg border p-3 text-sm',
        isSuccess
          ? 'border-status-good/40 text-status-good'
          : 'border-destructive/40 text-destructive',
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
};
