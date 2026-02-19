import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { StudentGroupService } from './student-group.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { createStudentGroupDto, UpdateStudentGroupDto } from '../dto/create.groups.dto';



@ApiBearerAuth()
@Controller('student-group')
export class StudentGroupController {
    constructor(private readonly studentGroupService: StudentGroupService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Post()
    createStudentGroup(
        @Body() payload: createStudentGroupDto
    ) {
        return this.studentGroupService.createStudentGroup(payload)
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get("all")
    getAllStudentGroups() {
        return this.studentGroupService.getAllStudentGroups()
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get(":id")
    getOneStudentGroup(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.studentGroupService.getOneStudentGroup(id)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("inactive")
    getInactiveStudentGroups() {
        return this.studentGroupService.getInactiveStudentGroups()
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Put(":id")
    updateStudentGroup(
        @Body() payload: UpdateStudentGroupDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.studentGroupService.updateStudentGroup(id, payload)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Delete(":id")
    deleteStudentGroup(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.studentGroupService.deleteStudentGroup(id)
    }
}
