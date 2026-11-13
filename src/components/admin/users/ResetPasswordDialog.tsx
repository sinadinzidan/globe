import { useId, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { FormField } from '@/components/shared/form/FormField';
import { FormMessage } from '@/components/shared/form/FormMessage';
import { SubmitButton } from '@/components/shared/form/SubmitButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ADMIN_COPY } from '@/constants/admin/adminConstants';
import { PASSWORD_MINIMUM_LENGTH } from '@/constants/authConstants';
import { useResetUserPassword } from '@/hooks/admin/useUserAdministration';
import type { User } from '@/types/authTypes';

interface ResetPasswordDialogProperties {
  user: User;
  onClose: () => void;
}

export const ResetPasswordDialog = ({ user, onClose }: ResetPasswordDialogProperties) => {
  const passwordId = useId();
  const resetPassword = useResetUserPassword();

  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isValid = password.length >= PASSWORD_MINIMUM_LENGTH;
  const passwordError = hasSubmitted && !isValid ? ADMIN_COPY.PASSWORD_TOO_SHORT : undefined;

  const handlePasswordChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setPassword(changeEvent.target.value);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = (submitEvent: SubmitEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setHasSubmitted(true);
    if (isValid) {
      resetPassword.mutate({ userId: user.id, data: { password } }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ADMIN_COPY.RESET_TITLE} · {user.fullName}
          </DialogTitle>
          <DialogDescription>{ADMIN_COPY.RESET_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            controlId={passwordId}
            label={ADMIN_COPY.NEW_PASSWORD_LABEL}
            hint={ADMIN_COPY.PASSWORD_HINT}
            error={passwordError}
          >
            <Input
              id={passwordId}
              type="password"
              autoComplete="new-password"
              value={password}
              aria-invalid={Boolean(passwordError)}
              onChange={handlePasswordChange}
            />
          </FormField>
          {resetPassword.isError && (
            <FormMessage message={resetPassword.error.message || ADMIN_COPY.RESET_FAILED} />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {ADMIN_COPY.CANCEL}
            </Button>
            <SubmitButton
              isSubmitting={resetPassword.isPending}
              submittingLabel={ADMIN_COPY.RESETTING}
            >
              {ADMIN_COPY.RESET_CONFIRM}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
