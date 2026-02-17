import { ConflictException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/createTeacher.dto';
import { hashPassword } from 'src/core/utils/bcrypt';

@Injectable()
export class TeachersService {
    constructor(private prisma: PrismaService) { }

    async getAllTeachers() {
        const teachers = await this.prisma.teacher.findMany({
            where: {
                status: Status.active
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                address: true,
                email: true,
                phone: true,
                photo: true
            }
        })


        return {
            success: true,
            data: teachers
        }
    }


    async getOneTeacher(id: number) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id }, select: {
                id: true,
                first_name: true,
                last_name: true,
                address: true,
                email: true,
                phone: true,
                photo: true
            }
        })

        return {
            success: true,
            data: teacher
        }
    }


    async createTeacher(payload: CreateTeacherDto, filename: string) {

        const existTeacher = await this.prisma.teacher.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })

        if (existTeacher) {
            throw new ConflictException()
        }

        const hashPass = await hashPassword(payload.password)

        await this.prisma.teacher.create({
            data: {
                ...payload,
                password: hashPass,
                photo: filename ?? null,
            }
        })


        return {
            success: true,
            message: "Teacher created"
        }
    }




    async updateTeacher(id: number, payload: UpdateTeacherDto, filename: string) {
        const { password, ...rest } = payload
        await this.prisma.teacher.update({
            where: { id }, data: {
                ...rest,
                ...(password && { password: await hashPassword(password) }),
                ...(filename && { photo: filename })
            }
        })

        return {
            success: true,
            message: "Teacher updated"
        }
    }


    async deleteTeacher(id: number) {
        await this.prisma.teacher.update({ where: { id }, data: { status: Status.inactive } })
        return {
            success: true,
            message: "Teacher inactivated"
        }
    }
}
