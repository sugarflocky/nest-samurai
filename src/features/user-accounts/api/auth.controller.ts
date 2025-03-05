import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginInputDto): Promise<SuccessLoginViewDto> {
    return this.authService.login(loginDto);
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
    return this.usersQueryRepository.getUserByAccessToken(req.user.id);
  }
}
