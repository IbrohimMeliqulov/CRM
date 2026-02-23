import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateHomeworkDto, UpdateHomeworkDto } from './dto/create.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';


@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("all")
    getAllHomework() {
        return this.homeworkService.getAllHomework()
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                lesson_id: { type: "number " },
                group_id: { type: "number " },
                file: { type: "string", format: "binary" },
                title: { type: "string" }
            }
        }
    })
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./src/uploads/files",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        })
    }))
    @Post()
    createHomework(
        @Req() req: Request,
        @Body() payload: CreateHomeworkDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.homeworkService.createHomework(payload, req["user"], file?.filename)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                lesson_id: { type: "number " },
                group_id: { type: "number " },
                file: { type: "string", format: "binary" },
                title: { type: "string" }
            }
        }
    })
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./src/uploads/files",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        })
    }))
    @Put(":id")
    udpateHomework(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateHomeworkDto,
        @Req() req: Request,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.homeworkService.updateHomework(id, payload, req["user"], file?.filename)
    }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(":id")
    deleteHomework(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        return this.homeworkService.deleteHomework(id, req["user"])
    }

}
