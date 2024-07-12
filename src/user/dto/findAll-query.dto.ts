import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllQueryDto {
    @ApiPropertyOptional()
    @IsString({message: 'The query email must be a string'})
    @IsOptional()
    email: string;
}