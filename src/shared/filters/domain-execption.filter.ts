// shared/filters/domain-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../modules/catalog/domain/exceptions/catalog.exceptions';

const errorStatusMap: Record<string, number> = {
    PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
    INVALID_PRICE: HttpStatus.BAD_REQUEST,
    INVALID_PRODUCT_NAME: HttpStatus.BAD_REQUEST,
    INVALID_CATEGORY_NAME: HttpStatus.BAD_REQUEST,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const status = errorStatusMap[exception.code] ?? HttpStatus.BAD_REQUEST;
        response.status(status).json({ code: exception.code, message: exception.message });
    }
}