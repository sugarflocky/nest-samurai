import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
      // Если нет токена, разрешаем выполнение запроса без авторизации
      return true;
    }

    try {
      // Проверка валидности токена
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'abracadabra', // Проверка с секретом
      });

      request.user = { id: decoded.userId };

      // Если токен валиден, добавляем информацию о пользователе в request
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return true;
    }
  }
}
