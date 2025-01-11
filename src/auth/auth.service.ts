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
        try {
            const user = await this.usersService.findByUsername(username);
            if (user) {
                throw new UnauthorizedException("User Already Exist");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.usersService.create(username, hashedPassword);

            return Promise.resolve({ message: (`${username} has been created successfully`) })
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async login(username: string, password: string) {
        try {
            const user = await this.usersService.findByUsername(username);
            if (!user) {
                throw new UnauthorizedException('User doesnot exist');
            }
            if (!(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const payload = { username: user.username, sub: user._id };
            //sharing the token which will stored in cookies or session storage for session management
            return { accessToken: this.jwtService.sign(payload) };
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
