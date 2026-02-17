import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }



    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Post("createAdmin")
    createAdmin(@Body() payload: RegisterDto) {
        return this.userService.createAdmin(payload)
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("admin/all")
    getAllAdmins() {
        return this.userService.getAllAdmins()
    }

}
