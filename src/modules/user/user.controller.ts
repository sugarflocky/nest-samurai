import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserQueryRepository } from './user.queryRepository';
import { UserCreateDto, UserSortData, UserViewModel } from './user.types';
import { SortOrder } from 'mongoose';
import { Pagination } from '../../common/common.types';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userQueryRepository: UserQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createUser(
    @Body() createDto: UserCreateDto,
  ): Promise<UserViewModel | null> {
    const user = await this.userService.createUser(createDto);
    if (!user) return null;
    return user;
  }

  @Get()
  @HttpCode(200)
  async getUsers(
    @Query('searchLoginTerm') searchLoginTerm: string = '',
    @Query('searchEmailTerm') searchEmailTerm: string = '',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortDirection') sortDirection: SortOrder = 'desc',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<Pagination<UserViewModel> | null> {
    const sortData: UserSortData = {
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const users = await this.userQueryRepository.getUsers(sortData);
    return users;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
