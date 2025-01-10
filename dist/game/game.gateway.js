"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const questions_service_1 = require("../questions/questions.service");
let GameGateway = class GameGateway {
    constructor(questionsService) {
        this.questionsService = questionsService;
        this.activeGames = new Map();
    }
    async handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    async startGame(client, data) {
        const gameId = `game-${Date.now()}`;
        const questions = await this.questionsService.getRandomQuestions(6);
        const players = [data.player1, data.player2]; // Fix 2: Create a players array
        const game = {
            players,
            scores: { [data.player1]: 0, [data.player2]: 0 },
            currentQuestion: 0,
            questions,
        };
        this.activeGames.set(gameId, game);
        this.server.to(client.id).emit('game:init', { gameId, players });
        this.sendNextQuestion(gameId);
    }
    async handleAnswer(client, data) {
        const game = this.activeGames.get(data.gameId);
        if (!game || game.currentQuestion >= game.questions.length)
            return; // Game over
        const currentQuestion = game.questions[game.currentQuestion];
        if (data.answer === currentQuestion.correctAnswer) {
            game.scores[data.player]++;
        }
        if (game.currentQuestion < game.questions.length - 1) {
            game.currentQuestion++;
            this.sendNextQuestion(data.gameId);
        }
        else {
            this.endGame(data.gameId);
        }
    }
    sendNextQuestion(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game)
            return;
        const question = game.questions[game.currentQuestion];
        this.server.emit('question:send', {
            gameId,
            question: { text: question.text, choices: question.choices },
        });
    }
    endGame(gameId) {
        const game = this.activeGames.get(gameId);
        if (!game)
            return;
        const [player1, player2] = game.players;
        const scores = game.scores;
        const winner = scores[player1] > scores[player2] ? player1 : scores[player1] < scores[player2] ? player2 : null;
        this.server.emit('game:end', {
            gameId,
            scores,
            winner,
        });
        this.activeGames.delete(gameId);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('game:start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "startGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('answer:submit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleAnswer", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], GameGateway);
exports.GameGateway = GameGateway;
