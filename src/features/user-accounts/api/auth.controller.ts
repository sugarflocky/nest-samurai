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
import { AuthService } from '../application/auth.service';
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
import { TokensPairDto } from '../dto/tokensPairDto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res() res: Response,
  ): Promise<SuccessLoginViewDto> {
    const tokens: TokensPairDto = await this.authService.createTokensPair(
      user.id,
    );

    const { accessToken, refreshToken } = tokens;

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
    const userId = await this.usersService.registerUser(registerDto);
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmEmail(@Body() code: CodeInputDto) {
    await this.usersService.confirmEmail(code);
    return;
  }

  @Post('/password-recovery')
  @HttpCode(204)
  async recoveryPassword(@Body() emailDto: EmailInputDto) {
    await this.usersService.recoveryPassword(emailDto);
    return;
  }

  @Post('/new-password')
  @HttpCode(204)
  async changePassword(@Body() changePasswordDto: ChangePasswordInputDto) {
    await this.usersService.changePassword(changePasswordDto);
    return;
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async resendEmail(@Body() email: EmailInputDto) {
    await this.usersService.resendEmail(email);
    return;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async me(@ExtractUserFromRequest() user: UserContextDto) {
    return this.usersQueryRepository.getUserByAccessToken(user.id);
  }
}
