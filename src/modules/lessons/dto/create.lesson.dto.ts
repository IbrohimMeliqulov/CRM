import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"

export class CreateLessonDto {
    @ApiProperty()
    @IsNumber()
    group_id: number


    @ApiProperty()
    @IsString()
    topic: string


    @ApiPropertyOptional()
    @IsString()
    description: string
}



export class UpdateLessonDto {
    @ApiPropertyOptional()
    @ValidateIf(o => o.group_id !== undefined && o.group_id !== '')
    @IsNumber()
    group_id?: number


    @ApiProperty()
    @ValidateIf(o => o.topic !== undefined && o.topic !== '')
    @IsString()
    topic?: string


    @ApiProperty()
    @ValidateIf(o => o.description !== undefined && o.description !== '')
    @IsString()
    description?: string
}