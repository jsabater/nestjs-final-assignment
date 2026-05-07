import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { CreateUserInput, UpdateUserInput, User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserInput: UpdateUserInput,
  ): User {
    return this.usersService.update(Number(id), updateUserInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    return this.usersService.remove(Number(id));
  }
}
