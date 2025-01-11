import { Controller, Post, Body } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { QuestionsService } from '../questions/questions.service';

@Controller('game')
export class GameController {
    constructor(
        private readonly gameGateway: GameGateway,
        private readonly questionsService: QuestionsService,
    ) { }

    @Post('start')
    async startGame(@Body() data: { player1: string; player2: string }) {
        try {
            const gameId = `game-${Date.now()}`;
            const questions = await this.questionsService.getQuestions();

            const game = {
                players: [data.player1, data.player2],
                scores: { [data.player1]: 0, [data.player2]: 0 },
                currentQuestion: 0,
                questions,
            };

            // Notify players via WebSocket (using GameGateway)
            this.gameGateway.activeGames.set(gameId, game); 
            this.gameGateway.server.emit('game:init', {
                gameId,
                players: game.players,
            });

            return {
                message: 'Game started successfully.',
                gameId,
                players: game.players,
                questions: questions.map((q) => ({ text: q.text, choices: q.choices })),
            };
        } catch (err) {
            return {
                message: 'Failed to start game.',
                error: err
            };
        }
    }
}
