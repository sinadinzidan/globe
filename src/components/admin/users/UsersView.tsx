import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { ResetPasswordDialog } from '@/components/admin/users/ResetPasswordDialog';
import { UserFormDialog } from '@/components/admin/users/UserFormDialog';
import { UserTable } from '@/components/admin/users/UserTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeading } from '@/components/shared/PageHeading';
import { Button } from '@/components/ui/button';
import { ADMIN_COPY, FIRST_PAGE, USERS_PAGE_SIZE } from '@/constants/admin/adminConstants';
import { Permission } from '@/enums/permission';
import { useUsers } from '@/hooks/admin/useUserAdministration';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import type { User } from '@/types/authTypes';

export const UsersView = () => {
  const { hasPermission } = useCurrentUser();

  const [page, setPage] = useState(FIRST_PAGE);
  const [isCreating, setIsCreating] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [resetUser, setResetUser] = useState<User | null>(null);

  const { data: userPage, isPending, isError, refetch } = useUsers(page, USERS_PAGE_SIZE);

  const canManage = hasPermission(Permission.USER_MANAGE);
  const pageCount = userPage
    ? Math.max(Math.ceil(userPage.total / userPage.pageSize), FIRST_PAGE)
    : FIRST_PAGE;

  const handleRetry = () => {
    void refetch();
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditedUser(null);
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 *:shrink-0 md:p-6">
      <PageHeading
        title={ADMIN_COPY.USERS_TITLE}
        description={ADMIN_COPY.USERS_DESCRIPTION}
        action={
          canManage && (
            <Button
              onClick={() => {
                setIsCreating(true);
              }}
            >
              <UserPlus aria-hidden="true" />
              {ADMIN_COPY.ADD_USER}
            </Button>
          )
        }
      />
      {isPending && <LoadingState />}
      {!isPending && isError && <ErrorState onRetry={handleRetry} />}
      {userPage?.items.length === 0 && (
        <EmptyState
          title={ADMIN_COPY.NO_USERS_TITLE}
          description={ADMIN_COPY.NO_USERS_DESCRIPTION}
        />
      )}
      {userPage && userPage.items.length > 0 && (
        <>
          <UserTable
            users={userPage.items}
            canManage={canManage}
            onEdit={setEditedUser}
            onResetPassword={setResetUser}
          />
          <nav
            aria-label={ADMIN_COPY.USERS_TITLE}
            className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"
          >
            <span className="tabular-nums">
              {userPage.total} {ADMIN_COPY.USERS_UNIT} · {ADMIN_COPY.PAGE} {page} {ADMIN_COPY.OF}{' '}
              {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= FIRST_PAGE}
                onClick={() => {
                  setPage(page - 1);
                }}
              >
                {ADMIN_COPY.PREVIOUS_PAGE}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                {ADMIN_COPY.NEXT_PAGE}
              </Button>
            </div>
          </nav>
        </>
      )}
      {(isCreating || editedUser) && <UserFormDialog user={editedUser} onClose={handleCloseForm} />}
      {resetUser && (
        <ResetPasswordDialog
          user={resetUser}
          onClose={() => {
            setResetUser(null);
          }}
        />
      )}
    </main>
  );
};
