import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";


export class LoginDto {
    @ApiProperty({ example: "978483355" })
    @IsMobilePhone("uz-UZ")
    phone: string


    @ApiProperty({ example: "Ibrohim2823!" })
    @IsString()
    password: string
}