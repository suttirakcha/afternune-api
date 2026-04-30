import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce<Record<string, string[]>>(
          (acc, curr) => {
            if (curr.constraints) {
              acc[curr.property] = Object.values(curr.constraints);
            }
            return acc;
          },
          {},
        );

        throw new BadRequestException({
          code: 'VALIDATION_FAILED',
          message: 'Validation failed',
          details: formattedErrors,
        });
      },
    });
  }
}
