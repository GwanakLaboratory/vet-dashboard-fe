import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import {
  generateMockPatients,
  generateMockVisits,
  generateExamMaster,
  generateMockTestResults,
  generateQuestionTemplates,
  generateMockQuestionnaireResponses,
} from "./mock-data-generator";
import {
  insertPatientSchema,
  insertVisitSchema,
  insertTestResultSchema,
  insertExamMasterSchema,
  insertQuestionTemplateSchema,
  insertQuestionnaireResponseSchema,
  insertUserFilterSchema,
  insertClusterAnalysisSchema,
} from "@shared/schema";
import type { ZodSchema } from "zod";

// Validation helper
function validateRequest<T>(schema: ZodSchema<T>, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${JSON.stringify(result.error.errors)}`);
  }
  return result.data;
}

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // ========================================
  // Initialize Mock Data
  // ========================================
  
  async function initializeMockData() {
    try {
      // Check if data already exists
      const existingPatients = await storage.getAllPatients();
      if (existingPatients.length > 0) {
        console.log("Mock data already initialized");
        return;
      }

      console.log("Initializing mock data...");

      // Generate patients
      const mockPatients = generateMockPatients(20);
      for (const patient of mockPatients) {
        await storage.createPatient(patient);
      }

      // Generate exam master
      const examMasterData = generateExamMaster();
      for (const exam of examMasterData) {
        await storage.createExamMaster(exam);
      }

      // Get all patient animal numbers
      const patients = await storage.getAllPatients();
      const animalNumbers = patients.map((p) => p.animalNumber);

      // Generate visits
      const mockVisits = generateMockVisits(animalNumbers, 5);
      for (const visit of mockVisits) {
        await storage.createVisit(visit);
      }

      // Generate test results
      const examMaster = await storage.getAllExamMaster();
      const mockTestResults = generateMockTestResults(animalNumbers, examMaster, 15);
      for (const result of mockTestResults) {
        await storage.createTestResult(result);
      }

      // Generate question templates
      const questionTemplates = generateQuestionTemplates();
      const createdTemplates = [];
      for (const template of questionTemplates) {
        const created = await storage.createQuestionTemplate(template);
        createdTemplates.push(created);
      }

      // Generate questionnaire responses
      const mockResponses = generateMockQuestionnaireResponses(animalNumbers, createdTemplates, 10);
      for (const response of mockResponses) {
        await storage.createQuestionnaireResponse(response);
      }

      console.log("Mock data initialized successfully");
    } catch (error) {
      console.error("Error initializing mock data:", error);
    }
  }

  // Initialize data when server starts
  await initializeMockData();

  // ========================================
  // Patient Routes
  // ========================================

  app.get("/api/patients", async (_req: Request, res: Response) => {
    const patients = await storage.getAllPatients();
    res.json(patients);
  });

  app.get("/api/patients/:animalNumber", async (req: Request, res: Response) => {
    const patient = await storage.getPatientByAnimalNumber(req.params.animalNumber);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  });

  app.post("/api/patients", async (req: Request, res: Response) => {
    try {
      const patient = await storage.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: "Failed to create patient" });
    }
  });

  app.put("/api/patients/:id", async (req: Request, res: Response) => {
    const patient = await storage.updatePatient(req.params.id, req.body);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  });

  app.delete("/api/patients/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deletePatient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Visit Routes
  // ========================================

  app.get("/api/visits", async (_req: Request, res: Response) => {
    const visits = await storage.getAllVisits();
    res.json(visits);
  });

  app.get("/api/visits/:id", async (req: Request, res: Response) => {
    const visit = await storage.getVisit(req.params.id);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }
    res.json(visit);
  });

  app.post("/api/visits", async (req: Request, res: Response) => {
    try {
      const visit = await storage.createVisit(req.body);
      res.status(201).json(visit);
    } catch (error) {
      res.status(400).json({ error: "Failed to create visit" });
    }
  });

  app.put("/api/visits/:id", async (req: Request, res: Response) => {
    const visit = await storage.updateVisit(req.params.id, req.body);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }
    res.json(visit);
  });

  app.delete("/api/visits/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteVisit(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Visit not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Test Result Routes
  // ========================================

  app.get("/api/test-results", async (_req: Request, res: Response) => {
    const results = await storage.getAllTestResults();
    res.json(results);
  });

  app.get("/api/test-results/:id", async (req: Request, res: Response) => {
    const result = await storage.getTestResult(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Test result not found" });
    }
    res.json(result);
  });

  app.post("/api/test-results", async (req: Request, res: Response) => {
    try {
      const result = await storage.createTestResult(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Failed to create test result" });
    }
  });

  app.put("/api/test-results/:id", async (req: Request, res: Response) => {
    const result = await storage.updateTestResult(req.params.id, req.body);
    if (!result) {
      return res.status(404).json({ error: "Test result not found" });
    }
    res.json(result);
  });

  app.delete("/api/test-results/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteTestResult(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Test result not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Exam Master Routes
  // ========================================

  app.get("/api/exam-master", async (_req: Request, res: Response) => {
    const exams = await storage.getAllExamMaster();
    res.json(exams);
  });

  app.get("/api/exam-master/:id", async (req: Request, res: Response) => {
    const exam = await storage.getExamMaster(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json(exam);
  });

  app.post("/api/exam-master", async (req: Request, res: Response) => {
    try {
      const exam = await storage.createExamMaster(req.body);
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ error: "Failed to create exam" });
    }
  });

  app.put("/api/exam-master/:id", async (req: Request, res: Response) => {
    const exam = await storage.updateExamMaster(req.params.id, req.body);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json(exam);
  });

  app.delete("/api/exam-master/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteExamMaster(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Question Template Routes
  // ========================================

  app.get("/api/question-templates", async (_req: Request, res: Response) => {
    const templates = await storage.getAllQuestionTemplates();
    res.json(templates);
  });

  app.get("/api/question-templates/:id", async (req: Request, res: Response) => {
    const template = await storage.getQuestionTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  });

  app.post("/api/question-templates", async (req: Request, res: Response) => {
    try {
      const template = await storage.createQuestionTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: "Failed to create template" });
    }
  });

  app.put("/api/question-templates/:id", async (req: Request, res: Response) => {
    const template = await storage.updateQuestionTemplate(req.params.id, req.body);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  });

  app.delete("/api/question-templates/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteQuestionTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Questionnaire Response Routes
  // ========================================

  app.get("/api/questionnaire-responses", async (_req: Request, res: Response) => {
    const responses = await storage.getAllQuestionnaireResponses();
    res.json(responses);
  });

  app.get("/api/questionnaire-responses/:id", async (req: Request, res: Response) => {
    const response = await storage.getQuestionnaireResponse(req.params.id);
    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.json(response);
  });

  app.post("/api/questionnaire-responses", async (req: Request, res: Response) => {
    try {
      const response = await storage.createQuestionnaireResponse(req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: "Failed to create response" });
    }
  });

  app.put("/api/questionnaire-responses/:id", async (req: Request, res: Response) => {
    const response = await storage.updateQuestionnaireResponse(req.params.id, req.body);
    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.json(response);
  });

  app.delete("/api/questionnaire-responses/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteQuestionnaireResponse(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Response not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // User Filter Routes
  // ========================================

  app.get("/api/user-filters", async (_req: Request, res: Response) => {
    const filters = await storage.getAllUserFilters();
    res.json(filters);
  });

  app.get("/api/user-filters/:id", async (req: Request, res: Response) => {
    const filter = await storage.getUserFilter(req.params.id);
    if (!filter) {
      return res.status(404).json({ error: "Filter not found" });
    }
    res.json(filter);
  });

  app.post("/api/user-filters", async (req: Request, res: Response) => {
    try {
      const filter = await storage.createUserFilter(req.body);
      res.status(201).json(filter);
    } catch (error) {
      res.status(400).json({ error: "Failed to create filter" });
    }
  });

  app.put("/api/user-filters/:id", async (req: Request, res: Response) => {
    const filter = await storage.updateUserFilter(req.params.id, req.body);
    if (!filter) {
      return res.status(404).json({ error: "Filter not found" });
    }
    res.json(filter);
  });

  app.delete("/api/user-filters/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteUserFilter(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Filter not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // Cluster Analysis Routes
  // ========================================

  app.get("/api/cluster-analysis", async (_req: Request, res: Response) => {
    const clusters = await storage.getAllClusterAnalysis();
    res.json(clusters);
  });

  app.get("/api/cluster-analysis/:id", async (req: Request, res: Response) => {
    const cluster = await storage.getClusterAnalysis(req.params.id);
    if (!cluster) {
      return res.status(404).json({ error: "Cluster not found" });
    }
    res.json(cluster);
  });

  app.post("/api/cluster-analysis", async (req: Request, res: Response) => {
    try {
      const cluster = await storage.createClusterAnalysis(req.body);
      res.status(201).json(cluster);
    } catch (error) {
      res.status(400).json({ error: "Failed to create cluster" });
    }
  });

  app.put("/api/cluster-analysis/:id", async (req: Request, res: Response) => {
    const cluster = await storage.updateClusterAnalysis(req.params.id, req.body);
    if (!cluster) {
      return res.status(404).json({ error: "Cluster not found" });
    }
    res.json(cluster);
  });

  app.delete("/api/cluster-analysis/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteClusterAnalysis(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Cluster not found" });
    }
    res.status(204).send();
  });

  // ========================================
  // File Upload/Download Routes
  // ========================================

  app.post("/api/upload-excel", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // In a real implementation, parse the Excel file here
      // For now, return success
      res.json({ 
        message: "File uploaded successfully",
        filename: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  app.get("/api/download/:dataType", async (req: Request, res: Response) => {
    try {
      const { dataType } = req.params;
      
      // In a real implementation, generate Excel file from data
      // For now, return a simple response
      res.json({ 
        message: `Download ${dataType} data`,
        note: "Excel generation would be implemented here",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate download" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
