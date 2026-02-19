import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { createStudentGroupDto, UpdateStudentGroupDto, } from '../dto/create.groups.dto';
import { Status } from '@prisma/client';

@Injectable()
export class StudentGroupService {
    constructor(private prisma: PrismaService) { }


    async createStudentGroup(payload: createStudentGroupDto) {
        const existStudent = await this.prisma.student.findFirst({ where: { id: payload.student_id, status: Status.active } })
        if (!existStudent) throw new NotFoundException("Student with this id not found")


        const existGroup = await this.prisma.group.findFirst({ where: { id: payload.group_id, status: Status.active } })

        if (!existGroup) throw new NotFoundException("Group with this id not found")
        await this.prisma.studentGroup.create({ data: payload })


        const existGroupStudent = await this.prisma.studentGroup.findFirst({
            where: {
                student_id: payload.student_id,
                group_id: payload.group_id,
                status: Status.active
            }
        })


        if (existGroupStudent) {
            throw new ConflictException("student is already in the group")
        }

        const existGroupStudentCount = await this.prisma.studentGroup.count({
            where: { group_id: payload.group_id }
        })

        if (existGroupStudentCount >= existGroup.max_student) {
            throw new BadRequestException("Group is full")
        }


        return {
            success: true,
            message: "Student added to the group"
        }
    }

    async getAllStudentGroups() {
        const studentGroups = await this.prisma.studentGroup.findMany({
            where:
            {
                status: Status.active
            }, include: {
                groups: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            data: studentGroups
        }
    }


    async getInactiveStudentGroups() {
        const inactiveStudentGroups = await this.prisma.studentGroup.findMany({
            where: { status: Status.inactive }
        })

        return {
            success: true,
            data: inactiveStudentGroups
        }
    }

    async getOneStudentGroup(id: number) {
        const existStudentGroup = await this.prisma.studentGroup.findUnique({ where: { id } })

        if (!existStudentGroup) throw new NotFoundException()

        return {
            success: true,
            data: existStudentGroup
        }
    }


    async updateStudentGroup(id: number, payload: UpdateStudentGroupDto) {
        const existGroupStudent = await this.prisma.studentGroup.findUnique({ where: { id } })
        if (!existGroupStudent) {
            throw new NotFoundException()
        }

        await this.prisma.studentGroup.update({ where: { id }, data: payload })
        return {
            success: true,
            message: "StudentGroup updated"
        }
    }


    async deleteStudentGroup(id: number) {
        const existGroupStudent = await this.prisma.studentGroup.findUnique({ where: { id } })

        if (!existGroupStudent) throw new NotFoundException()

        await this.prisma.studentGroup.update({ where: { id }, data: { status: Status.inactive } })

        return {
            success: true,
            message: "Student Group inactivated"
        }
    }

}
