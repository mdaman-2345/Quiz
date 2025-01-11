import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        try {
            return this.authService.register(body.username, body.password);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        try {
            return this.authService.login(body.username, body.password);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
