import { z } from "zod";

// ========================================
// 고객정보 (Customer/Patient Info)
// ========================================
export const insertPatientSchema = z.object({
    animalNumber: z.string(),
    name: z.string(),
    ownerName: z.string().nullable().default(null),
    species: z.string().default("개").nullable(),
    breed: z.string().nullable().default(null),
    gender: z.string().nullable().default(null),
    birthDate: z.string().nullable().default(null),
    registrationDate: z.string().nullable().default(null),
    neutered: z.boolean().nullable().default(null),
    weight: z.number().nullable().default(null),
    microchipNumber: z.string().nullable().default(null),
});

export const patientSchema = insertPatientSchema.extend({
    id: z.string(),
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = z.infer<typeof patientSchema>;

// ========================================
// 방문기록 (Visit Records)
// ========================================
export const insertVisitSchema = z.object({
    animalNumber: z.string(),
    visitDate: z.string(),
    visitType: z.string().nullable().default(null),
    chiefComplaint: z.string().nullable().default(null),
    diagnosis: z.string().nullable().default(null),
    treatment: z.string().nullable().default(null),
    status: z.string().default("완료").nullable(),
    veterinarian: z.string().nullable().default(null),
    notes: z.string().nullable().default(null),
});

export const visitSchema = insertVisitSchema.extend({
    id: z.string(),
});

export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = z.infer<typeof visitSchema>;

// ========================================
// 문진 템플릿 (Questionnaire Templates)
// ========================================
export const insertQuestionTemplateSchema = z.object({
    category: z.string(),
    question: z.string(),
    questionType: z.string().default("yes_no").nullable(),
    options: z.array(z.string()).nullable().default(null),
    relatedBodyPart: z.string().nullable().default(null),
    displayOrder: z.number().default(0).nullable(),
});

export const questionTemplateSchema = insertQuestionTemplateSchema.extend({
    id: z.string(),
});

export type InsertQuestionTemplate = z.infer<typeof insertQuestionTemplateSchema>;
export type QuestionTemplate = z.infer<typeof questionTemplateSchema>;

// ========================================
// 문진 응답 (Questionnaire Responses)
// ========================================
export const insertQuestionnaireResponseSchema = z.object({
    animalNumber: z.string(),
    visitId: z.string().nullable().default(null),
    questionId: z.string(),
    response: z.string(),
    responseDate: z.string(),
});

export const questionnaireResponseSchema = insertQuestionnaireResponseSchema.extend({
    id: z.string(),
});

export type InsertQuestionnaireResponse = z.infer<typeof insertQuestionnaireResponseSchema>;
export type QuestionnaireResponse = z.infer<typeof questionnaireResponseSchema>;

// ========================================
// 검사 항목 마스터 (Exam Master - 일반 + 영상)
// ========================================
export const insertExamMasterSchema = z.object({
    examCode: z.string(),
    examName: z.string(),
    examCategory: z.string(),
    examType: z.string().default("일반").nullable(),
    unit: z.string().nullable().default(null),
    normalRangeMin: z.number().nullable().default(null),
    normalRangeMax: z.number().nullable().default(null),
    normalRangeText: z.string().nullable().default(null),
    relatedBodyPart: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    isQuantitative: z.boolean().default(true).nullable(),
});

export const examMasterSchema = insertExamMasterSchema.extend({
    id: z.string(),
});

export type InsertExamMaster = z.infer<typeof insertExamMasterSchema>;
export type ExamMaster = z.infer<typeof examMasterSchema>;

// ========================================
// 검사 결과 (Test Results)
// ========================================
export const insertTestResultSchema = z.object({
    animalNumber: z.string(),
    visitId: z.string().nullable().default(null),
    examCode: z.string(),
    testDate: z.string(),
    value: z.number().nullable().default(null),
    valueText: z.string().nullable().default(null),
    status: z.string().default("N").nullable(),
    notes: z.string().nullable().default(null),
});

export const testResultSchema = insertTestResultSchema.extend({
    id: z.string(),
});

export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = z.infer<typeof testResultSchema>;

// ========================================
// 사용자 정의 필터 (User Filters)
// ========================================
export const insertUserFilterSchema = z.object({
    name: z.string(),
    description: z.string().nullable().default(null),
    filterType: z.string(),
    filterCriteria: z.string(),
    createdDate: z.string(),
});

export const userFilterSchema = insertUserFilterSchema.extend({
    id: z.string(),
});

export type InsertUserFilter = z.infer<typeof insertUserFilterSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;

// ========================================
// 군집 분석 (Cluster Analysis)
// ========================================
export const insertClusterAnalysisSchema = z.object({
    name: z.string(),
    description: z.string().nullable().default(null),
    clusterType: z.string(),
    memberAnimalNumbers: z.array(z.string()).nullable().default(null),
    criteria: z.string().nullable().default(null),
    createdDate: z.string(),
});

export const clusterAnalysisSchema = insertClusterAnalysisSchema.extend({
    id: z.string(),
});

export type InsertClusterAnalysis = z.infer<typeof insertClusterAnalysisSchema>;
export type ClusterAnalysis = z.infer<typeof clusterAnalysisSchema>;

// ========================================
// 약물 처방 (Medications)
// ========================================
export const insertMedicationSchema = z.object({
    animalNumber: z.string(),
    visitId: z.string().nullable().default(null),
    name: z.string(),
    dosage: z.string().nullable().default(null),
    frequency: z.string().nullable().default(null),
    duration: z.number().nullable().default(null),
    startDate: z.string(),
    endDate: z.string().nullable().default(null),
    category: z.string().nullable().default(null),
    notes: z.string().nullable().default(null),
});

export const medicationSchema = insertMedicationSchema.extend({
    id: z.string(),
});

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = z.infer<typeof medicationSchema>;

// ========================================
// Utility Types for Frontend
// ========================================

// 검사 결과 + 검사 항목 정보 조인 결과
export type TestResultWithExam = TestResult & {
    exam: ExamMaster;
};

// 환자 정보 + 통계
export type PatientWithStats = Patient & {
    age?: number; // 계산된 나이
    totalVisits?: number;
    lastVisitDate?: string;
    abnormalTestCount?: number;
};

// 방문 기록 + 환자 정보
export type VisitWithPatient = Visit & {
    patient: Patient;
};

// 문진 응답 + 문항 정보
export type QuestionnaireResponseWithQuestion = QuestionnaireResponse & {
    question: QuestionTemplate;
};
