import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) { }

    @Get(':username')
    async findUser(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }
}
