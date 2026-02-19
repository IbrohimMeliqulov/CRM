import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateGroupDto, UpdateGroupDto } from './dto/create.group.dto';
import { GroupsFilterDto } from './dto/search.query';


@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupService: GroupsService) { }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Post()
    createGroup(@Body() payload: CreateGroupDto) {
        return this.groupService.createGroup(payload)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get("all")
    getAllGroups(
        @Query() search: GroupsFilterDto
    ) {
        return this.groupService.getAllGroups(search)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get("inactive")
    getInactiveGroups() {
        return this.groupService.getInactiveGroups()
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get("one/students/:id")
    getOneGroup(@Param("id", ParseIntPipe) id: number) {
        return this.groupService.getOneGroup(id)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Put(":id")
    updateGroup(@Body() payload: UpdateGroupDto,
        @Param("id", ParseIntPipe) id: number) {
        return this.groupService.updateGroup(id, payload)
    }


    @ApiOperation({
        summary: `${Role.SUPERADMIN},${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Delete(":id")
    deleteGroup(@Param("id", ParseIntPipe) id: number) {
        return this.groupService.deleteGroup(id)
    }
}
