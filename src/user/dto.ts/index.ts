import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {

    @ApiProperty({
        example: 'example@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'password123'
    })
    @IsNotEmpty()
    @IsString()
    password: string
}