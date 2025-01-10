"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const question_schema_1 = require("./question.schema"); // Import your Question schema
const questions_service_1 = require("./questions.service"); // Import the service that handles question logic
// import { QuestionsController } from './qu';  // Import the controller for managing questions
let QuestionsModule = class QuestionsModule {
};
QuestionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: question_schema_1.Question.name, schema: question_schema_1.QuestionSchema }]), // Register the Question schema with MongoDB
        ],
        providers: [questions_service_1.QuestionsService],
        // controllers: [QuestionsController],  // Controller for handling HTTP routes related to questions
        exports: [questions_service_1.QuestionsService], // Export QuestionsService so other modules can use it (like GameModule)
    })
], QuestionsModule);
exports.QuestionsModule = QuestionsModule;
