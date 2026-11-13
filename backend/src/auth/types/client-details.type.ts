/** What is recorded about the device a session was started from. */
export interface ClientDetails {
  userAgent: string | null;
  ipAddress: string | null;
}
