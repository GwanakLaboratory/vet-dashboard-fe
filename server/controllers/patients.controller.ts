import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertPatientSchema, type InsertPatient } from '@shared/schema';

@Controller('patients')
export class PatientsController {
    constructor(private readonly storage: StorageService) { }

    @Get()
    async getAllPatients() {
        return this.storage.getAllPatients();
    }

    @Get(':animalNumber')
    async getPatient(@Param('animalNumber') animalNumber: string) {
        const patient = await this.storage.getPatientByAnimalNumber(animalNumber);
        if (!patient) {
            throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
        }
        return patient;
    }

    @Post()
    async createPatient(@Body() body: InsertPatient) {
        const validated = insertPatientSchema.parse(body);
        return this.storage.createPatient(validated);
    }

    @Put(':id')
    async updatePatient(@Param('id') id: string, @Body() body: Partial<InsertPatient>) {
        const updated = await this.storage.updatePatient(id, body);
        if (!updated) {
            throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete(':id')
    async deletePatient(@Param('id') id: string) {
        const deleted = await this.storage.deletePatient(id);
        if (!deleted) {
            throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
