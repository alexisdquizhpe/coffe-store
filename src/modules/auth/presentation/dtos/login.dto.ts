import { IsString, IsEmail, MinLength, IsUUID } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}


export class RefreshTokenDto {
    @IsUUID()
    refreshTokenId: string;

    @IsString()
    refreshToken: string;
}