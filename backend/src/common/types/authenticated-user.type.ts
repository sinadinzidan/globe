import type { Permission } from '../enums/permission.enum.js';
import type { Role } from '../enums/role.enum.js';

/** The signed-in user as every guard, policy and service sees it. Built from the database on each request. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  permissions: readonly Permission[];
  /** The plants the user is assigned to. Ignored when the role has `PLANT_READ_ALL`. */
  plantIds: string[];
  /** The session the request was made with. */
  sessionId: string;
}

declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: AuthenticatedUser;
  }
}
