import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { QuestionsModule } from '../questions/questions.module';
import { GameController } from './game.controller';

@Module({
    imports: [QuestionsModule], // Import the QuestionsModule to use its service
    providers: [GameGateway], // Add GameGateway as a provider
    controllers: [GameController]
})
export class GameModule { }
