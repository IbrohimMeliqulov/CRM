import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, ValidateIf } from "class-validator";

export class createStudentGroupDto {
    @ApiProperty()
    @IsNumber()
    student_id: number


    @ApiProperty()
    @IsNumber()
    group_id: number

}



export class UpdateStudentGroupDto {
    @ApiProperty()
    @ValidateIf(o => o.student_id !== undefined && o.student_id !== '')
    @IsNumber()
    student_id: number


    @ApiProperty()
    @ValidateIf(o => o.group_id !== undefined && o.group_id !== '')
    @IsNumber()
    group_id: number

}