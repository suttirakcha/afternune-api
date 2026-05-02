import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: Object.values(error.constraints ?? {})[0],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    });
  }
}
