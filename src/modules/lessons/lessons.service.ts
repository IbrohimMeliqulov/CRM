import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/create.lesson.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }



    async getAllLessons() {
        const lessons = await this.prisma.lesson.findMany({
            where: { status: "active" }
        })


        return {
            success: true,
            data: lessons
        }
    }


    async teacherOwnLessons(current_user: { id: number, role: string }) {
        const existTeacher = await this.prisma.teacher.findUnique({ where: { id: current_user.id } })
        if (!existTeacher) throw new NotFoundException("teacher not found")

        const teacherLessons = await this.prisma.lesson.findMany({
            where: { teacher_id: current_user.id }
        })

        return {
            success: true,
            data: teacherLessons
        }

    }



    async createLesson(payload: CreateLessonDto, current_user: { id: number, role: string }) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: payload.group_id,
                status: Status.active
            }
        })

        if (!existGroup) {
            throw new NotFoundException()
        }


        if (current_user.role == Role.TEACHER && existGroup.teacher_id != current_user.id) {
            throw new ForbiddenException("bu sizning guruhingiz emas")
        }

        await this.prisma.lesson.create({
            data: {
                ...payload,
                teacher_id: current_user.role == Role.TEACHER ? current_user.id : null,
                user_id: current_user.role != Role.TEACHER ? current_user.id : null
            }
        })

        return {
            success: true,
            message: "Lesson created"
        }
    }



    async updateLesson(lesson_id: number, payload: UpdateLessonDto, current_user: { id: number, role: string }) {
        const existLesson = await this.prisma.lesson.findUnique({
            where: {
                id: lesson_id,
                status: Status.active
            },
        })

        if (!existLesson) throw new NotFoundException()


        if (payload.group_id) {
            const existGroup = await this.prisma.group.findFirst({
                where: { id: payload.group_id }
            })
            if (!existGroup) throw new NotFoundException()

            if (current_user.id != existGroup.teacher_id && current_user.role == Role.TEACHER) {
                throw new ForbiddenException("sizning guruhingiz emas")
            }
        }

        if (current_user.id != existLesson.teacher_id && current_user.role === Role.TEACHER) {
            throw new ForbiddenException("Sizning lessonigniz emas")
        }
        await this.prisma.lesson.update({
            where: { id: lesson_id }, data: {
                group_id: payload.group_id || existLesson.group_id,
                topic: payload.topic || existLesson.topic,
                description: payload.description == "string" ? existLesson.description : payload.description
            }
        })

        return {
            success: true,
            message: "Lesson updated"
        }
    }




    async deleteLesson(id) {
        const existLesson = await this.prisma.lesson.findUnique({
            where: {
                id,
                status: Status.active
            }
        })

        if (!existLesson) throw new NotFoundException()

        await this.prisma.lesson.update({
            where: { id }, data: { status: Status.inactive }
        })

        return {
            success: true,
            message: "Lesson inactivated"
        }
    }
}
