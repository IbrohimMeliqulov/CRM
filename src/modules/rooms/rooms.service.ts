import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/create.room.dto';
import { Status } from '@prisma/client';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) { }



    async getAllRooms() {
        const rooms = await this.prisma.room.findMany({
            where: {
                status: Status.active
            }
        })
        return {
            success: true,
            data: rooms
        }
    }



    async getOneRoom(id: number) {
        const room = await this.prisma.room.findUnique({ where: { id } })

        if (!room) {
            throw new NotFoundException()
        }
        return {
            success: true,
            data: room
        }
    }

    async getInactiveRooms() {
        const inactiveRooms = await this.prisma.room.findMany({
            where: { status: Status.inactive }
        })

        return {
            success: true,
            data: inactiveRooms
        }
    }



    async createRoom(payload: CreateRoomDto) {


        const existRoom = await this.prisma.room.findUnique({
            where: { name: payload.name }
        })
        if (existRoom) {
            throw new ConflictException("Room already exists")
        }

        await this.prisma.room.create({ data: payload })



        return {
            success: true,
            message: "Room created"
        }
    }


    async updateRoom(id: number, payload: UpdateRoomDto) {
        const existRoom = await this.prisma.room.findUnique({ where: { id } })
        if (!existRoom) throw new NotFoundException()


        await this.prisma.room.update({ where: { id }, data: payload })
    }



    async deleteRoom(id: number) {
        const existRoom = await this.prisma.room.findUnique({ where: { id } })
        if (!existRoom) throw new NotFoundException()

        await this.prisma.room.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Room inactivated"
        }
    }


}
