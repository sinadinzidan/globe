import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { setSessionExpiredHandler } from '@/api/httpClient';
import { getAuthMeQueryKey } from '@/api/generated/auth/auth';
import { AuthChannelMessage } from '@/enums/authChannelMessage';
import { resetSessionCache } from '@/lib/auth/sessionCache';
import { announceToOtherTabs, listenToOtherTabs } from '@/lib/auth/authChannel';

/**
 * Keeps this tab's idea of the session in step with reality: when the API says the session is
 * over, and when another tab signs in or out. Mounted once, at the root of the application.
 */
export const useAuthSessionEffects = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      // Only a user who was signed in can have their session expire.
      if (queryClient.getQueryData(getAuthMeQueryKey())) {
        announceToOtherTabs(AuthChannelMessage.SIGNED_OUT);
        void resetSessionCache(queryClient);
      }
    });
    return listenToOtherTabs((message) => {
      // Signed in or out elsewhere: either way, what this tab has cached belongs to the past.
      if (Object.values(AuthChannelMessage).includes(message)) {
        void resetSessionCache(queryClient);
      }
    });
  }, [queryClient]);
};
