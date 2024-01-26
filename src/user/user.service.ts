import { genSaltSync, hashSync } from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    private getHash(data: string) {
        return hashSync(data, genSaltSync(10));
    }

    async create(user: Partial<User>) {
        const hashedPassword = this.getHash(user.password)
        return await this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword
            }
        })
    }

    async findById(id: string) {
        return await this.prismaService.user.findUniqueOrThrow({
            where: { id }
        })
    }

    async delete(id: string) {
        return await this.prismaService.user.delete({
            where: { id }
        })
    }
}

