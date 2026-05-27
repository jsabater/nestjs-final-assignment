import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { RESOURCE_TYPES, type ResourceType } from '../resources.model';
import { RESOURCE_STATUSES, type ResourceStatus } from '../resources.model';

/**
 * DTO for creating a new resource.
 * @property {string} name - The name of the resource
 * @property {ResourceType} type - The type of the resource
 * @property {ResourceStatus} status - The status of the resource
 * @property {string} location - The location of the resource
 */
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(RESOURCE_TYPES)
  type!: ResourceType;

  @IsIn(RESOURCE_STATUSES)
  status!: ResourceStatus;

  @IsString()
  @IsNotEmpty()
  location!: string;
}
