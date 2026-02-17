import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateStudent } from './dto/createStudent.dto';
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
    @Get()
    getAllStudents() {
        this.studentService.getAllStudents()
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
                birth_date: { type: 'string', format: 'date', example: '2000-01-01' }
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
        })
    }))
    @Post()
    createStudent(
        @Body() payload: CreateStudent,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.studentService.createStudent(payload, file.filename)
    }

}
