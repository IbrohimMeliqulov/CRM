import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateHomeworkDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    lesson_id: number

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    group_id: number

    @ApiProperty()
    @IsString()
    title: string
}


export class UpdateHomeworkDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    lesson_id?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    group_id?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string
}