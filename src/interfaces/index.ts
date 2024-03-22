import { $Enums } from "@prisma/client"

export interface JwtPayload {
    sub: string
    email: string
    roles: $Enums.Role[]
    iat: number
    exp: number
}