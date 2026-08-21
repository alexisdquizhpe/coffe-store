import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterStaffDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(3)
    fullName: string;
}