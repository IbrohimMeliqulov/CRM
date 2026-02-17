import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateStudent } from './dto/createStudent.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { Status } from '@prisma/client';



@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }




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


    async createStudent(payload: CreateStudent, filename: string) {

        const existStudent = await this.prisma.student.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })


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
}
