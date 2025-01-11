import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionsService } from '../questions/questions.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private activeGames = new Map<string, any>();

    constructor(private readonly questionsService: QuestionsService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('game:start')
    async startGame(client: Socket, data: { player1: string; player2: string }) {
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

            // Notify players that the game has started
            this.server.emit('game:init', { gameId, players: [data.player1, data.player2] });

            this.sendNextQuestion(gameId);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    @SubscribeMessage('answer:submit')
    async handleAnswer(client: Socket, data: { gameId: string; player: string; answer: string }) {
        try {
            const game = this.activeGames.get(data.gameId);
            if (!game) return;

            const currentQuestion = game.questions[game.currentQuestion];
            if (data.answer === currentQuestion.correctAnswer) {
                game.scores[data.player]++;
            }

            if (game.currentQuestion < game.questions.length - 1) {
                game.currentQuestion++;
                this.sendNextQuestion(data.gameId);
            } else {
                this.endGame(data.gameId);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private sendNextQuestion(gameId: string) {
        try {
            const game = this.activeGames.get(gameId);
            if (!game) return;

            const question = game.questions[game.currentQuestion];
            this.server.emit('question:send', {
                gameId,
                question: { text: question.text, choices: question.choices },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private endGame(gameId: string) {
        try {
            const game = this.activeGames.get(gameId);
            if (!game) return;

            const winner =
                game.scores[game.players[0]] > game.scores[game.players[1]]
                    ? game.players[0]
                    : game.scores[game.players[0]] < game.scores[game.players[1]]
                        ? game.players[1]
                        : null;

            this.server.emit('game:end', {
                gameId,
                scores: game.scores,
                winner,
            });

            this.activeGames.delete(gameId);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
