"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Import this first
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS if needed
    app.enableCors();
    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
