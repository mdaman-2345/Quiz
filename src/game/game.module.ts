import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { QuestionsModule } from '../questions/questions.module';
import { GameController } from './game.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
    imports: [QuestionsModule], // Import the QuestionsModule to use its service
    providers: [GameGateway, AuthMiddleware], // Add GameGateway as a provider
    controllers: [GameController]
})
export class GameModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*'); 
    }
}