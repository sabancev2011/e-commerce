import { genSaltSync, hashSync } from 'bcrypt';

import { ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from 'src/auth/dto.ts';
import { JwtPayload } from 'src/interfaces';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(auth: Auth) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: auth.email
            }
        })
        if (user) {
            throw new UnauthorizedException('User already exists')
        }
        const hashedPassword = hashSync(auth.password, genSaltSync(10));
        return this.prismaService.user.create({
            data: {
                email: auth.email,
                password: hashedPassword
            }
        })
    }

    async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async delete(id: string, currentUser: JwtPayload) {
        try {
            if (currentUser.sub !== id && !currentUser.roles.includes(Role.ADMIN)) {
                 throw new ForbiddenException()
            }
            const user = await this.prismaService.user.delete({
                where: { id },
                select: { id: true }
            })
            return user
        }
        catch (error) {
            throw new NotFoundException()
        }
    }

    async find() {
        return this.prismaService.user.findMany();
    }
}

