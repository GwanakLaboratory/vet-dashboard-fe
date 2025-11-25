import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from '../storage.service';
import { insertUserFilterSchema, insertClusterAnalysisSchema, type InsertUserFilter, type InsertClusterAnalysis } from '@shared/schema';

@Controller()
export class FiltersController {
    constructor(private readonly storage: StorageService) { }

    // User Filters
    @Get('user-filters')
    async getAllUserFilters() {
        return this.storage.getAllUserFilters();
    }

    @Get('user-filters/:id')
    async getUserFilter(@Param('id') id: string) {
        const filter = await this.storage.getUserFilter(id);
        if (!filter) {
            throw new HttpException('Filter not found', HttpStatus.NOT_FOUND);
        }
        return filter;
    }

    @Post('user-filters')
    async createUserFilter(@Body() body: InsertUserFilter) {
        const validated = insertUserFilterSchema.parse(body);
        return this.storage.createUserFilter(validated);
    }

    @Put('user-filters/:id')
    async updateUserFilter(@Param('id') id: string, @Body() body: Partial<InsertUserFilter>) {
        const updated = await this.storage.updateUserFilter(id, body);
        if (!updated) {
            throw new HttpException('Filter not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete('user-filters/:id')
    async deleteUserFilter(@Param('id') id: string) {
        const deleted = await this.storage.deleteUserFilter(id);
        if (!deleted) {
            throw new HttpException('Filter not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }

    // Cluster Analysis
    @Get('cluster-analysis')
    async getAllClusterAnalysis() {
        return this.storage.getAllClusterAnalysis();
    }

    @Get('cluster-analysis/:id')
    async getClusterAnalysis(@Param('id') id: string) {
        const cluster = await this.storage.getClusterAnalysis(id);
        if (!cluster) {
            throw new HttpException('Cluster not found', HttpStatus.NOT_FOUND);
        }
        return cluster;
    }

    @Post('cluster-analysis')
    async createClusterAnalysis(@Body() body: InsertClusterAnalysis) {
        const validated = insertClusterAnalysisSchema.parse(body);
        return this.storage.createClusterAnalysis(validated);
    }

    @Put('cluster-analysis/:id')
    async updateClusterAnalysis(@Param('id') id: string, @Body() body: Partial<InsertClusterAnalysis>) {
        const updated = await this.storage.updateClusterAnalysis(id, body);
        if (!updated) {
            throw new HttpException('Cluster not found', HttpStatus.NOT_FOUND);
        }
        return updated;
    }

    @Delete('cluster-analysis/:id')
    async deleteClusterAnalysis(@Param('id') id: string) {
        const deleted = await this.storage.deleteClusterAnalysis(id);
        if (!deleted) {
            throw new HttpException('Cluster not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}
