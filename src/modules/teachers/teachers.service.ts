import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    async teacherGroups(req) {
        const { id } = req.user
        console.log(id)
        const teacherGroups = await this.prisma.group.findMany({
            where: {
                teacher_id: id,
                status: Status.active
            }
        })

        return {
            success: true,
            data: teacherGroups
        }
    }

    async getAllInactiveTeachers() {
        const teachers = await this.prisma.teacher.findMany({
            where: { status: Status.inactive }
        })

        return {
            success: true,
            data: teachers
        }
    }

    async singleGroup(groupId: number, req: any) {
        const { id } = req.user
        const existGroup = await this.prisma.group.findUnique({
            where: {
                id: groupId,
                status: Status.active,
                teacher_id: id
            },

        })

        if (!existGroup) {
            throw new NotFoundException()
        }

        const singleGroupStudents = await this.prisma.studentGroup.findMany({
            where: { group_id: id },
            select: {
                id: true,
                students: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        birth_date: true,
                        email: true
                    }
                }
            }
        })

        return {
            success: true,
            data: singleGroupStudents
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
