import { AccountProfile } from '@/components/dashboard/account/AccountProfile';
import { ChangePasswordForm } from '@/components/dashboard/account/ChangePasswordForm';
import { SessionList } from '@/components/dashboard/account/SessionList';
import { PageHeading } from '@/components/shared/PageHeading';
import { ACCOUNT_COPY } from '@/constants/dashboard/account/accountConstants';

export const AccountView = () => (
  <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 *:shrink-0 md:p-6">
    <PageHeading title={ACCOUNT_COPY.TITLE} description={ACCOUNT_COPY.DESCRIPTION} />
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <AccountProfile />
        <ChangePasswordForm />
      </div>
      <SessionList />
    </div>
  </main>
);
