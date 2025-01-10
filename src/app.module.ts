import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { UsersModule } from './users/user.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/quizgame'),
        AuthModule,
        GameModule,
        UsersModule,
        QuestionsModule,
    ],
})
export class AppModule { }
