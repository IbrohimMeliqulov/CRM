import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateStudent, UpdateStudent } from './dto/createStudent.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';



@ApiBearerAuth()
@Controller('students')
export class StudentsController {
    constructor(private readonly studentService: StudentsService) { }


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
                birth_date: { type: 'string', format: 'date', example: '2000-01-01' }
            }
        }
    })
    @UseInterceptors(FileInterceptor("photo", {
        storage: diskStorage({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = new Date() + "." + file.mimetype.split("/")[1]
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
    createStudent(
        @Body() payload: CreateStudent,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.studentService.createStudent(payload, file?.filename)
    }





    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllStudents() {
        return this.studentService.getAllStudents()
    }







    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("one/:id")
    getOneStudent(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.studentService.getOneStudent(id)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("inactive")
    getInactiveStudents() {
        return this.studentService.getInactiveStudents()
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
                birth_date: { type: 'string', format: 'date', example: '2000-01-01' }
            }
        }
    })
    @UseInterceptors(FileInterceptor("photo", {
        storage: diskStorage({
            destination: "./src/uploads",
            filename: (req, file, cb) => {
                const filename = new Date() + "." + file.mimetype.split("/")[1]
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
    updateStudent(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateStudent,
        @UploadedFile() file?: Express.Multer.File

    ) {
        return this.studentService.updateStudent(id, payload, file?.filename)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`,
        description: "Bu urlga superadminni va adminni huquqi bor"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(":id")
    deleteStudent(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.studentService.deleteStudent(id)
    }

}
