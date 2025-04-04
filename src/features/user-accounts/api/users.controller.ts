import {
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
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { CreateUserInputDto } from './dto/input-dto/user-input.dto';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user-use-case';
import { DeleteUserCommand } from '../application/usecases/delete-user-use-case';

@Controller('sa/users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreateUserInputDto): Promise<UserViewDto> {
    const id: string = await this.commandBus.execute(
      new CreateUserCommand(createDto),
    );
    return this.usersQueryRepository.selectByIdOrNotFound(id);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.selectAll(query);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return;
  }
}
