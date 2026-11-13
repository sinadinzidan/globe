import { AUTH_CHANNEL_NAME } from '@/constants/authConstants';
import type { AuthChannelMessage } from '@/enums/authChannelMessage';

const MESSAGE_EVENT = 'message';
const BROADCAST_CHANNEL_GLOBAL = 'BroadcastChannel';

const openChannel = () =>
  BROADCAST_CHANNEL_GLOBAL in window ? new BroadcastChannel(AUTH_CHANNEL_NAME) : null;

/** Tells the other tabs of this browser that the user signed in or out here. */
export const announceToOtherTabs = (message: AuthChannelMessage) => {
  const channel = openChannel();
  channel?.postMessage(message);
  channel?.close();
};

/** Listens for sign-ins and sign-outs made in other tabs. Returns how to stop listening. */
export const listenToOtherTabs = (onMessage: (message: AuthChannelMessage) => void) => {
  const channel = openChannel();
  const handleMessage = (messageEvent: MessageEvent<AuthChannelMessage>) => {
    onMessage(messageEvent.data);
  };
  channel?.addEventListener(MESSAGE_EVENT, handleMessage);
  return () => {
    channel?.removeEventListener(MESSAGE_EVENT, handleMessage);
    channel?.close();
  };
};
