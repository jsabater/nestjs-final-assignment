import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Available types of resources.
 * Defined as an array then used as a type because @IsIn does not accept types
 */
export const RESOURCE_TYPES = [
  'laptop',
  'room',
  'software',
  'vehicle',
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

/**
 * Available statuses for resources.
 * Defined as an array then used as a type because @IsIn does not accept types
 */
export const RESOURCE_STATUSES = ['available', 'assigned'] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

/**
 * Represents a resource entity in the system.
 */
@Entity()
export class Resource {
  /** Unique identifier for the resource. */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Name of the resource. */
  @Column({ nullable: false })
  name!: string;

  /** Type of resource. */
  @Column({ nullable: false })
  type!: ResourceType;

  /** Status of the resource. */
  @Column({ nullable: false })
  status!: ResourceStatus;

  /** Location of the resource. */
  @Column({ nullable: false })
  location!: string;

  /** ISO 8601 timestamp of when the resource was created. */
  @Column({ nullable: false })
  createdAt!: string;
}
