import { UserSearchQueryDto, UserCreateDto, UserUpdateDto } from './dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../common/pipes';
import { User } from './schemas';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators';
import { DocumentToObjectInterceptor } from 'src/common/interceptors/document-to-object.interceptor';
import { DisableToObject } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: UserCreateDto): Promise<User> {
    try {
      return await this.usersService.create(dto);
    } catch (error) {
      throw new BadRequestException(
        'User with that email address already exists.',
      );
    }
  }

  @Post('login')
  async login(@Body('email') email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email address.');
    }

    return user;
  }

  @Public()
  @Post('search')
  async searchUsers(@Body() queryDto: UserSearchQueryDto): Promise<User[]> {
    console.log(queryDto);
    return await this.usersService.search(queryDto);
  }

  @Get(':id')
  async getUser(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('No user with such ID');
    }

    return user;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UserUpdateDto,
  ): Promise<User> {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const user = await this.usersService.delete(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist.");
    }

    return user;
  }
}
