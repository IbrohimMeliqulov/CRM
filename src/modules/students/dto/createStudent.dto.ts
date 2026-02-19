import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsOptional, IsString, ValidateIf } from "class-validator"

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
    @ValidateIf(o => o.first_name !== undefined && o.first_name !== '')
    @IsString()
    first_name: string

    @ApiProperty()
    @ValidateIf(o => o.last_name !== undefined && o.last_name !== '')
    @IsString()
    last_name: string



    @ApiProperty()
    @ValidateIf(o => o.password !== undefined && o.password !== '')
    @IsString()
    password: string



    @ApiProperty()
    @ValidateIf(o => o.phone !== undefined && o.phone !== '')
    @IsString()
    phone: string


    @ApiProperty()
    @ValidateIf(o => o.email !== undefined && o.email !== '')
    @IsEmail()
    email: string


    @ApiProperty()
    @ValidateIf(o => o.birth_date !== undefined && o.birth_date !== '')
    @IsDateString()
    birth_date: string



    @ApiProperty()
    @ValidateIf(o => o.address !== undefined && o.address !== '')
    @IsString()
    address: string
}