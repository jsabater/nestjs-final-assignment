import { IsNotEmpty, IsOptional, IsIn, IsString } from 'class-validator';
import { RESOURCE_TYPES, type ResourceType } from '../resources.model';
import { RESOURCE_STATUSES, type ResourceStatus } from '../resources.model';

/**
 * DTO for updating a resource.
 * @property {string} name - The name of the resource
 * @property {ResourceType} type - The type of the resource
 * @property {ResourceStatus} status - The status of the resource
 * @property {string} location - The location of the resource
 */
export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUSES)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;
}
