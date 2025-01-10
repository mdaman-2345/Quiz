import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { UsersModule } from './users/user.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
    imports: [
        // Load environment variables
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule globally available
        }),

        // Configure MongooseModule using ConfigService
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'), // Load MongoDB URI from .env
            }),
            inject: [ConfigService],
        }),

        AuthModule,
        GameModule,
        UsersModule,
        QuestionsModule,
    ],
})
export class AppModule { }
