import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    ) { }

    async getRandomQuestions(count: number): Promise<Question[]> {
        return this.questionModel.aggregate([{ $sample: { size: count } }]);
    }
}
