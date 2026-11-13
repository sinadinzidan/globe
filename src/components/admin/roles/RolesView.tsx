import { Check, Minus } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { PageHeading } from '@/components/shared/PageHeading';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_COPY } from '@/constants/admin/adminConstants';
import {
  PERMISSION_LABEL,
  PERMISSION_ORDER,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
} from '@/constants/authConstants';
import { useRoles } from '@/hooks/admin/useUserAdministration';

/** The access matrix: every permission against every role, as the API defines them. */
export const RolesView = () => {
  const { data: roles, isPending, isError, refetch } = useRoles();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 *:shrink-0 md:p-6">
      <PageHeading title={ADMIN_COPY.ROLES_TITLE} description={ADMIN_COPY.ROLES_DESCRIPTION} />
      {isPending && <LoadingState />}
      {!isPending && isError && <ErrorState onRetry={handleRetry} />}
      {roles?.length === 0 && <EmptyState />}
      {roles && roles.length > 0 && (
        <>
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{ADMIN_COPY.PERMISSION_COLUMN}</TableHead>
                    {roles.map((definition) => (
                      <TableHead key={definition.role} className="text-center">
                        {ROLE_LABEL[definition.role]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSION_ORDER.map((permission) => (
                    <TableRow key={permission}>
                      <TableCell className="font-medium">{PERMISSION_LABEL[permission]}</TableCell>
                      {roles.map((definition) => {
                        const isAllowed = definition.permissions.includes(permission);
                        const Icon = isAllowed ? Check : Minus;
                        return (
                          <TableCell key={definition.role} className="text-center">
                            <Icon
                              role="img"
                              aria-label={isAllowed ? ADMIN_COPY.ALLOWED : ADMIN_COPY.NOT_ALLOWED}
                              className={
                                isAllowed
                                  ? 'inline size-4 text-status-good'
                                  : 'inline size-4 text-muted-foreground/50'
                              }
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {roles.map((definition) => (
              <div
                key={definition.role}
                className="flex flex-col gap-1 rounded-xl border bg-card/40 p-4"
              >
                <dt className="text-sm font-medium">{ROLE_LABEL[definition.role]}</dt>
                <dd className="text-sm text-muted-foreground">
                  {ROLE_DESCRIPTION[definition.role]}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </main>
  );
};
