import { useQueryClient } from '@tanstack/react-query';
import { setSessionHint } from '@/api/httpClient';
import { useAuthLogout } from '@/api/generated/auth/auth';
import { AuthChannelMessage } from '@/enums/authChannelMessage';
import { resetSessionCache } from '@/lib/auth/sessionCache';
import { announceToOtherTabs } from '@/lib/auth/authChannel';

/**
 * Signs out: the API revokes the session, the other tabs are told, and everything cached for
 * the user is dropped. The route guard then sends the user to the login page.
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useAuthLogout({
    mutation: {
      // Even if the API could not be reached, this browser forgets the user.
      onSettled: async () => {
        setSessionHint(false);
        announceToOtherTabs(AuthChannelMessage.SIGNED_OUT);
        await resetSessionCache(queryClient);
      },
    },
  });
};
