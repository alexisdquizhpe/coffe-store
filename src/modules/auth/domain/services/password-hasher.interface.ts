export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface IPasswordHasher {
    hash(plainPassword: string): Promise<string>;
    verify(hashedPassword: string, plainPassword: string): Promise<boolean>;
}