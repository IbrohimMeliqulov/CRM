import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator"

export class CreateTeacherDto {

    @ApiProperty()
    @IsString()
    first_name: string

    @ApiProperty()
    @IsString()
    last_name: string



    @ApiProperty()
    @IsString()
    password: string



    @ApiProperty()
    @IsString()
    phone: string


    @ApiProperty()
    @IsEmail()
    email: string


    @ApiProperty()
    @IsString()
    address: string

}



export class UpdateTeacherDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    first_name: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    last_name: string



    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string



    @ApiProperty()
    @IsOptional()
    @IsString()
    phone: string


    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string


    @ApiProperty()
    @IsOptional()
    @IsString()
    address: string

}