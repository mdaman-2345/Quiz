import { Controller, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './create-question.dto';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post('create')
    async create(@Body() createQuestionDto: CreateQuestionDto) {
        try {
            return this.questionsService.create(createQuestionDto);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
