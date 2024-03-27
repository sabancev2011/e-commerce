import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class AuthSignupModel {

    @ApiProperty({
        example: 'example@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'Ivan'
    })
    @IsNotEmpty()
    username: string

    @ApiProperty({
        example: 'password123'
    })
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string
}

export class AuthSigninModel {

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
    @MinLength(6)
    @IsString()
    password: string
}

export class TokenResponse {

    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNzE1MDk5MS0zYTQ0LTQ3ODYtYWNjMC04YjcxZjQ3M2UxYmMiLCJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTcwNzY2ODQ2NywiZXhwIjoxNzA3NjY5MzY3fQ.JE57uXqunZx6wIfg7TeLLDyCnv7WchJRq3bSd-F2oGg"
    })
    access_token: string
}