import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsString } from "class-validator"

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