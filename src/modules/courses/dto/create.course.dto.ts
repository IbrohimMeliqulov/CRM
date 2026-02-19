import { ApiProperty } from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { IsDecimal, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum courseLevel {
    beginner = "beginner",
    intermediate = "intermediate",
    advanced = "advanced"
}



export class CreateCourseDto {
    @ApiProperty()
    @IsString()
    name: string



    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string



    @ApiProperty()
    @IsNumber()
    price: number




    @ApiProperty()
    @IsNumber()
    duration_month: number



    @ApiProperty()
    @IsNumber()
    duration_hours: number



    @ApiProperty({
        description: "Course level",
        enum: courseLevel,
        default: courseLevel.beginner

    })
    @IsEnum(courseLevel)
    level: courseLevel

}


export class UpdateCourseDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string


    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string



    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number



    @ApiProperty()
    @IsOptional()
    @IsNumber()
    duration_month: number


    @ApiProperty()
    @IsOptional()
    @IsNumber()
    duration_hours: number


    @ApiProperty({
        enum: CourseLevel,
        enumName: 'CourseLevel',
        example: CourseLevel.beginner
    })
    @IsOptional()
    @IsEnum(CourseLevel)
    level: CourseLevel
}