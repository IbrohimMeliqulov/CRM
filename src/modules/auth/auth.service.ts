import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { LoginDto } from './dto/login.dto';
import { checkPassword } from 'src/core/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService
    ) { }


    async userLogin(payload: LoginDto) {
        const existAdmin = await this.prisma.user.findUnique({ where: { phone: payload.phone } })

        if (!existAdmin) {
            throw new BadRequestException("Phone number wrong")
        }


        if (!await checkPassword(payload.password, existAdmin.password)) {
            throw new BadRequestException("Password wrong")
        }

        return {
            success: true,
            message: "You logged in",
            accessToken: this.jwt.sign({ id: existAdmin.id, email: existAdmin.email, role: existAdmin.role })
        }

    }


    async teacherLogin(payload: LoginDto) {
        const existTeacher = await this.prisma.teacher.findUnique({ where: { phone: payload.phone } })

        if (!existTeacher) {
            throw new BadRequestException("Phone number wrong")
        }


        if (!await checkPassword(payload.password, existTeacher.password)) {
            throw new BadRequestException("Password wrong")
        }

        return {
            success: true,
            message: "You logged in",
            accessToken: this.jwt.sign({ id: existTeacher.id, email: existTeacher.email, role: Role.TEACHER })
        }
    }


    async studentLogin(payload: LoginDto) {
        const existStudent = await this.prisma.student.findUnique({ where: { phone: payload.phone } })

        if (!existStudent) {
            throw new BadRequestException("Phone number wrong")
        }


        if (!await checkPassword(payload.password, existStudent.password)) {
            throw new BadRequestException("Password wrong")
        }

        return {
            success: true,
            message: "You logged in",
            accessToken: this.jwt.sign({ id: existStudent.id, email: existStudent.email, role: Role.STUDENT })
        }

    }
}
