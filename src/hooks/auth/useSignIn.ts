import { useQueryClient } from '@tanstack/react-query';
import { type ApiError, setSessionHint } from '@/api/httpClient';
import { useAuthLogin } from '@/api/generated/auth/auth';
import { AuthChannelMessage } from '@/enums/authChannelMessage';
import { resetSessionCache } from '@/lib/auth/sessionCache';
import { announceToOtherTabs } from '@/lib/auth/authChannel';

/** Signs in. The guest guard then takes the user to the page they originally asked for. */
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useAuthLogin<ApiError>({
    mutation: {
      onSuccess: async () => {
        setSessionHint(true);
        // Once the server confirms who signed in, the guest guard sends them to the page they asked for.
        await resetSessionCache(queryClient);
        announceToOtherTabs(AuthChannelMessage.SIGNED_IN);
      },
    },
  });
};
