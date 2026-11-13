import { useId, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { FormField } from '@/components/shared/form/FormField';
import { FormMessage } from '@/components/shared/form/FormMessage';
import { SubmitButton } from '@/components/shared/form/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PASSWORD_MINIMUM_LENGTH } from '@/constants/authConstants';
import { ACCOUNT_COPY } from '@/constants/dashboard/account/accountConstants';
import { useChangePassword } from '@/hooks/auth/useAccount';

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmation: '' };

export const ChangePasswordForm = () => {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmationId = useId();
  const changePassword = useChangePassword();

  const [form, setForm] = useState(EMPTY_FORM);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const errors = {
    currentPassword:
      form.currentPassword === '' ? ACCOUNT_COPY.CURRENT_PASSWORD_REQUIRED : undefined,
    newPassword:
      form.newPassword.length < PASSWORD_MINIMUM_LENGTH
        ? ACCOUNT_COPY.NEW_PASSWORD_TOO_SHORT
        : undefined,
    confirmation:
      form.confirmation === form.newPassword ? undefined : ACCOUNT_COPY.PASSWORDS_DIFFER,
  };
  const isValid = Object.values(errors).every((error) => error === undefined);
  const shownErrors: Partial<typeof errors> = hasSubmitted ? errors : {};

  const handleChange =
    (field: keyof typeof EMPTY_FORM) => (changeEvent: ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({ ...previous, [field]: changeEvent.target.value }));
    };

  const handleSubmit = (submitEvent: SubmitEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setHasSubmitted(true);
    if (!isValid) {
      return;
    }
    changePassword.mutate(
      { data: { currentPassword: form.currentPassword, newPassword: form.newPassword } },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          setHasSubmitted(false);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3>{ACCOUNT_COPY.PASSWORD_TITLE}</h3>
        </CardTitle>
        <CardDescription>{ACCOUNT_COPY.PASSWORD_DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            controlId={currentPasswordId}
            label={ACCOUNT_COPY.CURRENT_PASSWORD_LABEL}
            error={shownErrors.currentPassword}
          >
            <Input
              id={currentPasswordId}
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              aria-invalid={Boolean(shownErrors.currentPassword)}
              onChange={handleChange('currentPassword')}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              controlId={newPasswordId}
              label={ACCOUNT_COPY.NEW_PASSWORD_LABEL}
              hint={ACCOUNT_COPY.NEW_PASSWORD_HINT}
              error={shownErrors.newPassword}
            >
              <Input
                id={newPasswordId}
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                aria-invalid={Boolean(shownErrors.newPassword)}
                onChange={handleChange('newPassword')}
              />
            </FormField>
            <FormField
              controlId={confirmationId}
              label={ACCOUNT_COPY.CONFIRM_PASSWORD_LABEL}
              error={shownErrors.confirmation}
            >
              <Input
                id={confirmationId}
                type="password"
                autoComplete="new-password"
                value={form.confirmation}
                aria-invalid={Boolean(shownErrors.confirmation)}
                onChange={handleChange('confirmation')}
              />
            </FormField>
          </div>
          {changePassword.isError && <FormMessage message={changePassword.error.message} />}
          {changePassword.isSuccess && (
            <FormMessage isSuccess message={ACCOUNT_COPY.PASSWORD_CHANGED} />
          )}
          <SubmitButton
            isSubmitting={changePassword.isPending}
            submittingLabel={ACCOUNT_COPY.CHANGING_PASSWORD}
            className="self-start"
          >
            {ACCOUNT_COPY.CHANGE_PASSWORD}
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};
