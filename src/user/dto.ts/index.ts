import { ApiProperty } from "@nestjs/swagger"
import { $Enums, User } from "@prisma/client"
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator"

export class UserModel implements User {

    @ApiProperty({
        example: '5b7eb78e-907d-4b69-9d9f-1b18e7ac9398'
    })
    @IsUUID()
    id: string

    @ApiProperty({
        example: 'example@example.com'
    })
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'Ivan'
    })
    username: string

    @ApiProperty({
        example: '2024-02-25T09:45:08.746Z'
    })
    @IsDate()
    createdAt: Date

    @ApiProperty({
        example: '2024-02-25T09:45:08.746Z'
    })
    @IsDate()
    updatedAt: Date

    @ApiProperty({
        enum: $Enums.Role,
        isArray: true,
        example: [$Enums.Role.USER, $Enums.Role.ADMIN]
    })
    @IsArray()
    roles: $Enums.Role[]

    password: string;
}

export class UserUpdateModel {

    @ApiProperty({
        required: false,
        example: 'example@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({
        required: false,
        example: 'Ivan'
    })
    @IsOptional()
    username?: string

    @ApiProperty({
        required: false,
        example: 'newPassword'
    })
    @IsOptional()
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password?: string
}

export class UserCreateModel {

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
