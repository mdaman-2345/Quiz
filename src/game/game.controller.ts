import { Controller, Post, Body } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';

@Controller('game')
export class GameController {
    private activeGames = new Map<string, any>();

    constructor(private readonly questionsService: QuestionsService) { }

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

            this.activeGames.set(gameId, game);

            return {
                message: 'Game started successfully.',
                gameId,
                players: [data.player1, data.player2],
                questions: questions.map((q) => ({ text: q.text, choices: q.choices })),
            };
        } catch (err) {
            return Promise.reject(err);
        }
    }

}
