import { ApiProperty } from "@nestjs/swagger";
import { StaffStatus } from "@prisma/client";
import { IsEmail, IsEnum, IsMobilePhone, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsString()
    firstname: string

    @ApiProperty()
    @IsString()
    lastname: string

    @ApiProperty()
    @IsStrongPassword()
    password: string

    @ApiProperty()
    @IsString()
    position: string

    @ApiProperty()
    @IsMobilePhone("uz-UZ")
    phone: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    address: string

    @ApiProperty()
    @IsEnum(StaffStatus)
    @IsString()
    status: StaffStatus
}