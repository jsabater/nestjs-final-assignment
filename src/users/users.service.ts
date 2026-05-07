import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Anna Serra',
      email: 'anna@example.com',
      role: 'member',
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((currentUser) => currentUser.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  create(createUserInput: CreateUserInput): User {
    const newUser: User = {
      id: this.users.length + 1,
      name: createUserInput.name,
      email: createUserInput.email,
      role: createUserInput.role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    return newUser;
  }

  update(id: number, updateUserInput: UpdateUserInput): User {
    const user = this.users.find((currentUser) => currentUser.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(user, updateUserInput);

    return user;
  }

  remove(id: number): User {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const [deletedUser] = this.users.splice(userIndex, 1);

    return deletedUser;
  }
}
