import { ApiProperty } from "@nestjs/swagger"
import { WeekDay } from "@prisma/client"
import { IsDateString, IsEnum, IsNumber, IsString, ValidateIf } from "class-validator"

export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    name: string


    @ApiProperty()
    @IsString()
    description: string


    @ApiProperty()
    @IsNumber()
    course_id: number


    @ApiProperty()
    @IsNumber()
    teacher_id: number


    @ApiProperty()
    @IsNumber()
    room_id: number


    @ApiProperty()
    @IsDateString()
    start_date: string

    @ApiProperty({
        enum: WeekDay,
        isArray: true
    })
    @IsEnum(WeekDay, { each: true })
    week_day: WeekDay[]

    @ApiProperty()
    @IsString()
    start_time: string


    @ApiProperty()
    @IsNumber()
    max_student: number

}



export class UpdateGroupDto {
    @ApiProperty()
    @ValidateIf(o => o.name !== undefined && o.name !== '')
    @IsString()
    name: string


    @ApiProperty()
    @ValidateIf(o => o.description !== undefined && o.description !== '')
    @IsString()
    description: string


    @ApiProperty()
    @ValidateIf(o => o.course_id !== undefined && o.course_id !== '')
    @IsString()
    course_id: number


    @ApiProperty()
    @ValidateIf(o => o.teacher_id !== undefined && o.teacher_id !== '')
    @IsString()
    teacher_id: number


    @ApiProperty()
    @ValidateIf(o => o.room_id !== undefined && o.room_id !== '')
    @IsString()
    room_id: number


    @ApiProperty()
    @ValidateIf(o => o.start_date !== undefined && o.start_date !== '')
    @IsDateString()
    start_date: string

    @ApiProperty({ isArray: true })
    @ValidateIf(o => o.week_day !== undefined && o.week_day !== '')
    @IsEnum(WeekDay)
    week_day: WeekDay[]

    @ApiProperty()
    @ValidateIf(o => o.start_time !== undefined && o.start_time !== '')
    @IsString()
    start_time: string

    @ApiProperty()
    @ValidateIf(o => o.max_student !== undefined && o.max_student !== '')
    @IsNumber()
    max_student: number

}

