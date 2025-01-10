import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/user.module'; 
import { JwtModule } from '@nestjs/jwt'; 

@Module({
    imports: [
        UsersModule, 
        JwtModule.register({ secret: 'your-secret-key', signOptions: { expiresIn: '1h' } })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
