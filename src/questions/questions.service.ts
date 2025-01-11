import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';
import { CreateQuestionDto } from './create-question.dto';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    ) { }

    async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
        try {
            const createdQuestion = new this.questionModel(createQuestionDto);
            return createdQuestion.save();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getQuestions(): Promise<Question[]> {
        try {
            return this.questionModel.find().limit(4).exec();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
