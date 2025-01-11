import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsArray()
    @IsNotEmpty()
    choices: string[];

    @IsString()
    @IsNotEmpty()
    correctAnswer: string;
}
