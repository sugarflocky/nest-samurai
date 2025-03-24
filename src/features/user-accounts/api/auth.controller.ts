import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { SuccessLoginViewDto } from './dto/view-dto/success-login-view.dto';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { RegisterInputDto } from './dto/input-dto/register-input.dto';
import { UsersService } from '../application/users.service';
import { CodeInputDto } from './dto/input-dto/code-input.dto';
import { EmailInputDto } from './dto/input-dto/email-input.dto';
import { ChangePasswordInputDto } from './dto/input-dto/change-password-input.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../core/guards/dto/user-context.dto';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { AuthUserCommand } from '../application/usecases/auth-user-use-case';
import { RegisterUserCommand } from '../application/usecases/register-user-use-case';
import { ConfirmEmailCommand } from '../application/usecases/confirm-email-by-code-use-case';
import { SendRecoverCodeCommand } from '../application/usecases/send-recovery-code-use-case';
import { RecoveryPasswordCommand } from '../application/usecases/recovery-password-by-code-use-case';
import { ResendEmailCommand } from '../application/usecases/resend-email-confirmation-code-use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res() res: Response,
  ): Promise<SuccessLoginViewDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new AuthUserCommand(user.id),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.send({ accessToken });
    return { accessToken };
  }

  @Post('/registration')
  @HttpCode(204)
  async register(@Body() registerDto: RegisterInputDto) {
    const userId: string = await this.commandBus.execute(
      new RegisterUserCommand(registerDto),
    );
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmEmail(@Body() code: CodeInputDto) {
    await this.commandBus.execute(new ConfirmEmailCommand(code));
    return;
  }

  @Post('/password-recovery')
  @HttpCode(204)
  async recoveryPassword(@Body() emailDto: EmailInputDto) {
    await this.commandBus.execute(new SendRecoverCodeCommand(emailDto));
    return;
  }

  @Post('/new-password')
  @HttpCode(204)
  async changePassword(@Body() changePasswordDto: ChangePasswordInputDto) {
    await this.commandBus.execute(
      new RecoveryPasswordCommand(changePasswordDto),
    );
    return;
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async resendEmail(@Body() email: EmailInputDto) {
    await this.commandBus.execute(new ResendEmailCommand(email));
    return;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async me(@ExtractUserFromRequest() user: UserContextDto) {
    return this.usersQueryRepository.getUserByAccessToken(user.id);
  }
}
