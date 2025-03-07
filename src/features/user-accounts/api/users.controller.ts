import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUsersQueryParams } from './dto/input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from './dto/view-dto/user-view.dto';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { isValidObjectId } from 'mongoose';
import { CreateUserInputDto } from './dto/input-dto/user-input.dto';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { ParseObjectIdPipe } from '../../../core/pipes/parse-object-id.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreateUserInputDto): Promise<UserViewDto> {
    const id = await this.usersService.createUser(createDto);
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    await this.usersService.deleteUser(id);
    return;
  }
}
