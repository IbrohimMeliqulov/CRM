import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, IsStrongPassword, ValidateIf } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsString()
    first_name: string

    @ApiProperty()
    @IsString()
    last_name: string

    @ApiProperty()
    @IsStrongPassword()
    password: string

    @ApiProperty()
    @IsMobilePhone("uz-UZ")
    phone: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    address: string


    @ApiProperty({ type: "string", format: "binary", required: false })
    @IsOptional()
    photo?: any;

}



export class UpdateUserDto {
    @ApiProperty()
    @ValidateIf(o => o.first_name !== undefined && o.first_name !== '')
    @IsString()
    first_name?: string

    @ApiProperty()
    @ValidateIf(o => o.last_name !== undefined && o.last_name !== '')
    @IsString()
    last_name?: string

    @ApiProperty()
    @ValidateIf(o => o.password !== undefined && o.password !== '')
    @IsStrongPassword()
    password?: string

    @ApiProperty()
    @ValidateIf(o => o.phone !== undefined && o.phone !== '')
    @IsMobilePhone("uz-UZ")
    phone?: string

    @ApiProperty()
    @ValidateIf(o => o.email !== undefined && o.email !== '')
    @IsEmail()
    email?: string

    @ApiProperty()
    @ValidateIf(o => o.address !== undefined && o.address !== '')
    @IsString()
    address?: string
}