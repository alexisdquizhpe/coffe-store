import { DomainException } from "src/modules/catalog/domain/exceptions/catalog.exceptions";

export class InvalidPhoneException extends DomainException {
    constructor() {
        super('El teléfono no puede estar vacío', 'INVALID_PHONE');
    }
}

export class InvalidAddressException extends DomainException {
    constructor() {
        super('La dirección no puede estar vacía', 'INVALID_ADDRESS');
    }
}

export class InvalidNameException extends DomainException {
    constructor() {
        super('El nombre del negocio no puede estar vacío', 'INVALID_NAME');
    }
}

export class InvalidEmailException extends DomainException {
    constructor(email: string) {
        super(`El correo "${email}" no tiene un formato válido`, 'INVALID_EMAIL');
    }
}

export class InvalidUrlException extends DomainException {
    constructor(field: string, value: string) {
        super(`"${value}" no es una URL válida para ${field}`, 'INVALID_URL');
    }
}

export class DuplicateSocialLinkException extends DomainException {
    constructor(type: string) {
        super(`Ya existe un enlace registrado para "${type}"`, 'DUPLICATE_SOCIAL_LINK');
    }
}

export class InvalidDayOfWeekException extends DomainException {
    constructor(day: number) {
        super(`Día de la semana inválido: ${day}. Debe estar entre 0 (domingo) y 6 (sábado)`, 'INVALID_DAY_OF_WEEK');
    }
}

export class InvalidTimeRangeException extends DomainException {
    constructor(reason: string) {
        super(`Rango de horario inválido: ${reason}`, 'INVALID_TIME_RANGE');
    }
}

export class BusinessProfileNotFoundException extends DomainException {
    constructor() {
        super('El perfil del negocio no ha sido configurado', 'BUSINESS_PROFILE_NOT_FOUND');
    }
}