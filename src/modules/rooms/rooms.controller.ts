import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateRoomDto, UpdateRoomDto } from './dto/create.room.dto';



@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }



    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get()
    getAllRooms() {
        return this.roomsService.getAllRooms()
    }





    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get(":id")
    getOneRoom(@Param("id", ParseIntPipe) id: number) {
        return this.roomsService.getOneRoom(id)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get("inactive")
    getInactiveRooms() {
        return this.roomsService.getInactiveRooms()
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Post()
    createRoom(
        @Body() payload: CreateRoomDto
    ) {
        return this.roomsService.createRoom(payload)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Put(":id")
    updateRoom(@Body() payload: UpdateRoomDto,
        @Param("id", ParseIntPipe) id: number) {
        return this.roomsService.updateRoom(id, payload)
    }




    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Delete(":id")
    deleteRoom(@Param("id", ParseIntPipe) id: number) {
        return this.roomsService.deleteRoom(id)
    }

}
