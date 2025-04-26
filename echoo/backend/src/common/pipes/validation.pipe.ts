/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

interface ConstructorType<T = unknown> {
  new (...args: unknown[]): T;
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (typeof metatype !== 'function' || !metatype.prototype) {
      throw new BadRequestException(
        'Invalid metatype provided for validation.',
      );
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return object;
  }

  private toValidate(metatype: ConstructorType): boolean {
    const types: ConstructorType[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
      if (!error.constraints) return [];
      return Object.values(error.constraints);
    });
  }
}
