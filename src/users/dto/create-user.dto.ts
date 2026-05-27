import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLES, type UserRole } from '../users.model';

/**
 * DTO for creating a new user.
 * @property {string} name - The name of the user
 * @property {string} email - The email of the user
 * @property {UserRole} role - The role of the user
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(USER_ROLES)
  role!: UserRole;
}
