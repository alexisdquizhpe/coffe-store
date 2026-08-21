import { Injectable } from "@nestjs/common";
import { IPasswordHasher } from "../../domain/services/password-hasher.interface";
import * as argon2 from "argon2";

@Injectable()
export class Argon2PasswordHasher implements IPasswordHasher {

    async hash(plainPassword: string): Promise<string> {
        return argon2.hash(plainPassword, {
            type: argon2.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1
        });
    }

    async verify(hashedPassword: string, plainPassword: string): Promise<boolean> {
        return argon2.verify(hashedPassword, plainPassword);
    }

}