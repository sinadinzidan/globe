import { CircleUserRound, KeyRound, LogOut, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AUTH_COPY, ROLE_LABEL } from '@/constants/authConstants';
import { ROUTE_PATH } from '@/constants/routeConstants';
import { Permission } from '@/enums/permission';
import { RoutePath } from '@/enums/routePath';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { useSignOut } from '@/hooks/auth/useSignOut';

/** Who is signed in, and the way to their account, the administration pages and signing out. */
export const UserMenu = () => {
  const { user, hasPermission } = useCurrentUser();
  const signOut = useSignOut();

  const links = [
    {
      label: AUTH_COPY.ACCOUNT,
      path: ROUTE_PATH[RoutePath.ACCOUNT],
      icon: KeyRound,
      isShown: true,
    },
    {
      label: AUTH_COPY.USERS,
      path: ROUTE_PATH[RoutePath.USERS],
      icon: Users,
      isShown: hasPermission(Permission.USER_READ),
    },
    {
      label: AUTH_COPY.ROLES,
      path: ROUTE_PATH[RoutePath.ROLES],
      icon: ShieldCheck,
      isShown: hasPermission(Permission.ROLE_READ),
    },
  ].filter((link) => link.isShown);

  const handleSignOut = () => {
    signOut.mutate();
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={AUTH_COPY.USER_MENU_LABEL}>
          <CircleUserRound aria-hidden="true" />
          <span className="hidden max-w-40 truncate sm:inline">{user.fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate text-sm font-medium text-foreground">{user.fullName}</span>
          <span className="truncate text-xs font-normal">{user.email}</span>
          <span className="text-xs font-normal">{ROLE_LABEL[user.role]}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map(({ label, path, icon: Icon }) => (
          <DropdownMenuItem key={path} asChild>
            <Link to={path}>
              <Icon aria-hidden="true" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={signOut.isPending} onSelect={handleSignOut}>
          <LogOut aria-hidden="true" />
          {AUTH_COPY.SIGN_OUT}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
