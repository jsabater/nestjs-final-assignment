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
export interface Resource {
  /** Unique identifier for the resource. */
  id: number;
  /** Name of the resource. */
  name: string;
  /** Type of resource. */
  type: ResourceType;
  /** Status of the resource. */
  status: ResourceStatus;
  /** Location of the resource. */
  location: string;
  /** ISO 8601 timestamp of when the resource was created. */
  createdAt: string;
}
