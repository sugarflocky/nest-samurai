import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer создает экземпляр dto
      //соответственно применятся значения по-умолчанию
      //сработает наследование
      //и методы классов dto
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorForResponse: { message: string; field: string }[] = [];

        errors.forEach((error: ValidationError) => {
          if (error.constraints) {
            const constraintsKeys = Object.keys(error.constraints);

            constraintsKeys.forEach((key) => {
              errorForResponse.push({
                message: error.constraints![key],
                field: error.property,
              });
            });
          }
        });
        throw new BadRequestException(errorForResponse);
      },
    }),
  );
}
