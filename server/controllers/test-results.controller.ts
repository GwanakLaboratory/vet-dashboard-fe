import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertTestResultSchema, type InsertTestResult } from '@shared/schema';

@Controller('test-results')
export class TestResultsController {
    constructor(private readonly storage: StorageService) { }

    @Get()
    async getAllTestResults(@Query('animalNumber') animalNumber?: string) {
        if (animalNumber) {
            return this.storage.getTestResultsByAnimalNumber(animalNumber);
        }
        return this.storage.getAllTestResults();
    }

    @Get('exam-master')
    async getAllExamMaster() {
        return this.storage.getAllExamMaster();
    }

    @Get(':id')
    async getTestResult(@Param('id') id: string) {
        const result = await this.storage.getTestResult(id);
        if (!result) {
            throw new HttpException('Test result not found', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    @Post()
    async createTestResult(@Body() body: InsertTestResult) {
        const validated = insertTestResultSchema.parse(body);
        return this.storage.createTestResult(validated);
    }

    @Put(':id')
    async updateTestResult(@Param('id') id: string, @Body() body: Partial<InsertTestResult>) {
        const updated = await this.storage.updateTestResult(id, body);
        if (!updated) {
            throw new HttpException('Test result not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete(':id')
    async deleteTestResult(@Param('id') id: string) {
        const deleted = await this.storage.deleteTestResult(id);
        if (!deleted) {
            throw new HttpException('Test result not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
