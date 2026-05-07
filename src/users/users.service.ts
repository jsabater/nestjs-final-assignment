import { Injectable } from '@nestjs/common';
import { User } from './user.model';

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
}
