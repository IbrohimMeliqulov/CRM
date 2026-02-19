import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/create.group.dto';
import { GroupStatus, Status } from '@prisma/client';
import { GroupsFilterDto } from './dto/search.query';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) { }

    async createGroup(payload: CreateGroupDto) {

        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(":").map(Number)
            return h * 60 + m
        }

        const existRoom = await this.prisma.room.findFirst({
            where: {
                id: payload.room_id,
                status: Status.active
            }
        })

        if (!existRoom) {
            throw new NotFoundException("Room is not found with this id")
        }

        const existCourse = await this.prisma.course.findFirst({
            where: {
                id: payload.course_id,
                status: Status.active
            }
        })

        if (!existCourse) {
            throw new NotFoundException("Course is not found or inactive with this id")
        }

        const existGroup = await this.prisma.group.findUnique({ where: { name: payload.name } })

        if (existGroup) throw new ConflictException()

        const existTeacher = await this.prisma.teacher.findFirst({
            where: {
                id: payload.teacher_id,
                status: Status.active
            }
        })

        if (!existTeacher) {
            throw new NotFoundException("Teacher is not found with this id")
        }

        const startNew = timeToMinutes(payload.start_time)
        const endNew = startNew + existCourse.duration_hours * 60

        const roomGroups = await this.prisma.group.findMany({
            where: {
                room_id: payload.room_id,
                status: Status.active
            },
            select: {
                start_time: true,
                courses: {
                    select: {
                        duration_hours: true
                    }
                }
            }
        })

        const isRoomBusy = roomGroups.some(el => {
            const start = timeToMinutes(el.start_time)
            const end = start + el.courses.duration_hours * 60

            return start < endNew && end > startNew
        })

        if (isRoomBusy) {
            throw new ConflictException("Room is busy at this time")
        }


        await this.prisma.group.create({
            data: {
                ...payload,
                start_date: new Date(payload.start_date)
            }
        })

        return {
            success: true,
            message: "Group created"
        }
    }

    async getInactiveGroups() {
        const InactiveGroups = await this.prisma.group.findMany({
            where: { status: GroupStatus.completed }

        })

        return {
            success: true,
            data: InactiveGroups
        }
    }



    async getAllGroups(search: GroupsFilterDto) {
        const { name, max_student } = search
        let where = {
            status: Status.active
        }

        if (name) {
            where["name"] = name
        }

        if (max_student) {
            where["max_student"] = max_student
        }
        const groups = await this.prisma.group.findMany({
            where,
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                courses: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                teachers: {
                    select: {
                        id: true,
                        first_name: true
                    }
                }
            }
        })
        return {
            success: true,
            data: groups
        }
    }

    async getOneGroup(id: number) {
        const existGroup = await this.prisma.group.findUnique({
            where:
            {
                id,
                status: Status.active
            }
        })


        if (!existGroup) throw new NotFoundException("Group not found with this id")

        const groupStudents = await this.prisma.studentGroup.findMany({
            where: {
                group_id: id,
                status: Status.active
            },
            select: {
                students: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone: true,
                        email: true,
                        photo: true,
                        birth_date: true,
                        created_at: true
                    }
                }
            }
        })

        const dataFormatter = groupStudents.map(el => el.students)


        return {
            success: true,
            data: dataFormatter
        }
    }

    async updateGroup(id: number, payload: UpdateGroupDto) {
        const existGroup = await this.prisma.group.findUnique({ where: { id } })
        if (!existGroup) throw new NotFoundException("Group with this id not found")
        await this.prisma.group.update({ where: { id }, data: payload })
        return {
            success: true,
            message: "Group updated"
        }
    }

    async deleteGroup(id: number) {
        const existGroup = await this.prisma.group.findUnique({ where: { id } })
        if (!existGroup) throw new NotFoundException("Group with this id not found")
        await this.prisma.group.update({ where: { id }, data: { status: GroupStatus.completed } })
        return {
            success: true,
            message: "Group completed"
        }
    }
}
