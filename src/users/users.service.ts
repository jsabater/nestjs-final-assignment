import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUsersQueryDto } from './dto/find-users-query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

/**
 * In the create() method, async/await is not used because the focus is on returning the newly
 * created record with the generated ID. By not using async/await, the method waits for the
 * Promise returned by save() to resolve, allowing it to obtain the generated ID and return
 * the complete record.
 *
 * On the other hand, in the update() and remove() methods, the focus is on updating or removing
 * the record without needing to obtain any specific information from the database. In these
 * cases, the methods can return immediately after initiating the update or removal operation,
 * without the need to wait for the Promise to resolve.
 */
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all users based on the provided query parameters.
   * @param query - The query parameters for finding users (active, role).
   * @returns A Promise with a list of users.
   */
  findAll(query: FindUsersQueryDto): Promise<User[]> {
    const { active, role } = query;
    const where: Partial<User> = {};

    if (active !== undefined) {
      where.active = active;
    }

    if (role !== undefined) {
      where.role = role;
    }

    return this.usersRepository.find({ where });
  }

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A Promise with the found user.
   * @throws NotFoundException if the user is not found.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * Creates a new user on the database.
   * @param createUserDto - The DTO for creating a new user.
   * @returns A Promise with the created user.
   */
  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: Partial<User> = {
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findOne(id);

    const {
      name = currentUser.name,
      email = currentUser.email,
      role = currentUser.role,
      active = currentUser.active,
    } = updateUserDto;

    return this.usersRepository.save({
      ...currentUser,
      name,
      email,
      role,
      active,
    });
  }

  async remove(id: number): Promise<User> {
    const currentUser = await this.findOne(id);

    return this.usersRepository.remove(currentUser);
  }
}
