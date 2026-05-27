import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { USER_ROLES, type UserRole } from '../user.model';

/**
 * DTO for updating a user.
 * @property {string} name - The name of the user
 * @property {string} email - The email of the user
 * @property {UserRole} role - The role of the user
 * @property {boolean} active - The active status of the user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
