import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuestionsService } from '../questions/questions.service';

interface Game {
    players: string[];
    scores: Record<string, number>;
    currentQuestion: number;
    questions: Question[];
}

interface Question {
    text: string;
    choices: string[];
    correctAnswer: string;
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
    @WebSocketServer() server!: Server;

    private activeGames = new Map<string, Game>();

    constructor(private readonly questionsService: QuestionsService) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('game:start')
    async startGame(client: Socket, data: { player1: string; player2: string }) {
        const gameId = `game-${Date.now()}`;
        const questions = await this.questionsService.getRandomQuestions(6);

        const players = [data.player1, data.player2];

        const game: Game = {
            players,
            scores: { [data.player1]: 0, [data.player2]: 0 },
            currentQuestion: 0,
            questions,
        };

        this.activeGames.set(gameId, game);
        this.server.to(client.id).emit('game:init', { gameId, players });

        this.sendNextQuestion(gameId);
    }

    @SubscribeMessage('answer:submit')
    async handleAnswer(client: Socket, data: { gameId: string; player: string; answer: string }) {
        const game = this.activeGames.get(data.gameId);
        if (!game || game.currentQuestion >= game.questions.length) return; 

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
    }

    private sendNextQuestion(gameId: string) {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        const question = game.questions[game.currentQuestion];

        this.server.emit('question:send', {
            gameId,
            question: { text: question.text, choices: question.choices },
        });
    }

    private endGame(gameId: string) {
        const game = this.activeGames.get(gameId);
        if (!game) return;

        const [player1, player2] = game.players;
        const scores = game.scores;
        const winner =
            scores[player1] > scores[player2] ? player1 : scores[player1] < scores[player2] ? player2 : null;

        this.server.emit('game:end', {
            gameId,
            scores,
            winner,
        });

        this.activeGames.delete(gameId);
    }
}
