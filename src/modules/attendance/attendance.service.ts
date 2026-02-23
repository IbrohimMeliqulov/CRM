import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/create.attendance.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }


    async getAllAttendances() {
        const attendances = await this.prisma.attendance.findMany()

        return {
            success: true,
            data: attendances
        }
    }


    async createAttendance(payload: CreateAttendanceDto, current_user: { id: number, role: Role }) {
        const week = {
            "1": "MONDAY",
            "2": "TUESDAY",
            "3": "WEDNESDAY",
            "4": "THURSDAY",
            "5": "FRIDAY",
            "6": "SATURDAY",
            "7": "SUNDAY"
        }
        const lessonGroup = await this.prisma.lesson.findFirst({
            where: {
                id: payload.lesson_id
            },
            select: {
                created_at: true,
                groups: {
                    select: {
                        start_time: true,
                        start_date: true,
                        week_day: true,
                        teacher_id: true,
                        courses: {
                            select: {
                                duration_hours: true
                            }
                        },
                        studentGroups: {
                            where: {
                                student_id: payload.student_id,
                                status: Status.active
                            }
                        }

                    }
                }
            }
        })

        if (!lessonGroup?.groups.studentGroups.length) {
            throw new BadRequestException("Student not found from this group")
        }

        if (current_user.role == Role.TEACHER && lessonGroup?.groups.teacher_id != current_user.id) {
            throw new ForbiddenException("sizning darsingiz emas ")
        }
        const week_day = [lessonGroup?.groups.week_day]
        const nowDate = new Date()
        const day = nowDate.getDay()

        if (!week_day?.includes(week[day])) {
            throw new BadRequestException("Dars kuni hali boshlanmadi")
        }

        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(":").map(Number)
            return h * 60 + m
        }


        const startMinute = timeToMinutes(lessonGroup!.groups.start_time)
        const endMinute = startMinute + lessonGroup!.groups.courses.duration_hours * 60
        const nowMinute = nowDate.getHours() * 60 + nowDate.getMinutes()

        if (lessonGroup.created_at.getTime() < Date.now() && startMinute > nowMinute) {
            throw new BadRequestException("Dars hali boshlanmadi")
        }



        if (!(startMinute < nowMinute && endMinute > nowMinute) && current_user.role != "TEACHER") {
            throw new BadRequestException("Dars vaqtidan tashqari davomat qilib bo'lmaydi")
        }
        await this.prisma.attendance.create({
            data: {
                ...payload,
                teacher_id: current_user.role == "TEACHER" ? current_user.id : null,
                user_id: current_user.role != "TEACHER" ? current_user.id : null
            }
        })


        return {
            success: true,
            message: "Attendance recorded"
        }
    }


    async updateAttendance(
        id: number,
        payload: UpdateAttendanceDto,
        current_user: { id: number; role: Role }
    ) {
        const attendance = await this.prisma.attendance.findFirst({
            where: { id },
            select: {
                id: true,
                teacher_id: true,
                user_id: true,
                lessons: {
                    select: {
                        created_at: true,
                        groups: {
                            select: {
                                start_time: true,
                                week_day: true,
                                teacher_id: true,
                                courses: {
                                    select: {
                                        duration_hours: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!attendance) {
            throw new BadRequestException("Attendance not found");
        }

        if (
            current_user.role === Role.TEACHER &&
            attendance.lessons.groups.teacher_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning darsingiz emas");
        }

        if (
            current_user.role !== Role.TEACHER &&
            attendance.user_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning davomatingiz emas");
        }

        const week: Record<string, string> = {
            "1": "MONDAY",
            "2": "TUESDAY",
            "3": "WEDNESDAY",
            "4": "THURSDAY",
            "5": "FRIDAY",
            "6": "SATURDAY",
            "7": "SUNDAY",
        };

        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };

        const nowDate = new Date();
        const day = String(nowDate.getDay());
        const week_day = attendance.lessons.groups.week_day;

        if (week_day !== week[day]) {
            throw new BadRequestException("Dars kuni hali boshlanmadi");
        }

        const startMinute = timeToMinutes(attendance.lessons.groups.start_time);
        const endMinute = startMinute + attendance.lessons.groups.courses.duration_hours * 60;
        const nowMinute = nowDate.getHours() * 60 + nowDate.getMinutes();

        if (
            !(startMinute < nowMinute && endMinute > nowMinute) &&
            current_user.role !== Role.TEACHER
        ) {
            throw new BadRequestException(
                "Dars vaqtidan tashqari davomatni o'zgartirib bo'lmaydi"
            );
        }

        await this.prisma.attendance.update({
            where: { id },
            data: {
                ...payload,
            },
        });

        return {
            success: true,
            message: "Attendance updated",
        };
    }



    async deleteAttendance(id: number, current_user: { id: number, role: Role }) {
        const existAttendance = await this.prisma.attendance.findUnique({
            where: { id },
            select: {
                id: true,
                teacher_id: true,
                user_id: true,
                lessons: {
                    select: {
                        created_at: true,
                        groups: {
                            select: {
                                start_time: true,
                                week_day: true,
                                teacher_id: true,
                                courses: {
                                    select: {
                                        duration_hours: true,
                                    },
                                },
                            },
                        },
                    },
                },
            }
        })


        if (!existAttendance) {
            throw new BadRequestException("Attendance not found");
        }

        if (
            current_user.role === Role.TEACHER &&
            existAttendance.lessons.groups.teacher_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning darsingiz emas");
        }

        if (
            current_user.role !== Role.TEACHER &&
            existAttendance.user_id !== current_user.id
        ) {
            throw new ForbiddenException("Bu sizning davomatingiz emas");
        }

        await this.prisma.attendance.delete({
            where: { id }
        })
        return {
            success: true,
            message: "Attendance deleted"
        }
    }
}
