import { DomainException } from "src/modules/catalog/domain/exceptions/catalog.exceptions";


export class InvalidEmailException extends DomainException {
    constructor(email: string) {
        super(`El correo electrónico ${email} no es válido`, 'INVALID_EMAIL');
    }
}

export class InvalidCredentialsException extends DomainException {
    constructor() {
        super('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }
}

export class RefreshTokenReuseException extends DomainException {
    constructor() {
        super('Se detectó reuso de refresh token — todas las sesiones fueron revocadas', 'REFRESH_TOKEN_REUSE');
    }
}

export class RefreshTokenInvalidException extends DomainException {
    constructor() {
        super('Refresh token inválido o expirado', 'REFRESH_TOKEN_INVALID');
    }
}

export class UserNotFoundException extends DomainException {
    constructor(email: string) {
        super(`Usuario no encontrado con el correo electrónico ${email}`, 'USER_NOT_FOUND');
    }
}

export class AdminUserAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(`El usuario con el correo electrónico ${email} ya existe`, 'ADMIN_USER_ALREADY_EXISTS');
    }
}