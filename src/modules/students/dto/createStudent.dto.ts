import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator"

export class CreateStudent {

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
    @IsDateString()
    birth_date: string



    @ApiProperty()
    @IsString()
    address: string
}



export class UpdateStudent {

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
    @IsDateString()
    birth_date: string



    @ApiProperty()
    @IsOptional()
    @IsString()
    address: string
}