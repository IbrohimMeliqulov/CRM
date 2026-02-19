import { ApiProperty } from "@nestjs/swagger";
import { IsString, ValidateIf } from "class-validator";

export class CreateRoomDto {
    @ApiProperty()
    @IsString()
    name: string
}


export class UpdateRoomDto {
    @ApiProperty()
    @ValidateIf(o => o.name !== undefined && o.name !== '')
    @IsString()
    name: string
}