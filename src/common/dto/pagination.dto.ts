import { IsInt, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQuery {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}