import { useId, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { PlantAccessField } from '@/components/admin/users/PlantAccessField';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ADMIN_COPY, EMAIL_PATTERN } from '@/constants/admin/adminConstants';
import {
  HTTP_STATUS,
  PASSWORD_MINIMUM_LENGTH,
  ROLE_LABEL,
  ROLE_ORDER,
} from '@/constants/authConstants';
import { Permission } from '@/enums/permission';
import { Role } from '@/enums/role';
import { useCreateUser, useRoles, useUpdateUser } from '@/hooks/admin/useUserAdministration';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { findEnumValue } from '@/lib/enumValue';
import type { User } from '@/types/authTypes';

interface UserFormDialogProperties {
  /** The user to edit, or `null` to add a new one. */
  user: User | null;
  onClose: () => void;
}

export const UserFormDialog = ({ user, onClose }: UserFormDialogProperties) => {
  const fullNameId = useId();
  const emailId = useId();
  const roleId = useId();
  const passwordId = useId();
  const activeId = useId();
  const { user: currentUser } = useCurrentUser();
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState(user?.role ?? Role.VIEWER);
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [plantIds, setPlantIds] = useState(user?.plantIds ?? []);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isEditing = user !== null;
  const isOwnAccount = isEditing && user.id === currentUser?.id;
  const hasAllPlantAccess = Boolean(
    roles
      ?.find((definition) => definition.role === role)
      ?.permissions.includes(Permission.PLANT_READ_ALL),
  );
  const mutation = isEditing ? updateUser : createUser;
  const errors = {
    fullName: fullName.trim() === '' ? ADMIN_COPY.FULL_NAME_REQUIRED : undefined,
    email: isEditing || EMAIL_PATTERN.test(email.trim()) ? undefined : ADMIN_COPY.EMAIL_INVALID,
    password:
      isEditing || password.length >= PASSWORD_MINIMUM_LENGTH
        ? undefined
        : ADMIN_COPY.PASSWORD_TOO_SHORT,
  };
  const isValid = Object.values(errors).every((error) => error === undefined);
  const shownErrors: Partial<typeof errors> = hasSubmitted ? errors : {};
  const failureMessage =
    mutation.error?.status === HTTP_STATUS.CONFLICT
      ? ADMIN_COPY.EMAIL_TAKEN
      : (mutation.error?.message ?? ADMIN_COPY.SAVE_FAILED);

  const handleFullNameChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setFullName(changeEvent.target.value);
  };

  const handleEmailChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setEmail(changeEvent.target.value);
  };

  const handlePasswordChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setPassword(changeEvent.target.value);
  };

  const handleRoleChange = (value: string) => {
    setRole(findEnumValue(ROLE_ORDER, value) ?? Role.VIEWER);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = (submitEvent: SubmitEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setHasSubmitted(true);
    if (!isValid) {
      return;
    }
    if (isEditing) {
      // Your own role and status are left out: the API refuses changes to them.
      const access = isOwnAccount ? {} : { role, isActive };
      updateUser.mutate(
        { userId: user.id, data: { fullName: fullName.trim(), plantIds, ...access } },
        { onSuccess: onClose },
      );
    } else {
      createUser.mutate(
        { data: { fullName: fullName.trim(), email: email.trim(), role, password, plantIds } },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? ADMIN_COPY.EDIT_TITLE : ADMIN_COPY.CREATE_TITLE}</DialogTitle>
          <DialogDescription>
            {isEditing ? ADMIN_COPY.EDIT_DESCRIPTION : ADMIN_COPY.CREATE_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              controlId={fullNameId}
              label={ADMIN_COPY.FULL_NAME_LABEL}
              error={shownErrors.fullName}
            >
              <Input
                id={fullNameId}
                autoComplete="off"
                value={fullName}
                aria-invalid={Boolean(shownErrors.fullName)}
                onChange={handleFullNameChange}
              />
            </FormField>
            <FormField controlId={emailId} label={ADMIN_COPY.EMAIL_LABEL} error={shownErrors.email}>
              <Input
                id={emailId}
                type="email"
                autoComplete="off"
                value={email}
                disabled={isEditing}
                aria-invalid={Boolean(shownErrors.email)}
                onChange={handleEmailChange}
              />
            </FormField>
            <FormField
              controlId={roleId}
              label={ADMIN_COPY.ROLE_LABEL}
              hint={isOwnAccount ? ADMIN_COPY.OWN_ACCESS_HINT : undefined}
            >
              <Select value={role} disabled={isOwnAccount} onValueChange={handleRoleChange}>
                <SelectTrigger id={roleId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_ORDER.map((option) => (
                    <SelectItem key={option} value={option}>
                      {ROLE_LABEL[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            {isEditing ? (
              <div className="flex items-center gap-3 self-end pb-1.5">
                <Switch
                  id={activeId}
                  checked={isActive}
                  disabled={isOwnAccount}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor={activeId}>{ADMIN_COPY.ACTIVE_LABEL}</Label>
              </div>
            ) : (
              <FormField
                controlId={passwordId}
                label={ADMIN_COPY.PASSWORD_LABEL}
                hint={ADMIN_COPY.PASSWORD_HINT}
                error={shownErrors.password}
              >
                <Input
                  id={passwordId}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  aria-invalid={Boolean(shownErrors.password)}
                  onChange={handlePasswordChange}
                />
              </FormField>
            )}
          </div>
          <PlantAccessField
            selectedPlantIds={plantIds}
            hasAllPlantAccess={hasAllPlantAccess}
            onChange={setPlantIds}
          />
          {mutation.isError && <FormMessage message={failureMessage} />}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {ADMIN_COPY.CANCEL}
            </Button>
            <SubmitButton isSubmitting={mutation.isPending} submittingLabel={ADMIN_COPY.SAVING}>
              {ADMIN_COPY.SAVE}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
