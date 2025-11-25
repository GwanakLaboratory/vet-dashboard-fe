import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertQuestionnaireResponseSchema, type InsertQuestionnaireResponse } from '@shared/schema';

@Controller('questionnaire-responses')
export class QuestionnaireController {
    constructor(private readonly storage: StorageService) { }

    @Get()
    async getAllResponses(@Query('animalNumber') animalNumber?: string) {
        if (animalNumber) {
            return this.storage.getQuestionnaireResponsesByAnimalNumber(animalNumber);
        }
        return this.storage.getAllQuestionnaireResponses();
    }

    @Get('templates')
    async getAllTemplates() {
        return this.storage.getAllQuestionTemplates();
    }

    @Get(':id')
    async getResponse(@Param('id') id: string) {
        const response = await this.storage.getQuestionnaireResponse(id);
        if (!response) {
            throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
        }
        return response;
    }

    @Post()
    async createResponse(@Body() body: InsertQuestionnaireResponse) {
        const validated = insertQuestionnaireResponseSchema.parse(body);
        return this.storage.createQuestionnaireResponse(validated);
    }

    @Put(':id')
    async updateResponse(@Param('id') id: string, @Body() body: Partial<InsertQuestionnaireResponse>) {
        const updated = await this.storage.updateQuestionnaireResponse(id, body);
        if (!updated) {
            throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete(':id')
    async deleteResponse(@Param('id') id: string) {
        const deleted = await this.storage.deleteQuestionnaireResponse(id);
        if (!deleted) {
            throw new HttpException('Response not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
