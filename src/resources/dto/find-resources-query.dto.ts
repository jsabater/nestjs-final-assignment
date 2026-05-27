import { IsIn, IsOptional } from 'class-validator';
import { RESOURCE_TYPES, type ResourceType } from '../resource.model';
import { RESOURCE_STATUSES, type ResourceStatus } from '../resource.model';

/**
 * Query parameters for finding resources
 * @property {ResourceType} type - A valid ResourceType value
 * @property {ResourceStatus} status - A valid ResourceStatus value
 */
export class FindResourceQueryDto {
  @IsOptional()
  @IsIn(RESOURCE_TYPES) // Only allow valid ResourceType values
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUSES) // Only allow valid ResourceStatus values
  status?: ResourceStatus;
}
