import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertVisitSchema, type InsertVisit } from '@shared/schema';

@Controller('visits')
export class VisitsController {
    constructor(private readonly storage: StorageService) { }

    @Get()
    async getAllVisits(@Query('animalNumber') animalNumber?: string) {
        if (animalNumber) {
            return this.storage.getVisitsByAnimalNumber(animalNumber);
        }
        return this.storage.getAllVisits();
    }

    @Get(':id')
    async getVisit(@Param('id') id: string) {
        const visit = await this.storage.getVisit(id);
        if (!visit) {
            throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
        }
        return visit;
    }

    @Post()
    async createVisit(@Body() body: InsertVisit) {
        const validated = insertVisitSchema.parse(body);
        return this.storage.createVisit(validated);
    }

    @Put(':id')
    async updateVisit(@Param('id') id: string, @Body() body: Partial<InsertVisit>) {
        const updated = await this.storage.updateVisit(id, body);
        if (!updated) {
            throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete(':id')
    async deleteVisit(@Param('id') id: string) {
        const deleted = await this.storage.deleteVisit(id);
        if (!deleted) {
            throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
