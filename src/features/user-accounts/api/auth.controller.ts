import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { LoginInputDto } from './dto/input-dto/login-input.dto';
import { SuccessLoginViewDto } from './dto/view-dto/success-login-view.dto';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { RegisterInputDto } from './dto/input-dto/register-input.dto';
import { UsersService } from '../application/users.service';
import { CodeInputDto } from './dto/input-dto/code-input.dto';
import { EmailInputDto } from './dto/input-dto/email-input.dto';
import { ChangePasswordInputDto } from './dto/input-dto/change-password-input.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginInputDto,
    @Res() res: Response,
  ): Promise<SuccessLoginViewDto> {
    const result = await this.authService.login(loginDto);
    //TODO: CORRECT TOKEN IN COOKIES
    res.cookie('refreshToken', 'not.Refresh.Token', {
      httpOnly: true,
      secure: true,
    });
    res.send(result);
    return result;
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
  async me(@Request() req) {
    //TODO: Change @Request() to @UserIdInRequest()
    return this.usersQueryRepository.getUserByAccessToken(req.user.id);
  }
}
