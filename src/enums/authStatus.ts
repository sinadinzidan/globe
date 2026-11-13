export enum AuthStatus {
  /** The session is still being restored. Nothing may be shown or redirected yet. */
  UNKNOWN = 'UNKNOWN',
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  /** The server could not be reached, so nobody knows. */
  UNAVAILABLE = 'UNAVAILABLE',
}
