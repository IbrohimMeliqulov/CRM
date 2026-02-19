import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto, UpdateUserDto } from './dto/register.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }



    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
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
    @Post("createAdmin")
    createAdmin(@Body() payload: RegisterDto,
        @UploadedFile() file?: Express.Multer.File) {
        return this.userService.createAdmin(payload, file?.filename)
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


    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN)
    @Get("inactive")
    getInactiveAdmins() {
        return this.userService.getInactiveAdmins()
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get(":id")
    getOneAdmin(
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.userService.getOneAdmin(id)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
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
    updateAdmin(
        @Body() payload: UpdateUserDto,
        @Param("id", ParseIntPipe) id: number,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.userService.updateAdmin(id, payload, file?.filename)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Delete(":id")
    deleteAdmin(@Param("id", ParseIntPipe) id: number) {
        return this.userService.deleteAdmin(id)
    }

}
