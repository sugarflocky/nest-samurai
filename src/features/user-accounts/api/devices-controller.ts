import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenAuthGuard } from '../../../core/guards/bearer/refresh-token.guard';
import { ExtractUserFromRequest } from '../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../core/guards/dto/user-context.dto';
import { SessionViewDto } from './dto/view-dto/session-view.dto';
import { DevicesQueryRepository } from '../infrastructure/query/devices.query-repository';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteOtherDevicesCommand } from '../application/usecases/delete-other-devices.use-case';
import { DeleteDeviceCommand } from '../application/usecases/delete-device.use-case';

@Controller('security/devices')
export class DevicesController {
  constructor(
    private devicesQueryRepository: DevicesQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(RefreshTokenAuthGuard)
  async getAll(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<SessionViewDto[]> {
    return this.devicesQueryRepository.getAll(user.id);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(RefreshTokenAuthGuard)
  async deleteOther(@ExtractUserFromRequest() user: UserContextDto) {
    await this.commandBus.execute(
      new DeleteOtherDevicesCommand(user.id, user.deviceId!),
    );
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(RefreshTokenAuthGuard)
  async deleteDevice(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('id') id: string,
  ) {
    await this.commandBus.execute(new DeleteDeviceCommand(user.id, id));
  }
}
