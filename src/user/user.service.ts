import { genSaltSync, hashSync } from 'bcrypt';

import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/interfaces';
import { Role } from '@prisma/client';
import { UserCreateModel, UserUpdateModel } from './dto.ts';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(userCreate: UserCreateModel) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: userCreate.email
            }
        })
        if (user) {
            throw new UnauthorizedException('User already exists')
        }
        const hashedPassword = hashSync(userCreate.password, genSaltSync(10));
        return this.prismaService.user.create({
            data: {
                email: userCreate.email,
                username: userCreate.username,
                password: hashedPassword
            }
        })
    }

    async update(id: string, userUpdate: UserUpdateModel) {
        let password = userUpdate.password 
        const user = await this.prismaService.user.findUnique({
            where: { id }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        if (password) {
            password = hashSync(userUpdate.password, genSaltSync(10));
        }
        return this.prismaService.user.update({
            where: { id },
            data: {
                email: userUpdate.email,
                username: userUpdate.username,
                password
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

