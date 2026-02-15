import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { StaffRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createAdmin(payload: RegisterDto) {
        const adminExists = await this.prisma.staff.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })
        if (adminExists) throw new ConflictException()
        const hashPass = await hashPassword(payload.password)
        await this.prisma.staff.create({
            data: {
                ...payload,
                password: hashPass,
                role: StaffRole.admin
            }
        })

        return {
            success: true,
            message: "Admin created"
        }

    }
}
