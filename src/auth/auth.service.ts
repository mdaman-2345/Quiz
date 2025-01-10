import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create(username, hashedPassword);
    }

    async login(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user._id };
        return { accessToken: this.jwtService.sign(payload) };
    }
}
