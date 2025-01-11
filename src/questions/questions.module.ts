import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './question.schema';
import { QuestionsService } from './questions.service'; 
import { QuestionsController } from './question.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]), 
    ],
    providers: [QuestionsService],
    exports: [QuestionsService], 
    controllers: [QuestionsController]
})
export class QuestionsModule { }
