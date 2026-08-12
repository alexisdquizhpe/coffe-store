import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNumber()
    displayOrder: number;
}