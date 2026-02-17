import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { Role, Status } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createAdmin(payload: RegisterDto) {
        const adminExists = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })
        if (adminExists) throw new ConflictException()
        const hashPass = await hashPassword(payload.password)
        await this.prisma.user.create({
            data: {
                ...payload,
                password: hashPass,
                role: Role.ADMIN
            }
        })

        return {
            success: true,
            message: "Admin created"
        }

    }



    async getAllAdmins() {
        const admins = await this.prisma.user.findMany({
            where: {
                status: Status.active,
                role: Role.ADMIN
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                role: true,
                phone: true,
                email: true,
                address: true,
                status: true
            }
        })
        return {
            success: true,
            data: admins
        }
    }
}
