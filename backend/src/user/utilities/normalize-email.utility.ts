/** Emails are compared and stored trimmed, in lower case and in one Unicode form. */
export const normalizeEmail = (email: string) => email.trim().normalize('NFC').toLowerCase();
