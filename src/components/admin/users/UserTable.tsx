import { KeyRound, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ROLE_LABEL } from '@/constants/authConstants';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { useRoles } from '@/hooks/admin/useUserAdministration';
import { Permission } from '@/enums/permission';
import type { User } from '@/types/authTypes';

interface UserTableProperties {
  users: User[];
  canManage: boolean;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export const UserTable = ({ users, canManage, onEdit, onResetPassword }: UserTableProperties) => {
  const { user: currentUser } = useCurrentUser();
  const { data: roles } = useRoles();

  const reachesEveryPlant = (user: User) =>
    Boolean(
      roles
        ?.find((definition) => definition.role === user.role)
        ?.permissions.includes(Permission.PLANT_READ_ALL),
    );

  const describePlants = (user: User) => {
    if (reachesEveryPlant(user)) {
      return ADMIN_COPY.ALL_PLANTS;
    }
    return user.plantIds.length > 0 ? String(user.plantIds.length) : ADMIN_COPY.NO_PLANTS;
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ADMIN_COPY.NAME_COLUMN}</TableHead>
              <TableHead>{ADMIN_COPY.ROLE_COLUMN}</TableHead>
              <TableHead>{ADMIN_COPY.PLANTS_COLUMN}</TableHead>
              <TableHead>{ADMIN_COPY.STATUS_COLUMN}</TableHead>
              {canManage && (
                <TableHead className="text-right">{ADMIN_COPY.ACTIONS_COLUMN}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 font-medium">
                      {user.fullName}
                      {user.id === currentUser?.id && (
                        <Badge variant="secondary">{ADMIN_COPY.YOU}</Badge>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>{ROLE_LABEL[user.role]}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {describePlants(user)}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'outline' : 'secondary'}>
                    {user.isActive ? ADMIN_COPY.ACTIVE : ADMIN_COPY.DEACTIVATED}
                  </Badge>
                </TableCell>
                {canManage && (
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onEdit(user);
                        }}
                      >
                        <Pencil aria-hidden="true" />
                        {ADMIN_COPY.EDIT_USER}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onResetPassword(user);
                        }}
                      >
                        <KeyRound aria-hidden="true" />
                        {ADMIN_COPY.RESET_PASSWORD}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
