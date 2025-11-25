import { subDays, subMonths, format } from "date-fns";

// 1. Patient Overview Data
export const mockPatient = {
    animalNumber: "10000001",
    name: "초코",
    owner: "김철수",
    breed: "말티즈 (Maltese)",
    gender: "Male (Castrated)",
    age: "8Y 3M",
    weight: "3.5kg",
    visitHistory: [
        { date: "2024-10-15", reason: "정기 건강검진" },
        { date: "2024-05-20", reason: "피부 발진" },
        { date: "2023-11-10", reason: "예방접종" },
    ],
    chiefComplaint: "식욕 부진 및 기력 저하",
    diagnosis: "승모판 폐쇄부전증 (MMVD) 의심",
};

// 2. Integrated Test Results (Quantitative)
export interface TestItem {
    id: string;
    category: string;
    name: string;
    result: number;
    unit: string;
    min: number;
    max: number;
    status: "Low" | "Normal" | "High";
    history: { date: string; value: number }[];
    synonyms: string[];
}

const generateHistory = (baseValue: number, count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        date: format(subMonths(new Date(), count - i), "yyyy-MM-dd"),
        value: Number((baseValue + (Math.random() * 10 - 5)).toFixed(2)),
    }));
};

export const mockTestResults: TestItem[] = [
    // Hematology
    {
        id: "H001",
        category: "Hematology",
        name: "RBC",
        result: 5.2,
        unit: "M/µL",
        min: 5.5,
        max: 8.5,
        status: "Low",
        history: generateHistory(6.0, 6),
        synonyms: ["red blood cell", "적혈구"],
    },
    {
        id: "H002",
        category: "Hematology",
        name: "HCT",
        result: 35.0,
        unit: "%",
        min: 37.0,
        max: 55.0,
        status: "Low",
        history: generateHistory(40.0, 6),
        synonyms: ["hematocrit", "헤마토크릿"],
    },
    {
        id: "H003",
        category: "Hematology",
        name: "WBC",
        result: 18.5,
        unit: "K/µL",
        min: 6.0,
        max: 17.0,
        status: "High",
        history: generateHistory(12.0, 6),
        synonyms: ["white blood cell", "백혈구"],
    },
    // Chemistry
    {
        id: "C001",
        category: "Chemistry",
        name: "BUN",
        result: 32.0,
        unit: "mg/dL",
        min: 7.0,
        max: 27.0,
        status: "High",
        history: generateHistory(20.0, 6),
        synonyms: ["blood urea nitrogen", "신장"],
    },
    {
        id: "C002",
        category: "Chemistry",
        name: "Creatinine",
        result: 1.8,
        unit: "mg/dL",
        min: 0.5,
        max: 1.8,
        status: "Normal",
        history: generateHistory(1.2, 6),
        synonyms: ["크레아티닌", "신장"],
    },
    {
        id: "C003",
        category: "Chemistry",
        name: "ALT",
        result: 150,
        unit: "U/L",
        min: 10,
        max: 125,
        status: "High",
        history: generateHistory(80, 6),
        synonyms: ["GPT", "liver", "간"],
    },
    {
        id: "C004",
        category: "Chemistry",
        name: "ALP",
        result: 210,
        unit: "U/L",
        min: 23,
        max: 212,
        status: "Normal",
        history: generateHistory(150, 6),
        synonyms: ["liver", "간"],
    },
    // Electrolytes
    {
        id: "E001",
        category: "Electrolytes",
        name: "Na",
        result: 145,
        unit: "mmol/L",
        min: 141,
        max: 152,
        status: "Normal",
        history: generateHistory(146, 6),
        synonyms: ["sodium", "나트륨"],
    },
    {
        id: "E002",
        category: "Electrolytes",
        name: "K",
        result: 4.2,
        unit: "mmol/L",
        min: 3.6,
        max: 5.8,
        status: "Normal",
        history: generateHistory(4.5, 6),
        synonyms: ["potassium", "칼륨"],
    },
];

// 3. Group Statistics
export const mockGroupStats = {
    distribution: [
        { range: "0-10", count: 5 },
        { range: "10-20", count: 15 },
        { range: "20-30", count: 45 },
        { range: "30-40", count: 25 },
        { range: "40-50", count: 10 },
    ],
    zScore: 1.5, // Example Z-score for a selected item
    averageValue: 28.5,
    myValue: 32.0,
};

// 4. Pre-diagnosis (Questionnaire)
export const mockQuestionnaire = {
    history: [
        { date: "2024-10-15", text: "최근 들어 산책 시 숨이 차하는 증상이 있음. 밤에 기침을 자주 함." },
        { date: "2024-05-20", text: "사료를 잘 먹지 않고 잠만 자려고 함." },
    ],
    normalizedSymptoms: ["호흡 곤란", "야간 기침", "식욕 부진", "기력 저하"],
};

// 5. Imaging Findings
export const mockImaging = [
    {
        id: 1,
        type: "X-Ray",
        title: "Thorax Lateral",
        thumbnail: "https://placehold.co/150x150/png?text=X-Ray",
        findings: ["VHS 11.5 (Normal < 10.5)", "Left Atrial Enlargement"],
        severity: "High",
    },
    {
        id: 2,
        type: "Ultrasound",
        title: "Abdomen",
        thumbnail: "https://placehold.co/150x150/png?text=US",
        findings: ["Mild sludge in gallbladder", "Kidney structure normal"],
        severity: "Low",
    },
];

// 6. Documents
export const mockDocuments = [
    { id: 1, name: "2024-10-15_BloodWork.pdf", type: "Lab Report", date: "2024-10-15" },
    { id: 2, name: "2024-10-15_ReferralLetter.pdf", type: "Referral", date: "2024-10-15" },
    { id: 3, name: "2023-11-10_VaccineCert.pdf", type: "Certificate", date: "2023-11-10" },
];

// 7. Admin / Data Integrity
export const mockAdminData = {
    missingFields: [
        { id: "P005", field: "Weight", patient: "바둑이" },
        { id: "P008", field: "Breed", patient: "나비" },
    ],
    nameConflicts: [
        { name: "초코", count: 3, ids: ["10000001", "10000045", "10000092"] },
    ],
};
