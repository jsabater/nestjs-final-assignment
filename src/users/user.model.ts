/**
 * Available roles for system users.
 * Defined as an array then used as a type because @IsIn does not accept types
 */
export const USER_ROLES = ['admin', 'member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Represents a user entity in the system.
 */
export interface User {
  /** Unique identifier for the user. */
  id: number;
  /** Full name of the user. */
  name: string;
  /** Email address of the user. */
  email: string;
  /** The assigned role determining user permissions. */
  role: UserRole;
  /** Indicates whether the user account is currently active. */
  active: boolean;
  /** ISO 8601 timestamp of when the user was created. */
  createdAt: string;
}
