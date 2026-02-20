import { ApiProperty } from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { IsDecimal, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

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
    @ValidateIf(o => o.name !== undefined && o.name !== '')
    @IsString()
    name?: string


    @ApiProperty()
    @ValidateIf(o => o.description !== undefined && o.description !== '')
    @IsString()
    description?: string



    @ApiProperty()
    @ValidateIf(o => o.price !== undefined && o.price !== '')
    @IsNumber()
    price?: number



    @ApiProperty()
    @ValidateIf(o => o.duration_month !== undefined && o.duration_month !== '')
    @IsNumber()
    duration_month?: number


    @ApiProperty()
    @ValidateIf(o => o.duration_hours !== undefined && o.duration_hours !== '')
    @IsNumber()
    duration_hours?: number


    @ApiProperty({
        enum: CourseLevel,
        enumName: 'CourseLevel',
        example: CourseLevel.beginner
    })
    @ValidateIf(o => o.level !== undefined && o.level !== '')
    @IsEnum(CourseLevel)
    level?: CourseLevel
}