import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useRoleList } from '@/api/generated/roles/roles';
import {
  getUserListQueryKey,
  useUserCreate,
  useUserList,
  useUserResetPassword,
  useUserUpdate,
} from '@/api/generated/users/users';
import type { ApiError } from '@/api/httpClient';

/** A page of users. The previous page stays on screen while the next one loads. */
export const useUsers = (page: number, pageSize: number) =>
  useUserList({ page, pageSize }, { query: { placeholderData: keepPreviousData } });

export const useRoles = () => useRoleList();

/** Creates a user, then refreshes every page of the user list. */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useUserCreate<ApiError>({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getUserListQueryKey() }),
    },
  });
};

/** Changes a user, then refreshes every page of the user list. */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useUserUpdate<ApiError>({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getUserListQueryKey() }),
    },
  });
};

/** Sets a user's password. Nothing that is listed changes, so no cache is refreshed. */
export const useResetUserPassword = () => useUserResetPassword<ApiError>();
