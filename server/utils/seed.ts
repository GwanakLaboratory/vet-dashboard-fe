import {
    type InsertPatient,
    type InsertVisit,
    type InsertTestResult,
    type InsertExamMaster,
    type InsertQuestionTemplate,
    type InsertQuestionnaireResponse,
    type InsertMedication
} from "@shared/schema";
import { format } from "date-fns";
import type { IStorage } from "../storage";

export async function seedDatabase(storage: IStorage) {
    console.log("🌱 Starting database seeding...");

    // Check if data already exists
    const existingPatients = await storage.getAllPatients();
    if (existingPatients.length > 0) {
        console.log("✅ Database already seeded.");
        return;
    }

    // 1. Seed Patients
    const patients: InsertPatient[] = [
        {
            animalNumber: "A0001",
            name: "뽀삐1",
            ownerName: "김철수",
            species: "개",
            breed: "말티즈",
            gender: "수컷",
            birthDate: "2018-05-20",
            registrationDate: "2023-01-15",
            neutered: true,
            weight: 3.5,
            microchipNumber: "KR123456789"
        },
        {
            animalNumber: "A0002",
            name: "초코2",
            ownerName: "이영희",
            species: "개",
            breed: "푸들",
            gender: "암컷",
            birthDate: "2020-11-10",
            registrationDate: "2023-02-20",
            neutered: true,
            weight: 4.2,
            microchipNumber: "KR987654321"
        },
        {
            animalNumber: "A0003",
            name: "쿠키3",
            ownerName: "박민수",
            species: "개",
            breed: "치와와",
            gender: "수컷",
            birthDate: "2019-03-15",
            registrationDate: "2023-03-05",
            neutered: false,
            weight: 2.8,
            microchipNumber: null
        },
        {
            animalNumber: "A0004",
            name: "몽이4",
            ownerName: "최지은",
            species: "개",
            breed: "시츄",
            gender: "암컷",
            birthDate: "2017-08-22",
            registrationDate: "2023-01-10",
            neutered: true,
            weight: 5.5,
            microchipNumber: null
        },
        {
            animalNumber: "A0005",
            name: "루이5",
            ownerName: "정다은",
            species: "개",
            breed: "포메라니안",
            gender: "수컷",
            birthDate: "2021-01-30",
            registrationDate: "2023-04-12",
            neutered: false,
            weight: 3.0,
            microchipNumber: "KR112233445"
        }
    ];

    for (const patient of patients) {
        await storage.createPatient(patient);
    }
    console.log(`✅ Seeded ${patients.length} patients`);

    // 2. Seed Visits
    const visits: InsertVisit[] = [
        {
            animalNumber: "A0001",
            visitDate: "2023-05-01T10:00:00",
            visitType: "정기검진",
            chiefComplaint: "식욕 부진",
            diagnosis: "위장염",
            treatment: "약물 처방",
            status: "완료",
            veterinarian: "김수의사",
            notes: "소화기 증상 호전됨"
        },
        {
            animalNumber: "A0002",
            visitDate: "2023-06-15T14:30:00",
            visitType: "예방접종",
            chiefComplaint: "종합백신 접종",
            diagnosis: "특이사항 없음",
            treatment: "DHPPL 접종",
            status: "완료",
            veterinarian: "이수의사",
            notes: null
        },
        {
            animalNumber: "A0003",
            visitDate: "2023-07-20T09:15:00",
            visitType: "응급",
            chiefComplaint: "구토 및 설사",
            diagnosis: "식이 알러지",
            treatment: "주사 처치 및 처방식",
            status: "완료",
            veterinarian: "박수의사",
            notes: "간식 급여 중단 권고"
        },
        {
            animalNumber: "A0004",
            visitDate: "2023-08-05T11:00:00",
            visitType: "정기검진",
            chiefComplaint: "피부 가려움",
            diagnosis: "아토피 피부염",
            treatment: "약용 샴푸 처방",
            status: "진료중",
            veterinarian: "김수의사",
            notes: "주 2회 목욕 필요"
        },
        {
            animalNumber: "A0005",
            visitDate: "2023-09-10T16:45:00",
            visitType: "수술",
            chiefComplaint: "중성화 수술 상담",
            diagnosis: "수술 전 검사 양호",
            treatment: "수술 예약",
            status: "예약",
            veterinarian: "이수의사",
            notes: "다음 주 수술 예정"
        }
    ];

    for (const visit of visits) {
        await storage.createVisit(visit);
    }
    console.log(`✅ Seeded ${visits.length} visits`);

    // 3. Seed Exam Master & Test Results
    const examMasters: InsertExamMaster[] = [
        { examCode: "CBC_WBC", examName: "WBC", examCategory: "CBC", examType: "일반", unit: "10^3/μL", normalRangeMin: 6.0, normalRangeMax: 17.0, description: "백혈구 수", isQuantitative: true, normalRangeText: null, relatedBodyPart: null },
        { examCode: "CBC_RBC", examName: "RBC", examCategory: "CBC", examType: "일반", unit: "10^6/μL", normalRangeMin: 5.5, normalRangeMax: 8.5, description: "적혈구 수", isQuantitative: true, normalRangeText: null, relatedBodyPart: null },
        { examCode: "CHEM_ALT", examName: "ALT", examCategory: "Chemistry", examType: "일반", unit: "U/L", normalRangeMin: 10, normalRangeMax: 100, description: "간 효소 수치", isQuantitative: true, normalRangeText: null, relatedBodyPart: null },
        { examCode: "CHEM_CREA", examName: "Creatinine", examCategory: "Chemistry", examType: "일반", unit: "mg/dL", normalRangeMin: 0.5, normalRangeMax: 1.8, description: "신장 기능 수치", isQuantitative: true, normalRangeText: null, relatedBodyPart: null }
    ];

    for (const exam of examMasters) {
        const existing = await storage.getExamMasterByCode(exam.examCode);
        if (!existing) {
            await storage.createExamMaster(exam);
        }
    }
    console.log(`✅ Seeded ${examMasters.length} exam masters`);

    const testResults: InsertTestResult[] = [
        { animalNumber: "A0001", examCode: "CBC_WBC", testDate: "2023-05-01T10:30:00", value: 18.5, status: "H", notes: "염증 소견", visitId: null, valueText: null },
        { animalNumber: "A0001", examCode: "CBC_RBC", testDate: "2023-05-01T10:30:00", value: 6.2, status: "N", notes: null, visitId: null, valueText: null },
        { animalNumber: "A0003", examCode: "CHEM_ALT", testDate: "2023-07-20T09:45:00", value: 120, status: "H", notes: "간 수치 상승", visitId: null, valueText: null },
        { animalNumber: "A0003", examCode: "CHEM_CREA", testDate: "2023-07-20T09:45:00", value: 1.2, status: "N", notes: null, visitId: null, valueText: null }
    ];

    for (const result of testResults) {
        await storage.createTestResult(result);
    }
    console.log(`✅ Seeded ${testResults.length} test results`);

    // 4. Seed Question Templates
    const questionTemplates: InsertQuestionTemplate[] = [
        { category: "피부", question: "피부에 발진이나 붉은 반점이 있나요?", questionType: "yes_no", relatedBodyPart: "skin", displayOrder: 1, options: null },
        { category: "소화기", question: "구토 증상이 있나요?", questionType: "yes_no", relatedBodyPart: "digestive", displayOrder: 1, options: null },
        { category: "호흡기", question: "기침을 하나요?", questionType: "yes_no", relatedBodyPart: "respiratory", displayOrder: 1, options: null }
    ];

    for (const template of questionTemplates) {
        await storage.createQuestionTemplate(template);
    }
    console.log(`✅ Seeded ${questionTemplates.length} question templates`);

    console.log("✨ Database seeding completed!");
}
