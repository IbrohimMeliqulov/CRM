import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { RegisterDto, UpdateUserDto } from './dto/register.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { Role, Status } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createAdmin(payload: RegisterDto, filename?: string) {
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
                photo: filename,
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



    async getOneAdmin(id: number) {
        const admin = await this.prisma.user.findUnique({ where: { id } })
        if (!admin) {
            throw new NotFoundException()
        }

        return {
            success: true,
            data: admin
        }
    }

    async getInactiveAdmins() {
        const admins = await this.prisma.user.findMany({
            where: { status: Status.inactive }
        })

        return {
            success: true,
            data: admins
        }
    }

    async updateAdmin(id: number, payload: UpdateUserDto, filename?: string) {
        const { password, ...rest } = payload
        const existAdmin = await this.prisma.user.findUnique({ where: { id } })
        if (!existAdmin) {
            throw new NotFoundException()
        }

        await this.prisma.user.update({
            where: { id }, data: {
                ...rest,
                ...(password && { password: await hashPassword(password) }),
                ...(filename && { photo: filename })
            }
        })


        return {
            success: true,
            message: "Admin updated"
        }
    }


    async deleteAdmin(id: number) {
        const existAdmin = await this.prisma.user.findUnique({ where: { id } })
        if (!existAdmin) throw new NotFoundException()


        await this.prisma.user.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Admin inactivated"
        }
    }
}
