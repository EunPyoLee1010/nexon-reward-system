import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class NexonValidationPipe extends ValidationPipe {
    constructor() {
        super({ whitelist: true, transform: true, exceptionFactory });

        function exceptionFactory(errors: ValidationError[]) {
            const [error] = errors;

            if (error) {
                if (error.constraints) {
                    const [msg] = Object.entries(error.constraints).map(([k, v]) => `${k}: ${v}`);
                    return new BadRequestException(msg);
                }

                if (error.children) {
                    exceptionFactory(error.children);
                }
            }

            return new BadRequestException();
        }
    }
}
