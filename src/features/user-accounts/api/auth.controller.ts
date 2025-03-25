import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { SuccessLoginViewDto } from './dto/view-dto/success-login-view.dto';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { RegisterInputDto } from './dto/input-dto/register-input.dto';
import { CodeInputDto } from './dto/input-dto/code-input.dto';
import { EmailInputDto } from './dto/input-dto/email-input.dto';
import { ChangePasswordInputDto } from './dto/input-dto/change-password-input.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../core/guards/dto/user-context.dto';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/usecases/register-user-use-case';
import { ConfirmEmailCommand } from '../application/usecases/confirm-email-by-code-use-case';
import { SendRecoveryCodeCommand } from '../application/usecases/send-recovery-code-use-case';
import { RecoveryPasswordCommand } from '../application/usecases/recovery-password-by-code-use-case';
import { ResendEmailCommand } from '../application/usecases/resend-email-confirmation-code-use-case';
import { LoginUserCommand } from '../application/usecases/login-user.use-case';
import { RefreshTokenAuthGuard } from '../../../core/guards/bearer/refresh-token.guard';
import { LogoutUserCommand } from '../application/usecases/logout-user.use-case';
import { GenerateNewRefreshTokenCommand } from '../application/usecases/generate-new-refresh-token-use.case';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<SuccessLoginViewDto> {
    const dto = {
      ip: req.headers['x-forwarded-for'] || 'Unknown',
      title: req.headers['user-agent'] || 'Unnamed',
      userId: user.id,
    };

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginUserCommand(dto),
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
  @UseGuards(ThrottlerGuard)
  async register(@Body() registerDto: RegisterInputDto) {
    const userId: string = await this.commandBus.execute(
      new RegisterUserCommand(registerDto),
    );
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  @UseGuards(ThrottlerGuard)
  async confirmEmail(@Body() code: CodeInputDto) {
    await this.commandBus.execute(new ConfirmEmailCommand(code));
    return;
  }

  @Post('/password-recovery')
  @HttpCode(204)
  @UseGuards(ThrottlerGuard)
  async recoveryPassword(@Body() emailDto: EmailInputDto) {
    await this.commandBus.execute(new SendRecoveryCodeCommand(emailDto));
    return;
  }

  @Post('/new-password')
  @HttpCode(204)
  @UseGuards(ThrottlerGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordInputDto) {
    await this.commandBus.execute(
      new RecoveryPasswordCommand(changePasswordDto),
    );
    return;
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  @UseGuards(ThrottlerGuard)
  async resendEmail(@Body() email: EmailInputDto) {
    await this.commandBus.execute(new ResendEmailCommand(email));
    return;
  }

  @Post('/logout')
  @UseGuards(RefreshTokenAuthGuard)
  @HttpCode(204)
  async logout(@ExtractUserFromRequest() user: UserContextDto) {
    await this.commandBus.execute(new LogoutUserCommand(user.deviceId!));
  }

  @Post('/refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  @HttpCode(200)
  async refreshToken(
    @ExtractUserFromRequest() user: UserContextDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<SuccessLoginViewDto> {
    const dto = {
      ip: req.headers['x-forwarded-for'] || 'undefined',
      title: req.headers['user-agent'] || 'Unnamed',
      userId: user.id,
      deviceId: user.deviceId!,
    };

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new GenerateNewRefreshTokenCommand(dto),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.send({ accessToken });
    return { accessToken };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async me(@ExtractUserFromRequest() user: UserContextDto) {
    return this.usersQueryRepository.getUserByAccessToken(user.id);
  }
}
