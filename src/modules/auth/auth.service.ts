import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { LoginDto } from './dto/login.dto';
import { checkPassword } from 'src/core/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService
    ) { }


    async login(payload: LoginDto) {
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
            accessToken: this.jwt.sign({ id: existAdmin.id, phone: existAdmin.phone, email: existAdmin.email })
        }

    }
}
