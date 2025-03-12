import { ValidationError } from 'class-validator';
import { ErrorExtension } from '../exceptions/domain-exceptions';

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: any,
): ErrorExtension[] => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error?.constraints) {
      const constrainKeys = Object.keys(error.constraints);

      for (const key of constrainKeys) {
        errorsForResponse.push({
          message: error.constraints[key] ? `${error.constraints[key]}` : '',
          field: error.property,
        });
      }
    }
  }

  return errorsForResponse;
};
