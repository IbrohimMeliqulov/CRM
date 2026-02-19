import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create.course.dto';
import { Status } from '@prisma/client';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }



    async createCourse(payload: CreateCourseDto) {
        const existCourse = await this.prisma.course.findUnique({ where: { name: payload.name } })

        if (existCourse) throw new ConflictException()

        await this.prisma.course.create({ data: payload })


        return {
            success: true,
            message: "Course created"
        }
    }


    async getAllCourses() {
        const courses = await this.prisma.course.findMany({ where: { status: Status.active } })

        return {
            success: true,
            data: courses
        }
    }


    async getInactiveCourses() {
        const Inactivecourses = await this.prisma.course.findMany({
            where: { status: Status.inactive },
            select: {
                id: true,
                name: true
            }
        })

        return {
            success: true,
            data: Inactivecourses
        }
    }


    async getOneCourse(id: number) {
        const course = await this.prisma.course.findUnique({ where: { id } })

        if (!course) throw new NotFoundException()
        return {
            success: true,
            data: course
        }
    }


    async updateCourse(id: number, payload: UpdateCourseDto) {
        const existCourse = await this.prisma.course.findUnique({ where: { id } })
        if (!existCourse) throw new NotFoundException()
        await this.prisma.course.update({ where: { id }, data: payload })

        return {
            success: true,
            message: "Course updated"
        }
    }


    async deleteCourse(id: number) {
        const course = await this.prisma.course.findUnique({ where: { id } })
        if (!course) throw new NotFoundException()

        await this.prisma.course.update({ where: { id }, data: { status: Status.inactive } })
        return {
            success: true,
            message: 'Course inactivated'
        }
    }
}
