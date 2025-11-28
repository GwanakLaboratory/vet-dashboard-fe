/**
 * Mock API Client
 * Returns mock data for frontend-only development.
 */

import type {
    Patient,
    InsertPatient,
    Visit,
    InsertVisit,
    TestResult,
    InsertTestResult,
    ExamMaster,
    QuestionTemplate,
    QuestionnaireResponse,
    InsertQuestionnaireResponse,
    UserFilter,
    InsertUserFilter,
    ClusterAnalysis,
    InsertClusterAnalysis,
    Medication,
    InsertMedication,
} from '@shared/schema';

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Mock Data Store
let patients: Patient[] = [
    {
        id: '1',
        animalNumber: 'A001',
        name: '뽀삐',
        ownerName: '김철수',
        species: '개',
        breed: '푸들',
        gender: '수컷',
        birthDate: '2020-01-15',
        registrationDate: '2025-11-20',
        neutered: true,
        weight: 5.5,
        microchipNumber: '1234567890',
    },
    {
        id: '2',
        animalNumber: 'A002',
        name: '나비',
        ownerName: '이영희',
        species: '고양이',
        breed: '코숏',
        gender: '암컷',
        birthDate: '2021-03-10',
        registrationDate: '2025-11-21',
        neutered: true,
        weight: 4.2,
        microchipNumber: '0987654321',
    }
];

let visits: Visit[] = [
    {
        id: '1',
        animalNumber: 'A001',
        visitDate: '2025-11-25',
        visitType: '정기검진',
        chiefComplaint: '식욕 부진',
        diagnosis: '가벼운 위염',
        treatment: '약물 처방',
        status: '완료',
        veterinarian: '김수의',
        notes: '특이사항 없음',
    }
];

let testResults: TestResult[] = [];
let examMaster: ExamMaster[] = [
    {
        id: '1',
        examCode: 'CBC001',
        examName: 'RBC',
        examCategory: 'CBC',
        examType: '일반',
        unit: 'M/uL',
        normalRangeMin: 5.5,
        normalRangeMax: 8.5,
        isQuantitative: true,
    },
    {
        id: '2',
        examCode: 'CBC002',
        examName: 'WBC',
        examCategory: 'CBC',
        examType: '일반',
        unit: 'K/uL',
        normalRangeMin: 6.0,
        normalRangeMax: 17.0,
        isQuantitative: true,
    }
];

let questionnaireResponses: QuestionnaireResponse[] = [];
let userFilters: UserFilter[] = [];
let clusters: ClusterAnalysis[] = [];
let medications: Medication[] = [];

// Helper to simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// Patients API
// ========================================

export const patientsApi = {
    getAll: async () => {
        await delay(500);
        return [...patients];
    },

    getByAnimalNumber: async (animalNumber: string) => {
        await delay(300);
        const patient = patients.find(p => p.animalNumber === animalNumber);
        if (!patient) throw new Error('Patient not found');
        return patient;
    },

    create: async (data: InsertPatient) => {
        await delay(500);
        const newPatient: Patient = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        patients.push(newPatient);
        return newPatient;
    },

    update: async (id: string, data: Partial<InsertPatient>) => {
        await delay(500);
        const index = patients.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Patient not found');
        patients[index] = { ...patients[index], ...data };
        return patients[index];
    },

    delete: async (id: string) => {
        await delay(500);
        patients = patients.filter(p => p.id !== id);
        return { success: true };
    },
};

// ========================================
// Visits API
// ========================================

export const visitsApi = {
    getAll: async () => {
        await delay(500);
        return [...visits];
    },

    getById: async (id: string) => {
        await delay(300);
        const visit = visits.find(v => v.id === id);
        if (!visit) throw new Error('Visit not found');
        return visit;
    },

    getByAnimalNumber: async (animalNumber: string) => {
        await delay(300);
        return visits.filter(v => v.animalNumber === animalNumber);
    },

    create: async (data: InsertVisit) => {
        await delay(500);
        const newVisit: Visit = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        visits.push(newVisit);
        return newVisit;
    },

    update: async (id: string, data: Partial<InsertVisit>) => {
        await delay(500);
        const index = visits.findIndex(v => v.id === id);
        if (index === -1) throw new Error('Visit not found');
        visits[index] = { ...visits[index], ...data };
        return visits[index];
    },

    delete: async (id: string) => {
        await delay(500);
        visits = visits.filter(v => v.id !== id);
        return { success: true };
    },
};

// ========================================
// Test Results API
// ========================================

export const testResultsApi = {
    getAll: async () => {
        await delay(500);
        return [...testResults];
    },

    getById: async (id: string) => {
        await delay(300);
        const result = testResults.find(r => r.id === id);
        if (!result) throw new Error('Test result not found');
        return result;
    },

    getByAnimalNumber: async (animalNumber: string) => {
        await delay(300);
        return testResults.filter(r => r.animalNumber === animalNumber);
    },

    create: async (data: InsertTestResult) => {
        await delay(500);
        const newResult: TestResult = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        testResults.push(newResult);
        return newResult;
    },

    update: async (id: string, data: Partial<InsertTestResult>) => {
        await delay(500);
        const index = testResults.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Test result not found');
        testResults[index] = { ...testResults[index], ...data };
        return testResults[index];
    },

    delete: async (id: string) => {
        await delay(500);
        testResults = testResults.filter(r => r.id !== id);
        return { success: true };
    },
};

// ========================================
// Exam Master API
// ========================================

export const examMasterApi = {
    getAll: async () => {
        await delay(300);
        return [...examMaster];
    },
};

// ========================================
// Questionnaire API
// ========================================

export const questionnaireApi = {
    getTemplates: async () => {
        await delay(300);
        return [] as QuestionTemplate[];
    },

    getResponses: async () => {
        await delay(300);
        return [...questionnaireResponses];
    },

    getResponsesByAnimalNumber: async (animalNumber: string) => {
        await delay(300);
        return questionnaireResponses.filter(r => r.animalNumber === animalNumber);
    },

    createResponse: async (data: InsertQuestionnaireResponse) => {
        await delay(500);
        const newResponse: QuestionnaireResponse = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        questionnaireResponses.push(newResponse);
        return newResponse;
    },
};

// ========================================
// Filters API
// ========================================

export const filtersApi = {
    getAll: async () => {
        await delay(300);
        return [...userFilters];
    },

    create: async (data: InsertUserFilter) => {
        await delay(500);
        const newFilter: UserFilter = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        userFilters.push(newFilter);
        return newFilter;
    },

    delete: async (id: string) => {
        await delay(500);
        userFilters = userFilters.filter(f => f.id !== id);
        return { success: true };
    },
};

// ========================================
// Cluster Analysis API
// ========================================

export const clusterApi = {
    getAll: async () => {
        await delay(300);
        return [...clusters];
    },

    create: async (data: InsertClusterAnalysis) => {
        await delay(500);
        const newCluster: ClusterAnalysis = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        clusters.push(newCluster);
        return newCluster;
    },

    delete: async (id: string) => {
        await delay(500);
        clusters = clusters.filter(c => c.id !== id);
        return { success: true };
    },
};

// ========================================
// Medications API
// ========================================

export const medicationsApi = {
    getAll: async () => {
        await delay(300);
        return [...medications];
    },

    getByAnimalNumber: async (animalNumber: string) => {
        await delay(300);
        return medications.filter(m => m.animalNumber === animalNumber);
    },

    create: async (data: InsertMedication) => {
        await delay(500);
        const newMedication: Medication = {
            ...data,
            id: Math.random().toString(36).substring(7),
        };
        medications.push(newMedication);
        return newMedication;
    },

    update: async (id: string, data: Partial<InsertMedication>) => {
        await delay(500);
        const index = medications.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Medication not found');
        medications[index] = { ...medications[index], ...data };
        return medications[index];
    },

    delete: async (id: string) => {
        await delay(500);
        medications = medications.filter(m => m.id !== id);
        return { success: true };
    },
};

// ========================================
// Excel API
// ========================================

export const excelApi = {
    upload: async (file: File) => {
        await delay(1000);
        return { success: true, message: 'Mock upload successful' };
    },

    download: async () => {
        await delay(1000);
        return new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    },
};

/**
 * 통합 API 객체
 */
export const api = {
    patients: patientsApi,
    visits: visitsApi,
    testResults: testResultsApi,
    examMaster: examMasterApi,
    questionnaire: questionnaireApi,
    filters: filtersApi,
    cluster: clusterApi,
    medications: medicationsApi,
    excel: excelApi,
};
