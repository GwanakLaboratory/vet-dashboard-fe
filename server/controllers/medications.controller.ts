import { Controller, Get, Post, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertMedicationSchema, type InsertMedication } from '@shared/schema';

@Controller('medications')
export class MedicationsController {
    constructor(private readonly storage: StorageService) { }

    @Get()
    async getAllMedications(@Query('animalNumber') animalNumber?: string) {
        if (animalNumber) {
            return this.storage.getMedicationsByAnimalNumber(animalNumber);
        }
        return this.storage.getAllMedications();
    }

    @Get(':id')
    async getMedication(@Param('id') id: string) {
        const medication = await this.storage.getMedication(id);
        if (!medication) {
            throw new HttpException('Medication not found', HttpStatus.NOT_FOUND);
        }
        return medication;
    }

    @Post()
    async createMedication(@Body() body: InsertMedication) {
        const validated = insertMedicationSchema.parse(body);
        return this.storage.createMedication(validated);
    }

    @Delete(':id')
    async deleteMedication(@Param('id') id: string) {
        const deleted = await this.storage.deleteMedication(id);
        if (!deleted) {
            throw new HttpException('Medication not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
