import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/createTeacher.dto';



@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
    constructor(private teacherService: TeachersService) { }



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
    @UseInterceptors(FileInterceptor("photo ", {
        storage: diskStorage({
            destination: "./src/uplaods",
            filename: (req, file, cb) => {
                const filename = new Date() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post()
    createStudent(
        @Body() payload: CreateTeacherDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.teacherService.createTeacher(payload, file.filename)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllTeachers() {
        this.teacherService.getAllTeachers()
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get(":id")
    getOneStudent(
        @Param("id", ParseIntPipe) id: number
    ) {
        this.teacherService.getOneTeacher(id)
    }









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
    @UseInterceptors(FileInterceptor("photo ", {
        storage: diskStorage({
            destination: "./src/uplaods",
            filename: (req, file, cb) => {
                const filename = new Date() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @Put(":id")
    updateTeacher(@Body() payload: UpdateTeacherDto,
        @Param("id", ParseIntPipe) id: number,
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
    deleteTeacher(@Param("id", ParseIntPipe) id: number) {
        return this.teacherService.deleteTeacher(id)
    }
}
