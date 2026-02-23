import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional } from "class-validator"

export class CreateAttendanceDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    lesson_id: number


    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    student_id: number


    @ApiProperty()
    @IsBoolean()
    isPresent: boolean
}


export class UpdateAttendanceDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    lesson_id?: number


    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    student_id?: number


    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isPresent?: boolean
}