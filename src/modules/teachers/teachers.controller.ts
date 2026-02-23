import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/createTeacher.dto';



@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teacherService: TeachersService) { }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                first_name: { type: "string", example: 'nimadir' },
                last_name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phone: { type: "string" },
                photo: { type: "string", format: 'binary' },
                address: { type: "string" },
            }
        }
    })
    @UseInterceptors(FileInterceptor("photo", {
        storage: diskStorage({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpeg", "jpg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post()
    createTeacher(
        @Body() payload: CreateTeacherDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.teacherService.createTeacher(payload, file?.filename)
    }





    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllTeachers() {
        return this.teacherService.getAllTeachers()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("inactive")
    getAllInactiveTeachers() {
        return this.teacherService.getAllInactiveTeachers()
    }


    @ApiOperation({
        summary: `${Role.TEACHER}`,
        description: "Bu urlga teacherni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.TEACHER)
    @Get("groups")
    teacherGroups(@Req() req: Request) {
        return this.teacherService.teacherGroups(req)
    }


    @ApiOperation({
        summary: `${Role.TEACHER}`,
        description: "Bu urlga teacherni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.TEACHER)
    @Get("single/:groupId")
    singleGroup(
        @Req() req: Request,
        @Param("groupId", ParseIntPipe) groupId: number) {
        return this.teacherService.singleGroup(groupId, req)
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get(":id")
    getOneTeacher(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.teacherService.getOneTeacher(id)
    }





    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Put(":id")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                first_name: { type: "string", example: 'nimadir' },
                last_name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phone: { type: "string" },
                photo: { type: "string", format: 'binary' },
                address: { type: "string" },
            }
        }
    })
    @UseInterceptors(FileInterceptor("photo", {
        storage: diskStorage({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpeg", "jpg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    updateTeacher(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateTeacherDto,
        @UploadedFile() file: Express.Multer.File

    ) {
        return this.teacherService.updateTeacher(id, payload, file.filename)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(":id")
    deleteTeacher(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.teacherService.deleteTeacher(id)
    }

}
