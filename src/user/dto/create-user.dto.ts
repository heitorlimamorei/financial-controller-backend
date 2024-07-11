import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({required: true})
    @IsString({message: 'The name of the user must be a string'})
    name: string;

    @ApiProperty({required: true})
    @IsEmail({}, {message: 'The email address must be a valid one'})
    email: string;
}
