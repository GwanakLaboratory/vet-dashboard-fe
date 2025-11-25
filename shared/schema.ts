import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// 고객정보 (Customer/Patient Info)
// ========================================
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalNumber: text("animal_number").notNull().unique(), // 동물번호
  name: text("name").notNull(), // 동물명
  ownerName: text("owner_name"), // 보호자명
  species: text("species").default("개"), // 종 (기본값: 개)
  breed: text("breed"), // 품종
  gender: text("gender"), // 성별
  birthDate: text("birth_date"), // 생년월일
  registrationDate: text("registration_date"), // 등록일
  neutered: boolean("neutered"), // 중성화 여부
  weight: real("weight"), // 체중(kg)
  microchipNumber: text("microchip_number"), // 마이크로칩 번호
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

// ========================================
// 방문기록 (Visit Records)
// ========================================
export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalNumber: text("animal_number").notNull(), // 동물번호 (FK)
  visitDate: text("visit_date").notNull(), // 방문일
  visitType: text("visit_type"), // 방문유형 (예약/응급/정기검진)
  chiefComplaint: text("chief_complaint"), // 주증상
  diagnosis: text("diagnosis"), // 진단
  treatment: text("treatment"), // 처치
  status: text("status").default("완료"), // 상태 (예약/접수/진료중/완료)
  veterinarian: text("veterinarian"), // 수의사명
  notes: text("notes"), // 메모
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
});

export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;

// ========================================
// 문진 템플릿 (Questionnaire Templates)
// ========================================
export const questionTemplates = pgTable("question_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // 카테고리 (피부/소화기/호흡기/신경/비뇨기/근골격)
  question: text("question").notNull(), // 문항
  questionType: text("question_type").default("yes_no"), // 문항유형 (yes_no/multiple_choice/text)
  options: text("options").array(), // 선택지 (객관식인 경우)
  relatedBodyPart: text("related_body_part"), // 관련 신체 부위
  displayOrder: integer("display_order").default(0), // 표시 순서
});

export const insertQuestionTemplateSchema = createInsertSchema(questionTemplates).omit({
  id: true,
});

export type InsertQuestionTemplate = z.infer<typeof insertQuestionTemplateSchema>;
export type QuestionTemplate = typeof questionTemplates.$inferSelect;

// ========================================
// 문진 응답 (Questionnaire Responses)
// ========================================
export const questionnaireResponses = pgTable("questionnaire_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalNumber: text("animal_number").notNull(), // 동물번호 (FK)
  visitId: text("visit_id"), // 방문ID (FK, optional)
  questionId: text("question_id").notNull(), // 문항ID (FK)
  response: text("response").notNull(), // 응답
  responseDate: text("response_date").notNull(), // 응답일시
});

export const insertQuestionnaireResponseSchema = createInsertSchema(questionnaireResponses).omit({
  id: true,
});

export type InsertQuestionnaireResponse = z.infer<typeof insertQuestionnaireResponseSchema>;
export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;

// ========================================
// 검사 항목 마스터 (Exam Master - 일반 + 영상)
// ========================================
export const examMaster = pgTable("exam_master", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examCode: text("exam_code").notNull().unique(), // 검사코드
  examName: text("exam_name").notNull(), // 검사명
  examCategory: text("exam_category").notNull(), // 검사 카테고리 (CBC/간기능/신장기능/전해질/영상/기타)
  examType: text("exam_type").default("일반"), // 검사유형 (일반/영상)
  unit: text("unit"), // 단위
  normalRangeMin: real("normal_range_min"), // 정상범위 최소값
  normalRangeMax: real("normal_range_max"), // 정상범위 최대값
  normalRangeText: text("normal_range_text"), // 정상범위 텍스트 (정성적)
  relatedBodyPart: text("related_body_part"), // 관련 신체 부위 (liver/kidney/heart/skin/digestive 등)
  description: text("description"), // 설명
  isQuantitative: boolean("is_quantitative").default(true), // 정량적 검사 여부
});

export const insertExamMasterSchema = createInsertSchema(examMaster).omit({
  id: true,
});

export type InsertExamMaster = z.infer<typeof insertExamMasterSchema>;
export type ExamMaster = typeof examMaster.$inferSelect;

// ========================================
// 검사 결과 (Test Results)
// ========================================
export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalNumber: text("animal_number").notNull(), // 동물번호 (FK)
  visitId: text("visit_id"), // 방문ID (FK, optional)
  examCode: text("exam_code").notNull(), // 검사코드 (FK)
  testDate: text("test_date").notNull(), // 검사일
  value: real("value"), // 검사값 (정량적)
  valueText: text("value_text"), // 검사값 텍스트 (정성적)
  status: text("status").default("N"), // 상태 (H: High, N: Normal, L: Low)
  notes: text("notes"), // 메모
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
});

export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;

// ========================================
// 사용자 정의 필터 (User Filters)
// ========================================
export const userFilters = pgTable("user_filters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 필터명
  description: text("description"), // 설명
  filterType: text("filter_type").notNull(), // 필터 유형 (breed/age/exam/custom)
  filterCriteria: text("filter_criteria").notNull(), // 필터 조건 (JSON string)
  createdDate: text("created_date").notNull(), // 생성일
});

export const insertUserFilterSchema = createInsertSchema(userFilters).omit({
  id: true,
});

export type InsertUserFilter = z.infer<typeof insertUserFilterSchema>;
export type UserFilter = typeof userFilters.$inferSelect;

// ========================================
// 군집 분석 (Cluster Analysis)
// ========================================
export const clusterAnalysis = pgTable("cluster_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 군집명
  description: text("description"), // 설명
  clusterType: text("cluster_type").notNull(), // 군집 유형 (breed_group/age_group/exam_group/custom)
  memberAnimalNumbers: text("member_animal_numbers").array(), // 소속 동물번호 목록
  criteria: text("criteria"), // 군집 기준
  createdDate: text("created_date").notNull(), // 생성일
});

export const insertClusterAnalysisSchema = createInsertSchema(clusterAnalysis).omit({
  id: true,
});

export type InsertClusterAnalysis = z.infer<typeof insertClusterAnalysisSchema>;
export type ClusterAnalysis = typeof clusterAnalysis.$inferSelect;

// ========================================
// 약물 처방 (Medications)
// ========================================
export const medications = pgTable("medications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalNumber: text("animal_number").notNull(), // 동물번호 (FK)
  visitId: text("visit_id"), // 방문ID (FK, optional)
  name: text("name").notNull(), // 약물명
  dosage: text("dosage"), // 용량 (예: 10mg)
  frequency: text("frequency"), // 투여빈도 (예: BID, 1일 2회)
  duration: integer("duration"), // 투여기간 (일 단위)
  startDate: text("start_date").notNull(), // 시작일 (ISO Date)
  endDate: text("end_date"), // 종료일 (ISO Date)
  category: text("category"), // 약물 카테고리 (항생제/스테로이드/심장약 등)
  notes: text("notes"), // 메모
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

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
