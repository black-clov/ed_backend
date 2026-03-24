import { Body, Controller, Get, Param, Post, Put, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto, @Res() res: Response) {
    console.log('POST /api/users called with:', dto);
    try {
      const user = await this.usersService.create(dto);
      console.log('User created successfully:', user);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err: any) {
      console.error('Error creating user:', err);
      if (err.status === 409) {
        return res.status(HttpStatus.CONFLICT).json({ message: err.message });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message || 'Registration failed' });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}
