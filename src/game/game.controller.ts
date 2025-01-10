import { Controller, Post } from '@nestjs/common';

@Controller('game')
export class GameController {
    @Post('start')
    startGame() {
        return { message: 'Game started, players will be matched in real-time.' };
    }
}
