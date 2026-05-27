import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Available roles for system users.
 * Defined as an array then used as a type because @IsIn does not accept types
 */
export const USER_ROLES = ['admin', 'member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Represents a user entity in the system.
 */
@Entity()
export class User {
  /** Unique identifier for the user. */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Full name of the user. */
  @Column({ nullable: false })
  name!: string;

  /** Email address of the user. */
  @Column({ nullable: false })
  email!: string;

  /** The assigned role determining user permissions. */
  @Column({ nullable: false })
  role!: UserRole;

  /** Indicates whether the user account is currently active. */
  @Column({ nullable: false, default: true })
  active!: boolean;

  /** ISO 8601 timestamp of when the user was created. */
  @Column({ nullable: false })
  createdAt!: string;
}
