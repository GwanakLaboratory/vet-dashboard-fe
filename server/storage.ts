import { randomUUID } from "crypto";
import type {
  Patient,
  InsertPatient,
  Visit,
  InsertVisit,
  TestResult,
  InsertTestResult,
  ExamMaster,
  InsertExamMaster,
  QuestionTemplate,
  InsertQuestionTemplate,
  QuestionnaireResponse,
  InsertQuestionnaireResponse,
  UserFilter,
  InsertUserFilter,
  ClusterAnalysis,
  InsertClusterAnalysis,
} from "@shared/schema";

// ========================================
// Storage Interface
// ========================================

export interface IStorage {
  // Patients
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByAnimalNumber(animalNumber: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: string): Promise<boolean>;

  // Visits
  getAllVisits(): Promise<Visit[]>;
  getVisit(id: string): Promise<Visit | undefined>;
  getVisitsByAnimalNumber(animalNumber: string): Promise<Visit[]>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  updateVisit(id: string, visit: Partial<InsertVisit>): Promise<Visit | undefined>;
  deleteVisit(id: string): Promise<boolean>;

  // Test Results
  getAllTestResults(): Promise<TestResult[]>;
  getTestResult(id: string): Promise<TestResult | undefined>;
  getTestResultsByAnimalNumber(animalNumber: string): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  updateTestResult(id: string, result: Partial<InsertTestResult>): Promise<TestResult | undefined>;
  deleteTestResult(id: string): Promise<boolean>;

  // Exam Master
  getAllExamMaster(): Promise<ExamMaster[]>;
  getExamMaster(id: string): Promise<ExamMaster | undefined>;
  getExamMasterByCode(examCode: string): Promise<ExamMaster | undefined>;
  createExamMaster(exam: InsertExamMaster): Promise<ExamMaster>;
  updateExamMaster(id: string, exam: Partial<InsertExamMaster>): Promise<ExamMaster | undefined>;
  deleteExamMaster(id: string): Promise<boolean>;

  // Question Templates
  getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  getQuestionTemplate(id: string): Promise<QuestionTemplate | undefined>;
  createQuestionTemplate(template: InsertQuestionTemplate): Promise<QuestionTemplate>;
  updateQuestionTemplate(id: string, template: Partial<InsertQuestionTemplate>): Promise<QuestionTemplate | undefined>;
  deleteQuestionTemplate(id: string): Promise<boolean>;

  // Questionnaire Responses
  getAllQuestionnaireResponses(): Promise<QuestionnaireResponse[]>;
  getQuestionnaireResponse(id: string): Promise<QuestionnaireResponse | undefined>;
  getQuestionnaireResponsesByAnimalNumber(animalNumber: string): Promise<QuestionnaireResponse[]>;
  createQuestionnaireResponse(response: InsertQuestionnaireResponse): Promise<QuestionnaireResponse>;
  updateQuestionnaireResponse(id: string, response: Partial<InsertQuestionnaireResponse>): Promise<QuestionnaireResponse | undefined>;
  deleteQuestionnaireResponse(id: string): Promise<boolean>;

  // User Filters
  getAllUserFilters(): Promise<UserFilter[]>;
  getUserFilter(id: string): Promise<UserFilter | undefined>;
  createUserFilter(filter: InsertUserFilter): Promise<UserFilter>;
  updateUserFilter(id: string, filter: Partial<InsertUserFilter>): Promise<UserFilter | undefined>;
  deleteUserFilter(id: string): Promise<boolean>;

  // Cluster Analysis
  getAllClusterAnalysis(): Promise<ClusterAnalysis[]>;
  getClusterAnalysis(id: string): Promise<ClusterAnalysis | undefined>;
  createClusterAnalysis(cluster: InsertClusterAnalysis): Promise<ClusterAnalysis>;
  updateClusterAnalysis(id: string, cluster: Partial<InsertClusterAnalysis>): Promise<ClusterAnalysis | undefined>;
  deleteClusterAnalysis(id: string): Promise<boolean>;
}

// ========================================
// In-Memory Storage Implementation
// ========================================

export class MemStorage implements IStorage {
  private patients: Map<string, Patient>;
  private visits: Map<string, Visit>;
  private testResults: Map<string, TestResult>;
  private examMaster: Map<string, ExamMaster>;
  private questionTemplates: Map<string, QuestionTemplate>;
  private questionnaireResponses: Map<string, QuestionnaireResponse>;
  private userFilters: Map<string, UserFilter>;
  private clusterAnalysis: Map<string, ClusterAnalysis>;

  constructor() {
    this.patients = new Map();
    this.visits = new Map();
    this.testResults = new Map();
    this.examMaster = new Map();
    this.questionTemplates = new Map();
    this.questionnaireResponses = new Map();
    this.userFilters = new Map();
    this.clusterAnalysis = new Map();

    // Initialize with mock data
    this.initializeMockData();
  }

  // ========================================
  // Patients
  // ========================================

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByAnimalNumber(animalNumber: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find((p) => p.animalNumber === animalNumber);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updateData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    const updated = { ...patient, ...updateData };
    this.patients.set(id, updated);
    return updated;
  }

  async deletePatient(id: string): Promise<boolean> {
    return this.patients.delete(id);
  }

  // ========================================
  // Visits
  // ========================================

  async getAllVisits(): Promise<Visit[]> {
    return Array.from(this.visits.values());
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async getVisitsByAnimalNumber(animalNumber: string): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter((v) => v.animalNumber === animalNumber);
  }

  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = randomUUID();
    const visit: Visit = { ...insertVisit, id };
    this.visits.set(id, visit);
    return visit;
  }

  async updateVisit(id: string, updateData: Partial<InsertVisit>): Promise<Visit | undefined> {
    const visit = this.visits.get(id);
    if (!visit) return undefined;
    const updated = { ...visit, ...updateData };
    this.visits.set(id, updated);
    return updated;
  }

  async deleteVisit(id: string): Promise<boolean> {
    return this.visits.delete(id);
  }

  // ========================================
  // Test Results
  // ========================================

  async getAllTestResults(): Promise<TestResult[]> {
    return Array.from(this.testResults.values());
  }

  async getTestResult(id: string): Promise<TestResult | undefined> {
    return this.testResults.get(id);
  }

  async getTestResultsByAnimalNumber(animalNumber: string): Promise<TestResult[]> {
    return Array.from(this.testResults.values()).filter((r) => r.animalNumber === animalNumber);
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const id = randomUUID();
    const result: TestResult = { ...insertResult, id };
    this.testResults.set(id, result);
    return result;
  }

  async updateTestResult(id: string, updateData: Partial<InsertTestResult>): Promise<TestResult | undefined> {
    const result = this.testResults.get(id);
    if (!result) return undefined;
    const updated = { ...result, ...updateData };
    this.testResults.set(id, updated);
    return updated;
  }

  async deleteTestResult(id: string): Promise<boolean> {
    return this.testResults.delete(id);
  }

  // ========================================
  // Exam Master
  // ========================================

  async getAllExamMaster(): Promise<ExamMaster[]> {
    return Array.from(this.examMaster.values());
  }

  async getExamMaster(id: string): Promise<ExamMaster | undefined> {
    return this.examMaster.get(id);
  }

  async getExamMasterByCode(examCode: string): Promise<ExamMaster | undefined> {
    return Array.from(this.examMaster.values()).find((e) => e.examCode === examCode);
  }

  async createExamMaster(insertExam: InsertExamMaster): Promise<ExamMaster> {
    const id = randomUUID();
    const exam: ExamMaster = { ...insertExam, id };
    this.examMaster.set(id, exam);
    return exam;
  }

  async updateExamMaster(id: string, updateData: Partial<InsertExamMaster>): Promise<ExamMaster | undefined> {
    const exam = this.examMaster.get(id);
    if (!exam) return undefined;
    const updated = { ...exam, ...updateData };
    this.examMaster.set(id, updated);
    return updated;
  }

  async deleteExamMaster(id: string): Promise<boolean> {
    return this.examMaster.delete(id);
  }

  // ========================================
  // Question Templates
  // ========================================

  async getAllQuestionTemplates(): Promise<QuestionTemplate[]> {
    return Array.from(this.questionTemplates.values());
  }

  async getQuestionTemplate(id: string): Promise<QuestionTemplate | undefined> {
    return this.questionTemplates.get(id);
  }

  async createQuestionTemplate(insertTemplate: InsertQuestionTemplate): Promise<QuestionTemplate> {
    const id = randomUUID();
    const template: QuestionTemplate = { ...insertTemplate, id };
    this.questionTemplates.set(id, template);
    return template;
  }

  async updateQuestionTemplate(id: string, updateData: Partial<InsertQuestionTemplate>): Promise<QuestionTemplate | undefined> {
    const template = this.questionTemplates.get(id);
    if (!template) return undefined;
    const updated = { ...template, ...updateData };
    this.questionTemplates.set(id, updated);
    return updated;
  }

  async deleteQuestionTemplate(id: string): Promise<boolean> {
    return this.questionTemplates.delete(id);
  }

  // ========================================
  // Questionnaire Responses
  // ========================================

  async getAllQuestionnaireResponses(): Promise<QuestionnaireResponse[]> {
    return Array.from(this.questionnaireResponses.values());
  }

  async getQuestionnaireResponse(id: string): Promise<QuestionnaireResponse | undefined> {
    return this.questionnaireResponses.get(id);
  }

  async getQuestionnaireResponsesByAnimalNumber(animalNumber: string): Promise<QuestionnaireResponse[]> {
    return Array.from(this.questionnaireResponses.values()).filter((r) => r.animalNumber === animalNumber);
  }

  async createQuestionnaireResponse(insertResponse: InsertQuestionnaireResponse): Promise<QuestionnaireResponse> {
    const id = randomUUID();
    const response: QuestionnaireResponse = { ...insertResponse, id };
    this.questionnaireResponses.set(id, response);
    return response;
  }

  async updateQuestionnaireResponse(id: string, updateData: Partial<InsertQuestionnaireResponse>): Promise<QuestionnaireResponse | undefined> {
    const response = this.questionnaireResponses.get(id);
    if (!response) return undefined;
    const updated = { ...response, ...updateData };
    this.questionnaireResponses.set(id, updated);
    return updated;
  }

  async deleteQuestionnaireResponse(id: string): Promise<boolean> {
    return this.questionnaireResponses.delete(id);
  }

  // ========================================
  // User Filters
  // ========================================

  async getAllUserFilters(): Promise<UserFilter[]> {
    return Array.from(this.userFilters.values());
  }

  async getUserFilter(id: string): Promise<UserFilter | undefined> {
    return this.userFilters.get(id);
  }

  async createUserFilter(insertFilter: InsertUserFilter): Promise<UserFilter> {
    const id = randomUUID();
    const filter: UserFilter = { ...insertFilter, id };
    this.userFilters.set(id, filter);
    return filter;
  }

  async updateUserFilter(id: string, updateData: Partial<InsertUserFilter>): Promise<UserFilter | undefined> {
    const filter = this.userFilters.get(id);
    if (!filter) return undefined;
    const updated = { ...filter, ...updateData };
    this.userFilters.set(id, updated);
    return updated;
  }

  async deleteUserFilter(id: string): Promise<boolean> {
    return this.userFilters.delete(id);
  }

  // ========================================
  // Cluster Analysis
  // ========================================

  async getAllClusterAnalysis(): Promise<ClusterAnalysis[]> {
    return Array.from(this.clusterAnalysis.values());
  }

  async getClusterAnalysis(id: string): Promise<ClusterAnalysis | undefined> {
    return this.clusterAnalysis.get(id);
  }

  async createClusterAnalysis(insertCluster: InsertClusterAnalysis): Promise<ClusterAnalysis> {
    const id = randomUUID();
    const cluster: ClusterAnalysis = { ...insertCluster, id };
    this.clusterAnalysis.set(id, cluster);
    return cluster;
  }

  async updateClusterAnalysis(id: string, updateData: Partial<InsertClusterAnalysis>): Promise<ClusterAnalysis | undefined> {
    const cluster = this.clusterAnalysis.get(id);
    if (!cluster) return undefined;
    const updated = { ...cluster, ...updateData };
    this.clusterAnalysis.set(id, updated);
    return updated;
  }

  async deleteClusterAnalysis(id: string): Promise<boolean> {
    return this.clusterAnalysis.delete(id);
  }

  // ========================================
  // Initialize Mock Data
  // ========================================

  private initializeMockData() {
    // This will be populated with mock data
    // For now, start with empty data
  }
}

export const storage = new MemStorage();
