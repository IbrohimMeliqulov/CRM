import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }


    @Post("createAdmin")
    createAdmin(@Body() payload: RegisterDto) {
        return this.userService.createAdmin(payload)
    }

}
