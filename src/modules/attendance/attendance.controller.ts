import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/create.attendance.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get()
    getAllAttendances() {
        return this.attendanceService.getAllAttendances()
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Post()
    createAttendance(
        @Body() payload: CreateAttendanceDto,
        @Req() req: Request
    ) {
        return this.attendanceService.createAttendance(payload, req['user'])
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Put(":id")
    updateAttendance(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateAttendanceDto,
        @Req() req: Request
    ) {
        return this.attendanceService.updateAttendance(id, payload, req['user'])
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Delete(":id")
    deleteAttendance(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.attendanceService.deleteAttendance(id, req['user'])
    }
}
