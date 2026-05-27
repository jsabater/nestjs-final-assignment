import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { USER_ROLES, type UserRole } from '../user.model';

/**
 * Query parameters for finding users
 * @property {boolean} active - Filter by active status
 * @property {UserRole} role - A valid user role
 */
export class FindUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true') // Transform 'true' to true
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsIn(USER_ROLES) // Only allow valid UserRole values
  role?: UserRole;
}
