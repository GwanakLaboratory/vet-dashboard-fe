import { Module, Global, OnModuleInit, Inject } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { PatientsController } from './controllers/patients.controller';
import { VisitsController } from './controllers/visits.controller';
import { TestResultsController } from './controllers/test-results.controller';
import { QuestionnaireController } from './controllers/questionnaire.controller';
import { FiltersController } from './controllers/filters.controller';
import { MedicationsController } from './controllers/medications.controller';
import { seedDatabase } from './utils/seed';

/**
 * 애플리케이션의 루트 모듈
 * 모든 컨트롤러와 서비스를 등록하고 관리합니다.
 */
@Global()
@Module({
    imports: [
        MulterModule.register({
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
            },
        }),
    ],
    controllers: [
        PatientsController,
        VisitsController,
        TestResultsController,
        QuestionnaireController,
        FiltersController,
        MedicationsController,
    ],
    providers: [StorageService],
    exports: [StorageService], // StorageService를 전역으로 export
})
export class AppModule implements OnModuleInit {
    constructor(@Inject(StorageService) private readonly storageService: StorageService) { }

    async onModuleInit() {
        await seedDatabase(this.storageService);
    }
}

