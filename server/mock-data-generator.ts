import type {
  InsertPatient,
  InsertVisit,
  InsertTestResult,
  InsertExamMaster,
  InsertQuestionTemplate,
  InsertQuestionnaireResponse,
  ExamMaster,
} from "@shared/schema";

// ========================================
// Mock Data Generator
// ========================================

const breeds = [
  "골든 리트리버",
  "푸들",
  "시츄",
  "말티즈",
  "포메라니안",
  "비글",
  "진도견",
  "코카 스파니엘",
  "요크셔 테리어",
  "닥스훈트",
];

const names = [
  "초코",
  "루비",
  "바둑이",
  "뽀삐",
  "코코",
  "마루",
  "구름",
  "별이",
  "해피",
  "럭키",
  "몽이",
  "복이",
];

const ownerNames = [
  "김민수",
  "이서연",
  "박지훈",
  "최수진",
  "정다은",
  "강현우",
  "조은지",
  "윤서준",
];

const genders = ["수컷", "암컷"];

// Generate random date between start and end
function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

// Generate random number in range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generate random int in range
function randomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========================================
// Patient Generator
// ========================================

export function generateMockPatients(count: number): InsertPatient[] {
  const patients: InsertPatient[] = [];
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

  for (let i = 1; i <= count; i++) {
    patients.push({
      animalNumber: `A${String(i).padStart(6, "0")}`,
      name: names[randomIntInRange(0, names.length - 1)],
      ownerName: ownerNames[randomIntInRange(0, ownerNames.length - 1)],
      species: "개",
      breed: breeds[randomIntInRange(0, breeds.length - 1)],
      gender: genders[randomIntInRange(0, genders.length - 1)],
      birthDate: randomDate(tenYearsAgo, twoYearsAgo),
      registrationDate: randomDate(twoYearsAgo, today),
      neutered: Math.random() > 0.5,
      weight: randomInRange(3, 30),
      microchipNumber: Math.random() > 0.3 ? `MC${String(i).padStart(10, "0")}` : null,
    });
  }

  return patients;
}

// ========================================
// Visit Generator
// ========================================

const visitTypes = ["정기검진", "응급", "예방접종", "일반진료"];
const chiefComplaints = [
  "피부 가려움증",
  "식욕 감퇴",
  "구토",
  "설사",
  "기침",
  "무기력",
  "절뚝거림",
  "안구 충혈",
];
const diagnoses = [
  "피부염",
  "위장염",
  "호흡기 감염",
  "관절염",
  "결막염",
  "정상",
  "알레르기",
];
const veterinarians = ["김수의사", "이수의사", "박수의사", "최수의사"];
const statuses = ["완료", "예약", "진료중"];

export function generateMockVisits(animalNumbers: string[], visitsPerPatient: number): InsertVisit[] {
  const visits: InsertVisit[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  for (const animalNumber of animalNumbers) {
    const visitCount = randomIntInRange(1, visitsPerPatient);
    for (let i = 0; i < visitCount; i++) {
      visits.push({
        animalNumber,
        visitDate: randomDate(oneYearAgo, today),
        visitType: visitTypes[randomIntInRange(0, visitTypes.length - 1)],
        chiefComplaint: chiefComplaints[randomIntInRange(0, chiefComplaints.length - 1)],
        diagnosis: diagnoses[randomIntInRange(0, diagnoses.length - 1)],
        treatment: Math.random() > 0.5 ? "약물 처방" : "경과 관찰",
        status: statuses[randomIntInRange(0, statuses.length - 1)],
        veterinarian: veterinarians[randomIntInRange(0, veterinarians.length - 1)],
        notes: Math.random() > 0.7 ? "다음 방문 시 재검사 필요" : null,
      });
    }
  }

  return visits;
}

// ========================================
// Exam Master Data
// ========================================

export function generateExamMaster(): InsertExamMaster[] {
  return [
    // CBC (Complete Blood Count)
    {
      examCode: "CBC_WBC",
      examName: "백혈구 수",
      examCategory: "CBC",
      examType: "일반",
      unit: "10^3/μL",
      normalRangeMin: 6.0,
      normalRangeMax: 17.0,
      normalRangeText: null,
      relatedBodyPart: null,
      description: "백혈구 수치 - 감염 및 면역 상태 평가",
      isQuantitative: true,
    },
    {
      examCode: "CBC_RBC",
      examName: "적혈구 수",
      examCategory: "CBC",
      examType: "일반",
      unit: "10^6/μL",
      normalRangeMin: 5.5,
      normalRangeMax: 8.5,
      normalRangeText: null,
      relatedBodyPart: null,
      description: "적혈구 수치 - 빈혈 및 산소 운반 능력 평가",
      isQuantitative: true,
    },
    {
      examCode: "CBC_HGB",
      examName: "혈색소",
      examCategory: "CBC",
      examType: "일반",
      unit: "g/dL",
      normalRangeMin: 12.0,
      normalRangeMax: 18.0,
      normalRangeText: null,
      relatedBodyPart: null,
      description: "혈색소 농도 - 빈혈 진단",
      isQuantitative: true,
    },

    // Liver Function
    {
      examCode: "LIVER_ALT",
      examName: "ALT (Alanine Aminotransferase)",
      examCategory: "간기능",
      examType: "일반",
      unit: "U/L",
      normalRangeMin: 10,
      normalRangeMax: 100,
      normalRangeText: null,
      relatedBodyPart: "liver",
      description: "간세포 손상 지표",
      isQuantitative: true,
    },
    {
      examCode: "LIVER_AST",
      examName: "AST (Aspartate Aminotransferase)",
      examCategory: "간기능",
      examType: "일반",
      unit: "U/L",
      normalRangeMin: 15,
      normalRangeMax: 66,
      normalRangeText: null,
      relatedBodyPart: "liver",
      description: "간 및 근육 손상 지표",
      isQuantitative: true,
    },
    {
      examCode: "LIVER_ALP",
      examName: "ALP (Alkaline Phosphatase)",
      examCategory: "간기능",
      examType: "일반",
      unit: "U/L",
      normalRangeMin: 20,
      normalRangeMax: 150,
      normalRangeText: null,
      relatedBodyPart: "liver",
      description: "담도 폐쇄 및 골질환 지표",
      isQuantitative: true,
    },
    {
      examCode: "LIVER_GGT",
      examName: "GGT (Gamma-Glutamyl Transferase)",
      examCategory: "간기능",
      examType: "일반",
      unit: "U/L",
      normalRangeMin: 0,
      normalRangeMax: 10,
      normalRangeText: null,
      relatedBodyPart: "liver",
      description: "담도계 질환 지표",
      isQuantitative: true,
    },

    // Kidney Function
    {
      examCode: "KIDNEY_BUN",
      examName: "BUN (Blood Urea Nitrogen)",
      examCategory: "신장기능",
      examType: "일반",
      unit: "mg/dL",
      normalRangeMin: 7,
      normalRangeMax: 27,
      normalRangeText: null,
      relatedBodyPart: "kidney",
      description: "신장 기능 평가",
      isQuantitative: true,
    },
    {
      examCode: "KIDNEY_CREA",
      examName: "Creatinine",
      examCategory: "신장기능",
      examType: "일반",
      unit: "mg/dL",
      normalRangeMin: 0.5,
      normalRangeMax: 1.8,
      normalRangeText: null,
      relatedBodyPart: "kidney",
      description: "신장 여과 기능 평가",
      isQuantitative: true,
    },

    // Electrolytes
    {
      examCode: "ELEC_NA",
      examName: "Sodium (Na)",
      examCategory: "전해질",
      examType: "일반",
      unit: "mmol/L",
      normalRangeMin: 140,
      normalRangeMax: 155,
      normalRangeText: null,
      relatedBodyPart: "kidney",
      description: "나트륨 농도 - 수분 균형 평가",
      isQuantitative: true,
    },
    {
      examCode: "ELEC_K",
      examName: "Potassium (K)",
      examCategory: "전해질",
      examType: "일반",
      unit: "mmol/L",
      normalRangeMin: 3.5,
      normalRangeMax: 5.8,
      normalRangeText: null,
      relatedBodyPart: "kidney",
      description: "칼륨 농도 - 심장 기능 및 근육 활동 평가",
      isQuantitative: true,
    },
    {
      examCode: "ELEC_CL",
      examName: "Chloride (Cl)",
      examCategory: "전해질",
      examType: "일반",
      unit: "mmol/L",
      normalRangeMin: 105,
      normalRangeMax: 120,
      normalRangeText: null,
      relatedBodyPart: "kidney",
      description: "염화물 농도 - 산-염기 균형 평가",
      isQuantitative: true,
    },

    // Imaging
    {
      examCode: "XRAY_CHEST",
      examName: "흉부 X-ray",
      examCategory: "영상",
      examType: "영상",
      unit: null,
      normalRangeMin: null,
      normalRangeMax: null,
      normalRangeText: "정상",
      relatedBodyPart: "heart",
      description: "심장 및 폐 구조 평가",
      isQuantitative: false,
    },
    {
      examCode: "XRAY_ABD",
      examName: "복부 X-ray",
      examCategory: "영상",
      examType: "영상",
      unit: null,
      normalRangeMin: null,
      normalRangeMax: null,
      normalRangeText: "정상",
      relatedBodyPart: "digestive",
      description: "복부 장기 구조 평가",
      isQuantitative: false,
    },
    {
      examCode: "ECHO_HEART",
      examName: "심장 초음파",
      examCategory: "영상",
      examType: "영상",
      unit: null,
      normalRangeMin: null,
      normalRangeMax: null,
      normalRangeText: "정상",
      relatedBodyPart: "heart",
      description: "심장 구조 및 기능 평가",
      isQuantitative: false,
    },
  ];
}

// ========================================
// Test Result Generator with Status Labeling
// ========================================

export function calculateTestStatus(
  value: number,
  normalMin: number | null,
  normalMax: number | null
): "H" | "N" | "L" {
  if (normalMin === null || normalMax === null) return "N";

  if (value > normalMax) return "H";
  if (value < normalMin) return "L";
  return "N";
}

export function generateMockTestResults(
  animalNumbers: string[],
  examMaster: ExamMaster[],
  resultsPerPatient: number
): InsertTestResult[] {
  const results: InsertTestResult[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  for (const animalNumber of animalNumbers) {
    const resultCount = randomIntInRange(5, resultsPerPatient);
    const selectedExams = examMaster
      .sort(() => Math.random() - 0.5)
      .slice(0, resultCount);

    for (const exam of selectedExams) {
      if (exam.isQuantitative && exam.normalRangeMin !== null && exam.normalRangeMax !== null) {
        // Generate value: 80% normal, 10% high, 10% low
        let value: number;
        const rand = Math.random();
        
        if (rand < 0.8) {
          // Normal range
          value = randomInRange(exam.normalRangeMin, exam.normalRangeMax);
        } else if (rand < 0.9) {
          // High
          value = randomInRange(exam.normalRangeMax, exam.normalRangeMax * 1.5);
        } else {
          // Low
          value = randomInRange(exam.normalRangeMin * 0.5, exam.normalRangeMin);
        }

        value = Math.round(value * 100) / 100; // Round to 2 decimal places

        const status = calculateTestStatus(value, exam.normalRangeMin, exam.normalRangeMax);

        results.push({
          animalNumber,
          visitId: null,
          examCode: exam.examCode,
          testDate: randomDate(oneYearAgo, today),
          value,
          valueText: null,
          status,
          notes: null,
        });
      } else {
        // Qualitative test
        const qualitativeResults = ["정상", "경증 이상", "중등도 이상"];
        results.push({
          animalNumber,
          visitId: null,
          examCode: exam.examCode,
          testDate: randomDate(oneYearAgo, today),
          value: null,
          valueText: qualitativeResults[randomIntInRange(0, qualitativeResults.length - 1)],
          status: "N",
          notes: null,
        });
      }
    }
  }

  return results;
}

// ========================================
// Question Template Generator
// ========================================

export function generateQuestionTemplates(): InsertQuestionTemplate[] {
  return [
    // Skin-related
    {
      category: "피부",
      question: "피부에 발진이나 붉은 반점이 있습니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "skin",
      displayOrder: 1,
    },
    {
      category: "피부",
      question: "과도한 긁기나 핥기 행동을 보입니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "skin",
      displayOrder: 2,
    },
    {
      category: "피부",
      question: "털이 비정상적으로 빠집니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "skin",
      displayOrder: 3,
    },

    // Digestive
    {
      category: "소화기",
      question: "구토 증상이 있습니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "digestive",
      displayOrder: 4,
    },
    {
      category: "소화기",
      question: "설사 증상이 있습니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "digestive",
      displayOrder: 5,
    },
    {
      category: "소화기",
      question: "식욕이 평소와 비교하여 어떻습니까?",
      questionType: "multiple_choice",
      options: ["정상", "증가", "감소", "없음"],
      relatedBodyPart: "digestive",
      displayOrder: 6,
    },

    // Respiratory
    {
      category: "호흡기",
      question: "기침을 합니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: null,
      displayOrder: 7,
    },
    {
      category: "호흡기",
      question: "호흡이 빠르거나 힘들어 보입니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "heart",
      displayOrder: 8,
    },

    // Neurological
    {
      category: "신경",
      question: "걸음걸이가 비정상적입니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: null,
      displayOrder: 9,
    },
    {
      category: "신경",
      question: "발작이나 경련이 있었습니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: null,
      displayOrder: 10,
    },

    // Urinary
    {
      category: "비뇨기",
      question: "배뇨 횟수가 평소와 다릅니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "kidney",
      displayOrder: 11,
    },
    {
      category: "비뇨기",
      question: "소변 색깔이 비정상적입니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: "kidney",
      displayOrder: 12,
    },

    // Musculoskeletal
    {
      category: "근골격",
      question: "절뚝거리거나 통증을 보입니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: null,
      displayOrder: 13,
    },
    {
      category: "근골격",
      question: "활동량이 감소했습니까?",
      questionType: "yes_no",
      options: null,
      relatedBodyPart: null,
      displayOrder: 14,
    },
  ];
}

// ========================================
// Questionnaire Response Generator
// ========================================

export function generateMockQuestionnaireResponses(
  animalNumbers: string[],
  questionTemplates: { id: string }[],
  responsesPerPatient: number
): InsertQuestionnaireResponse[] {
  const responses: InsertQuestionnaireResponse[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  for (const animalNumber of animalNumbers) {
    const responseCount = randomIntInRange(3, Math.min(responsesPerPatient, questionTemplates.length));
    const selectedQuestions = questionTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, responseCount);

    for (const question of selectedQuestions) {
      // Simple yes/no or multiple choice response
      const yesNoResponses = ["예", "아니오"];
      const response = yesNoResponses[randomIntInRange(0, yesNoResponses.length - 1)];

      responses.push({
        animalNumber,
        visitId: null,
        questionId: question.id,
        response,
        responseDate: randomDate(oneYearAgo, today),
      });
    }
  }

  return responses;
}
