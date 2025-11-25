/**
 * 중앙화된 API 클라이언트
 * 타입 안전한 API 호출을 제공합니다.
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

const API_BASE_URL = '/api';

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

/**
 * HTTP 요청 헬퍼
 */
async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                response.status,
                response.statusText,
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// ========================================
// Patients API
// ========================================

export const patientsApi = {
    getAll: () => fetchApi<Patient[]>('/patients'),

    getByAnimalNumber: (animalNumber: string) =>
        fetchApi<Patient>(`/patients/${animalNumber}`),

    create: (data: InsertPatient) =>
        fetchApi<Patient>('/patients', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<InsertPatient>) =>
        fetchApi<Patient>(`/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/patients/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Visits API
// ========================================

export const visitsApi = {
    getAll: () => fetchApi<Visit[]>('/visits'),

    getById: (id: string) => fetchApi<Visit>(`/visits/${id}`),

    getByAnimalNumber: (animalNumber: string) =>
        fetchApi<Visit[]>(`/visits/animal/${animalNumber}`),

    create: (data: InsertVisit) =>
        fetchApi<Visit>('/visits', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<InsertVisit>) =>
        fetchApi<Visit>(`/visits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/visits/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Test Results API
// ========================================

export const testResultsApi = {
    getAll: () => fetchApi<TestResult[]>('/test-results'),

    getById: (id: string) => fetchApi<TestResult>(`/test-results/${id}`),

    getByAnimalNumber: (animalNumber: string) =>
        fetchApi<TestResult[]>(`/test-results/animal/${animalNumber}`),

    create: (data: InsertTestResult) =>
        fetchApi<TestResult>('/test-results', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<InsertTestResult>) =>
        fetchApi<TestResult>(`/test-results/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/test-results/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Exam Master API
// ========================================

export const examMasterApi = {
    getAll: () => fetchApi<ExamMaster[]>('/test-results/exam-master'),
};

// ========================================
// Questionnaire API
// ========================================

export const questionnaireApi = {
    getTemplates: () => fetchApi<QuestionTemplate[]>('/questionnaire/templates'),

    getResponses: () => fetchApi<QuestionnaireResponse[]>('/questionnaire/responses'),

    getResponsesByAnimalNumber: (animalNumber: string) =>
        fetchApi<QuestionnaireResponse[]>(`/questionnaire/responses/animal/${animalNumber}`),

    createResponse: (data: InsertQuestionnaireResponse) =>
        fetchApi<QuestionnaireResponse>('/questionnaire/responses', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// ========================================
// Filters API
// ========================================

export const filtersApi = {
    getAll: () => fetchApi<UserFilter[]>('/filters'),

    create: (data: InsertUserFilter) =>
        fetchApi<UserFilter>('/filters', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/filters/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Cluster Analysis API
// ========================================

export const clusterApi = {
    getAll: () => fetchApi<ClusterAnalysis[]>('/filters/clusters'),

    create: (data: InsertClusterAnalysis) =>
        fetchApi<ClusterAnalysis>('/filters/clusters', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/filters/clusters/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Medications API
// ========================================

export const medicationsApi = {
    getAll: () => fetchApi<Medication[]>('/medications'),

    getByAnimalNumber: (animalNumber: string) =>
        fetchApi<Medication[]>(`/medications/animal/${animalNumber}`),

    create: (data: InsertMedication) =>
        fetchApi<Medication>('/medications', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<InsertMedication>) =>
        fetchApi<Medication>(`/medications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<{ success: boolean }>(`/medications/${id}`, {
            method: 'DELETE',
        }),
};

// ========================================
// Excel API
// ========================================

export const excelApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${API_BASE_URL}/excel/upload`, {
            method: 'POST',
            body: formData,
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    response.status,
                    response.statusText,
                    errorData.message || 'Upload failed',
                );
            }
            return response.json();
        });
    },

    download: async () => {
        const response = await fetch(`${API_BASE_URL}/excel/download`);
        if (!response.ok) {
            throw new ApiError(response.status, response.statusText, 'Download failed');
        }
        return response.blob();
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
