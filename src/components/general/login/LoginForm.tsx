import { Earth } from 'lucide-react';
import { useId, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { FormField } from '@/components/shared/form/FormField';
import { FormMessage } from '@/components/shared/form/FormMessage';
import { SubmitButton } from '@/components/shared/form/SubmitButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AUTH_COPY, HTTP_STATUS } from '@/constants/authConstants';
import { DASHBOARD_COPY } from '@/constants/dashboard/dashboardConstants';
import { useSignIn } from '@/hooks/auth/useSignIn';

const toFailureMessage = (status: number | undefined) => {
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return AUTH_COPY.INVALID_CREDENTIALS;
  }
  return status === HTTP_STATUS.TOO_MANY_REQUESTS
    ? AUTH_COPY.TOO_MANY_ATTEMPTS
    : AUTH_COPY.SIGN_IN_FAILED;
};

export const LoginForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const signIn = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const emailError = hasSubmitted && email.trim() === '' ? AUTH_COPY.EMAIL_REQUIRED : undefined;
  const passwordError = hasSubmitted && password === '' ? AUTH_COPY.PASSWORD_REQUIRED : undefined;

  const handleEmailChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setEmail(changeEvent.target.value);
  };

  const handlePasswordChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setPassword(changeEvent.target.value);
  };

  const handleSubmit = (submitEvent: SubmitEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setHasSubmitted(true);
    if (email.trim() !== '' && password !== '') {
      signIn.mutate({ data: { email: email.trim(), password } });
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Earth aria-hidden="true" className="size-5" />
        </span>
        <p className="text-lg font-semibold">{DASHBOARD_COPY.TITLE}</p>
      </div>
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>
            <h1>{AUTH_COPY.LOGIN_TITLE}</h1>
          </CardTitle>
          <CardDescription>{AUTH_COPY.LOGIN_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField controlId={emailId} label={AUTH_COPY.EMAIL_LABEL} error={emailError}>
              <Input
                id={emailId}
                type="email"
                autoComplete="username"
                value={email}
                aria-invalid={Boolean(emailError)}
                onChange={handleEmailChange}
              />
            </FormField>
            <FormField
              controlId={passwordId}
              label={AUTH_COPY.PASSWORD_LABEL}
              error={passwordError}
            >
              <Input
                id={passwordId}
                type="password"
                autoComplete="current-password"
                value={password}
                aria-invalid={Boolean(passwordError)}
                onChange={handlePasswordChange}
              />
            </FormField>
            {signIn.isError && <FormMessage message={toFailureMessage(signIn.error.status)} />}
            <SubmitButton isSubmitting={signIn.isPending} submittingLabel={AUTH_COPY.SIGNING_IN}>
              {AUTH_COPY.SIGN_IN}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
