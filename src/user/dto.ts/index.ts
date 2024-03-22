import { ApiProperty } from "@nestjs/swagger"
import { $Enums, User } from "@prisma/client"
import { IsArray, IsDate, IsEmail, IsUUID } from "class-validator"

export class UserEntity implements User {

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
        example: ["USER"]
    })
    @IsArray()
    roles: $Enums.Role[]

    password: string;
}