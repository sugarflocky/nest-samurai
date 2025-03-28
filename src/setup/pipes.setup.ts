import { INestApplication, ValidationPipe } from '@nestjs/common';
import { BadRequestDomainException } from '../core/exceptions/domain-exceptions';
import { errorFormatter } from '../core/pipes/errorFormatter';
import { UuidValidationPipe } from '../core/pipes/uuid-validation-pipe';

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  app.useGlobalPipes(
    new UuidValidationPipe(),
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //и методы классов dto
      transform: true,
      //Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      //Для преобразования ошибок класс валидатора в необходимый вид
      exceptionFactory: (errors) => {
        const formattedErrors = errorFormatter(errors);

        throw new BadRequestDomainException(formattedErrors);
      },
    }),
  );
}
