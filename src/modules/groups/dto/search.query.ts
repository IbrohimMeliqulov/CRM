import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GroupsFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    name: string


    @ApiPropertyOptional()
    @IsOptional()
    max_student: number

}