import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateHomeworkDto, UpdateHomeworkDto } from './dto/create.dto';

@Injectable()
export class HomeworkService {
    constructor(private prisma: PrismaService) { }


    async getOwnHomework(lessonId: number, current_user: { id: number }) {
        const myLessons = await this.prisma.homework.findMany({
            where: {
                lesson_id: lessonId
            },
            select: {
                id: true,
                title: true,
                file: true,
                created_at: true,
                updated_at: true,
                teachers: {
                    select: {
                        id: true,
                        last_name: true,
                        first_name: true,
                        photo: true,
                        phone: true,
                    }
                }, users: {
                    select: {
                        id: true,
                        last_name: true,
                        first_name: true,
                        phone: true,
                        photo: true
                    }
                }
            }
        })

        const homeworkFormated = myLessons.map(el => {
            if (!el.teachers) {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    updated_at: el.updated_at,
                    users: el.users
                }
            } else {
                return {
                    id: el.id,
                    title: el.title,
                    file: el.file,
                    created_at: el.created_at,
                    updated_at: el.updated_at,
                    teachers: el.teachers
                }
            }
        })

        return {
            success: true,
            data: homeworkFormated
        }
    }





    async getAllHomework() {
        const homeworks = await this.prisma.homework.findMany()

        return {
            success: true,
            data: homeworks
        }
    }



    async createHomework(payload: CreateHomeworkDto, current_user: { id: number, role: Role }, filename?: string) {
        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id,
                status: Status.active
            },
            select: {
                groups: {
                    select: {
                        teacher_id: true,
                    }
                }
            }
        })

        if (!existLesson) throw new NotFoundException("Lesson not found")


        if (current_user.role == Role.TEACHER && existLesson.groups.teacher_id != current_user.id) {
            throw new ForbiddenException("sizning darsingiz emas ")
        }
        await this.prisma.homework.create({
            data: {
                ...payload,
                file: filename,
                teacher_id: current_user.role == "TEACHER" ? current_user.id : null,
                user_id: current_user.role != "TEACHER" ? current_user.id : null
            }
        })


        return {
            success: true,
            message: "Homework recorded"
        }
    }


    async updateHomework(
        id: number,
        payload: UpdateHomeworkDto,
        current_user: { id: number; role: Role },
        filename?: string
    ) {
        const existHomework = await this.prisma.homework.findFirst({
            where: { id },
            select: {
                id: true,
                teacher_id: true,
                user_id: true,
            },
        });

        if (!existHomework) {
            throw new NotFoundException("Homework not found");
        }

        if (
            current_user.role === Role.TEACHER &&
            existHomework.teacher_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning uyga vazifangiz emas");
        }

        if (
            current_user.role !== Role.TEACHER &&
            existHomework.user_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning uyga vazifangiz emas");
        }

        await this.prisma.homework.update({
            where: { id },
            data: {
                ...payload,
                ...(filename && { file: filename }),
            },
        });

        return {
            success: true,
            message: "Homework updated",
        };
    }


    async deleteHomework(id: number, current_user: { id: number, role: Role }) {
        const existHomework = await this.prisma.homework.findFirst({
            where: { id },
            select: {
                id: true,
                teacher_id: true,
                user_id: true,
            },
        });

        if (!existHomework) {
            throw new NotFoundException("Homework not found");
        }

        if (
            current_user.role === Role.TEACHER &&
            existHomework.teacher_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning uyga vazifangiz emas");
        }

        if (
            current_user.role !== Role.TEACHER &&
            existHomework.user_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning uyga vazifangiz emas");
        }

        await this.prisma.homework.delete({
            where: { id }
        })

        return {
            success: true,
            message: "Homework deleted successfully"
        }
    }
}
