import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateLessonDto, UpdateLessonDto } from './dto/create.lesson.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';



@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonService: LessonsService) { }

    @ApiOperation({
        summary: `${Role.STUDENT}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get("my/group/:groupId")
    getMyGroupLessons(
        @Param("groupId", ParseIntPipe) groupId: number,
        @Req() req: Request
    ) {
        return this.lessonService.getMyGroupLessons(groupId, req["user"])
    }





    @ApiOperation({
        summary: `${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get()
    getAllLessons() {
        return this.lessonService.getAllLessons()
    }


    @ApiOperation({
        summary: `${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.TEACHER)
    @Get("teacher")
    teacherOwnLessons(
        @Req() req: Request
    ) {
        return this.lessonService.teacherOwnLessons(req['user'])
    }


    @ApiOperation({
        summary: `${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
    @Post()
    createLesson(
        @Body() payload: CreateLessonDto,
        @Req() req: Request
    ) {
        return this.lessonService.createLesson(payload, req['user'])
    }


    @ApiOperation({
        summary: `${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
    @Put(":id")
    updateLesson(
        @Body() payload: UpdateLessonDto,
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.lessonService.updateLesson(id, payload, req['user'])
    }


    @ApiOperation({
        summary: `${Role.ADMIN},${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
    @Delete(":id")
    deleteLesson(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.lessonService.deleteLesson(id)
    }
}
