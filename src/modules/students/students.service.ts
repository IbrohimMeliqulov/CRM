import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateStudent, UpdateStudent } from './dto/createStudent.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { Status } from '@prisma/client';
import { EmailService } from 'src/common/email/email.service';



@Injectable()
export class StudentsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService
    ) { }




    async getAllStudents() {
        const students = await this.prisma.student.findMany({
            where: {
                status: Status.active
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                birth_date: true,
                address: true,
                email: true,
                phone: true,
                photo: true
            }
        })

        return {
            success: true,
            data: students
        }
    }


    async createStudent(payload: CreateStudent, filename?: string) {

        const existStudent = await this.prisma.student.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })


        await this.emailService.sendEmail(payload.email, payload.phone, payload.password)


        if (existStudent) {
            throw new ConflictException()
        }

        const hashPass = await hashPassword(payload.password)

        await this.prisma.student.create({
            data: {
                ...payload,
                password: hashPass,
                photo: filename ?? null,
                birth_date: new Date(payload.birth_date)
            }
        })


        return {
            success: true,
            message: "Student created"
        }
    }

    async getInactiveStudents() {
        const inactiveStudents = await this.prisma.student.findMany({
            where: { status: Status.inactive },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                birth_date: true,
                phone: true,
                email: true
            }
        })

        return {
            success: true,
            data: inactiveStudents
        }
    }

    async getOneStudent(id: number) {
        const student = await this.prisma.student.findUnique({
            where: {
                id
            }
        })

        return {
            success: true,
            data: student
        }
    }





    async updateStudent(id: number, payload: UpdateStudent, filename?: string) {
        const { password, ...rest } = payload
        await this.prisma.student.update({
            where: { id: id }, data: {
                ...rest,
                ...(password && { password: await hashPassword(password) }),
                ...(filename && { photo: filename })
            }
        })

        return {
            success: true,
            message: "Student updated"
        }
    }


    async deleteStudent(id: number) {
        await this.prisma.student.update({ where: { id }, data: { status: Status.inactive } })
        return {
            success: true,
            message: "Student inactivated"
        }
    }
}
