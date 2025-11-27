import { subDays, subMonths, format } from "date-fns";

// 1. Patient Overview Data
export const mockPatient = {
    animalNumber: "10000001",
    name: "초코",
    species: "개 (Canine)", // Added species
    owner: "김철수",
    phone: "010-1234-5678",
    primaryVet: "김철수",
    breed: "말티즈 (Maltese)",
    gender: "Male (Castrated)",
    age: "8Y 3M",
    birthDate: "2016-02-15",
    weight: "3.5kg",
    weightTrend: -0.1,
    heartRate: 110,
    tags: ["주의 환자"],
    majorDiseases: ["슬개골 탈구", "피부염"],
    visitHistory: [
        { date: "2024-05-19", reason: "정기 건강검진" },
        { date: "2024-04-15", reason: "내과 진료" },
        { date: "2024-03-10", reason: "예방접종" },
        { date: "2024-01-05", reason: "초진" },
    ],
    chiefComplaint: "식욕 부진 및 기력 저하",
    diagnosis: "승모판 폐쇄부전증 (MMVD) 의심",
    registrationDate: "2024-01-05", // First visit date
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
    description?: string;
}

const generateHistory = (baseValue: number, count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        date: format(subMonths(new Date(), count - i), "yyyy-MM-dd"),
        value: Number((baseValue + (Math.random() * 10 - 5)).toFixed(2)),
    }));
};

export const mockTestResults: TestItem[] = [
    // 1. Basic Body Exam
    { id: "B001", category: "기본 신체검사", name: "Eye IOP (Lt)", result: 17, unit: "-", min: 15, max: 25, status: "Normal", history: generateHistory(17, 6), synonyms: [] },
    { id: "B002", category: "기본 신체검사", name: "Eye IOP (Rt)", result: 17, unit: "-", min: 15, max: 25, status: "Normal", history: generateHistory(17, 6), synonyms: [] },
    { id: "B003", category: "기본 신체검사", name: "Eye STT (Lt)", result: 20, unit: "-", min: 15, max: 25, status: "Normal", history: generateHistory(20, 6), synonyms: [] },
    { id: "B004", category: "기본 신체검사", name: "Eye STT (Rt)", result: 20, unit: "-", min: 15, max: 25, status: "Normal", history: generateHistory(20, 6), synonyms: [] },
    { id: "B005", category: "기본 신체검사", name: "BCS", result: 5, unit: "9-scale", min: 1, max: 9, status: "Normal", history: generateHistory(5, 6), synonyms: ["Body Condition Score"] },

    // 2. Urine Analysis
    { id: "U001", category: "소변검사", name: "USG", result: 1.010, unit: "-", min: 1.015, max: 1.045, status: "Low", history: generateHistory(1.015, 6), synonyms: ["Urine Specific Gravity"] }, // Adjusted min/max for dog
    { id: "U002", category: "소변검사", name: "pH", result: 8, unit: "-", min: 5.5, max: 7.5, status: "High", history: generateHistory(7.0, 6), synonyms: [] },
    { id: "U003", category: "소변검사", name: "SG", result: 1.005, unit: "-", min: 1.015, max: 1.045, status: "Low", history: generateHistory(1.010, 6), synonyms: [] },

    // 3. Urine UPC
    { id: "UP001", category: "소변-UPC", name: "UCRE", result: 35, unit: "mg/dL", min: 0, max: 0, status: "Normal", history: generateHistory(30, 6), synonyms: [] },
    { id: "UP002", category: "소변-UPC", name: "UPRO", result: 7, unit: "mg/dL", min: 0, max: 0, status: "Normal", history: generateHistory(5, 6), synonyms: [] },
    { id: "UP003", category: "소변-UPC", name: "UPC", result: 0.21, unit: "-", min: 0, max: 0.5, status: "Normal", history: generateHistory(0.2, 6), synonyms: [] },

    // 5. Cardiac Markers
    { id: "CM001", category: "심장표지자", name: "c.NT-proBNP", result: 922, unit: "pmol/L", min: 0, max: 900, status: "High", history: generateHistory(850, 6), synonyms: [], description: "심장 벽의 스트레스를 나타내는 지표로, 심부전(특히 MMVD)의 진단 및 모니터링에 중요합니다." },

    // 6. Serum Biochemistry (AU480)
    { id: "BA001", category: "혈청 생화학 (AU480)", name: "TP", result: 6.7, unit: "g/dL", min: 4.98, max: 7.58, status: "Normal", history: generateHistory(6.5, 6), synonyms: ["Total Protein"], description: "혈액 내 총 단백질 수치로, 탈수 상태나 염증, 간/신장 질환 여부를 파악하는 데 도움을 줍니다." },
    { id: "BA002", category: "혈청 생화학 (AU480)", name: "ALB", result: 3.77, unit: "g/dL", min: 2.4, max: 4.1, status: "Normal", history: generateHistory(3.5, 6), synonyms: ["Albumin"], description: "간에서 생성되는 주요 단백질로, 혈관 내 삼투압 유지 및 물질 운반 역할을 합니다. 간 기능 저하, 신장 질환 시 감소할 수 있습니다." },
    { id: "BA003", category: "혈청 생화학 (AU480)", name: "ALT", result: 46.1, unit: "U/L", min: 19, max: 77.9, status: "Normal", history: generateHistory(45, 6), synonyms: [], description: "간세포 손상 시 혈액으로 유출되는 효소로, 급성 간 손상의 민감한 지표입니다." },
    { id: "BA004", category: "혈청 생화학 (AU480)", name: "AST", result: 75, unit: "U/L", min: 13.7, max: 41, status: "High", history: generateHistory(40, 6), synonyms: [] },
    { id: "BA005", category: "혈청 생화학 (AU480)", name: "ALP(IFCC)", result: 27, unit: "U/L", min: 14, max: 93.2, status: "Normal", history: generateHistory(30, 6), synonyms: [], description: "담즙 정체, 쿠싱 증후군, 또는 뼈 성장 시 증가할 수 있는 효소입니다." },
    { id: "BA006", category: "혈청 생화학 (AU480)", name: "GGT", result: 2.7, unit: "U/L", min: 0, max: 14.1, status: "Normal", history: generateHistory(3, 6), synonyms: [], description: "담관 상피세포에 존재하는 효소로, 담즙 정체 시 ALP보다 더 민감하게 반응할 수 있습니다." },
    { id: "BA007", category: "혈청 생화학 (AU480)", name: "CALA", result: 10.3, unit: "mg/dL", min: 9.6, max: 12.5, status: "Normal", history: generateHistory(10, 6), synonyms: ["Calcium"] },
    { id: "BA008", category: "혈청 생화학 (AU480)", name: "TRIG", result: 32, unit: "mg/dL", min: 37.5, max: 130, status: "Low", history: generateHistory(40, 6), synonyms: ["Triglycerides"] },
    { id: "BA009", category: "혈청 생화학 (AU480)", name: "CREA", result: 0.78, unit: "mg/dL", min: 0.24, max: 1.17, status: "Normal", history: generateHistory(0.8, 6), synonyms: ["Creatinine"], description: "근육 대사 산물로 신장을 통해 배설됩니다. 신장 기능 저하(GFR 감소)의 주요 지표입니다." },
    { id: "BA010", category: "혈청 생화학 (AU480)", name: "UREA", result: 11.76, unit: "mg/dL", min: 10, max: 31.9, status: "Normal", history: generateHistory(12, 6), synonyms: ["BUN"], description: "단백질 대사 산물로 신장을 통해 배설됩니다. 신장 기능뿐만 아니라 탈수, 식이 단백질 섭취량, 위장관 출혈 등의 영향을 받습니다." },
    { id: "BA011", category: "혈청 생화학 (AU480)", name: "PHOS", result: 1.65, unit: "mg/dL", min: 2.2, max: 6.3, status: "Low", history: generateHistory(2.5, 6), synonyms: ["Phosphorus"] },
    { id: "BA012", category: "혈청 생화학 (AU480)", name: "GLU", result: 122, unit: "mg/dL", min: 72.9, max: 115.5, status: "High", history: generateHistory(110, 6), synonyms: ["Glucose"], description: "혈당 수치입니다. 지속적인 상승은 당뇨병을, 급격한 하락은 저혈당 쇼크 등을 시사합니다. 스트레스에 의해 일시적으로 상승할 수 있습니다." },
    { id: "BA013", category: "혈청 생화학 (AU480)", name: "CHOL", result: 147, unit: "mg/dL", min: 133.2, max: 309.8, status: "Normal", history: generateHistory(150, 6), synonyms: ["Cholesterol"] },
    { id: "BA014", category: "혈청 생화학 (AU480)", name: "TBIL(C)", result: 0.08, unit: "mg/dL", min: 0, max: 0.29, status: "Normal", history: generateHistory(0.1, 6), synonyms: ["Total Bilirubin"] },

    // 7. Serum Biochemistry (Catalyst)
    { id: "BC001", category: "혈청 생화학 (Catalyst)", name: "ALT", result: 60, unit: "U/L", min: 10, max: 125, status: "Normal", history: generateHistory(55, 6), synonyms: [], description: "간세포 손상 시 혈액으로 유출되는 효소로, 급성 간 손상의 민감한 지표입니다." },
    { id: "BC002", category: "혈청 생화학 (Catalyst)", name: "AST", result: 79, unit: "U/L", min: 0, max: 50, status: "High", history: generateHistory(45, 6), synonyms: [] },
    { id: "BC003", category: "혈청 생화학 (Catalyst)", name: "ALKP", result: 25, unit: "U/L", min: 23, max: 212, status: "Normal", history: generateHistory(30, 6), synonyms: ["ALP"], description: "담즙 정체, 쿠싱 증후군, 또는 뼈 성장 시 증가할 수 있는 효소입니다." },
    { id: "BC004", category: "혈청 생화학 (Catalyst)", name: "GGT", result: 3, unit: "U/L", min: 0, max: 11, status: "Normal", history: generateHistory(2, 6), synonyms: [], description: "담관 상피세포에 존재하는 효소로, 담즙 정체 시 ALP보다 더 민감하게 반응할 수 있습니다." },
    { id: "BC005", category: "혈청 생화학 (Catalyst)", name: "TBIL", result: 0.2, unit: "mg/dL", min: 0, max: 0.9, status: "Normal", history: generateHistory(0.2, 6), synonyms: [] },
    { id: "BC006", category: "혈청 생화학 (Catalyst)", name: "TCHO", result: 134, unit: "mg/dL", min: 110, max: 320, status: "Normal", history: generateHistory(140, 6), synonyms: [] },
    { id: "BC007", category: "혈청 생화학 (Catalyst)", name: "SDMA", result: 9, unit: "μg/dL", min: 0, max: 14, status: "Normal", history: generateHistory(10, 6), synonyms: [], description: "신장 기능의 조기 지표로, 크레아티닌보다 더 빨리 신장 기능 저하를 반영하며 근육량의 영향을 덜 받습니다." },
    { id: "BC008", category: "혈청 생화학 (Catalyst)", name: "BUN", result: 9, unit: "mg/dL", min: 7, max: 27, status: "Normal", history: generateHistory(10, 6), synonyms: [], description: "단백질 대사 산물로 신장을 통해 배설됩니다. 신장 기능뿐만 아니라 탈수, 식이 단백질 섭취량, 위장관 출혈 등의 영향을 받습니다." },
    { id: "BC009", category: "혈청 생화학 (Catalyst)", name: "CREA", result: 0.9, unit: "mg/dL", min: 0.5, max: 1.8, status: "Normal", history: generateHistory(0.9, 6), synonyms: [], description: "근육 대사 산물로 신장을 통해 배설됩니다. 신장 기능 저하(GFR 감소)의 주요 지표입니다." },
    { id: "BC010", category: "혈청 생화학 (Catalyst)", name: "PHOS", result: 1.7, unit: "mg/dL", min: 2.5, max: 6.8, status: "Low", history: generateHistory(2.8, 6), synonyms: [] },
    { id: "BC011", category: "혈청 생화학 (Catalyst)", name: "Ca", result: 9.9, unit: "mg/dL", min: 7.9, max: 12, status: "Normal", history: generateHistory(10, 6), synonyms: [] },
    { id: "BC012", category: "혈청 생화학 (Catalyst)", name: "TP", result: 6.3, unit: "g/dL", min: 5.2, max: 8.2, status: "Normal", history: generateHistory(6.5, 6), synonyms: [], description: "혈액 내 총 단백질 수치로, 탈수 상태나 염증, 간/신장 질환 여부를 파악하는 데 도움을 줍니다." },
    { id: "BC013", category: "혈청 생화학 (Catalyst)", name: "ALB", result: 3.6, unit: "g/dL", min: 2.3, max: 4, status: "Normal", history: generateHistory(3.5, 6), synonyms: [], description: "간에서 생성되는 주요 단백질로, 혈관 내 삼투압 유지 및 물질 운반 역할을 합니다. 간 기능 저하, 신장 질환 시 감소할 수 있습니다." },
    { id: "BC014", category: "혈청 생화학 (Catalyst)", name: "GLOB", result: 2.7, unit: "g/dL", min: 2.5, max: 4.5, status: "Normal", history: generateHistory(3.0, 6), synonyms: [], description: "면역 단백질(항체 등)을 포함하며, 만성 염증이나 감염 시 증가할 수 있습니다." },
    { id: "BC015", category: "혈청 생화학 (Catalyst)", name: "GLU", result: 116, unit: "mg/dL", min: 74, max: 143, status: "Normal", history: generateHistory(110, 6), synonyms: [], description: "혈당 수치입니다. 지속적인 상승은 당뇨병을, 급격한 하락은 저혈당 쇼크 등을 시사합니다. 스트레스에 의해 일시적으로 상승할 수 있습니다." },
    { id: "BC016", category: "혈청 생화학 (Catalyst)", name: "Na", result: 148, unit: "mmol/L", min: 144, max: 160, status: "Normal", history: generateHistory(148, 6), synonyms: [] },
    { id: "BC017", category: "혈청 생화학 (Catalyst)", name: "K", result: 4.7, unit: "mmol/L", min: 3.5, max: 5.8, status: "Normal", history: generateHistory(4.5, 6), synonyms: [] },
    { id: "BC018", category: "혈청 생화학 (Catalyst)", name: "Cl", result: 113, unit: "mmol/L", min: 109, max: 122, status: "Normal", history: generateHistory(115, 6), synonyms: [] },
    { id: "BC019", category: "혈청 생화학 (Catalyst)", name: "LIPA", result: 588, unit: "U/L", min: 200, max: 1800, status: "Normal", history: generateHistory(500, 6), synonyms: [] },
    { id: "BC020", category: "혈청 생화학 (Catalyst)", name: "AMYL", result: 344, unit: "U/L", min: 500, max: 1500, status: "Low", history: generateHistory(600, 6), synonyms: [] },

    // 8. Inflammation & Pancreas
    { id: "IP001", category: "염증표지자", name: "Canine CRP", result: 5, unit: "mg/L", min: 0, max: 20, status: "Normal", history: generateHistory(5, 6), synonyms: [] },
    { id: "IP002", category: "췌장표지자", name: "cPL", result: 25, unit: "ng/mL", min: 0, max: 200, status: "Normal", history: generateHistory(30, 6), synonyms: [] },

    // 9. CBC (XN-V)
    { id: "CBC001", category: "CBC", name: "WBC", result: 10.45, unit: "10^3/μL", min: 5.6, max: 20.4, status: "Normal", history: generateHistory(10, 6), synonyms: [] },
    { id: "CBC002", category: "CBC", name: "RBC", result: 7.15, unit: "10^6/μL", min: 5.1, max: 7.6, status: "Normal", history: generateHistory(7.0, 6), synonyms: [] },
    { id: "CBC003", category: "CBC", name: "HGB", result: 17.6, unit: "g/dL", min: 12.4, max: 19.2, status: "Normal", history: generateHistory(17, 6), synonyms: [] },
    { id: "CBC004", category: "CBC", name: "HCT", result: 45.6, unit: "%", min: 35, max: 52, status: "Normal", history: generateHistory(45, 6), synonyms: [] },
    { id: "CBC005", category: "CBC", name: "MCV", result: 63.8, unit: "fL", min: 60, max: 71, status: "Normal", history: generateHistory(64, 6), synonyms: [] },
    { id: "CBC006", category: "CBC", name: "MCH", result: 24.6, unit: "pg", min: 21.9, max: 26.3, status: "Normal", history: generateHistory(24, 6), synonyms: [] },
    { id: "CBC007", category: "CBC", name: "MCHC", result: 38.6, unit: "g/dL", min: 34.4, max: 38.1, status: "High", history: generateHistory(36, 6), synonyms: [] },
    { id: "CBC008", category: "CBC", name: "PLT", result: 237, unit: "10^3/μL", min: 64, max: 613, status: "Normal", history: generateHistory(250, 6), synonyms: [] },
    { id: "CBC009", category: "CBC", name: "NEUT#", result: 7.98, unit: "10^3/μL", min: 2.9, max: 13.6, status: "Normal", history: generateHistory(8, 6), synonyms: [] },
    { id: "CBC010", category: "CBC", name: "LYM#", result: 1.91, unit: "10^3/μL", min: 1.1, max: 5.3, status: "Normal", history: generateHistory(2, 6), synonyms: [] },
    { id: "CBC011", category: "CBC", name: "MONO#", result: 0.46, unit: "10^3/μL", min: 0.4, max: 1.6, status: "Normal", history: generateHistory(0.5, 6), synonyms: [] },
    { id: "CBC012", category: "CBC", name: "EO#", result: 0.09, unit: "10^3/μL", min: 0.1, max: 3.1, status: "Low", history: generateHistory(0.2, 6), synonyms: [] },
    { id: "CBC013", category: "CBC", name: "RET%", result: 1.13, unit: "%", min: 0.3, max: 2.37, status: "Normal", history: generateHistory(1.0, 6), synonyms: [] },
    { id: "CBC014", category: "CBC", name: "RET#", result: 0.0808, unit: "10^6/μL", min: 0.0194, max: 0.1501, status: "Normal", history: generateHistory(0.08, 6), synonyms: [] },

    // 10. Blood Gas
    { id: "BG001", category: "혈액가스", name: "pH", result: 7.36, unit: "-", min: 7.31, max: 7.46, status: "Normal", history: generateHistory(7.4, 6), synonyms: [] },
    { id: "BG002", category: "혈액가스", name: "pCO2", result: 42, unit: "mmHg", min: 27, max: 50, status: "Normal", history: generateHistory(40, 6), synonyms: [] },
    { id: "BG003", category: "혈액가스", name: "pO2", result: 26, unit: "mmHg", min: 24, max: 48, status: "Normal", history: generateHistory(30, 6), synonyms: [] },
    { id: "BG004", category: "혈액가스", name: "Na+", result: 142, unit: "mmol/L", min: 139, max: 151, status: "Normal", history: generateHistory(145, 6), synonyms: [] },
    { id: "BG005", category: "혈액가스", name: "K+", result: 6.1, unit: "mmol/L", min: 3.6, max: 5.3, status: "High", history: generateHistory(4.5, 6), synonyms: [] },
    { id: "BG006", category: "혈액가스", name: "Cl-", result: 111, unit: "mmol/L", min: 107, max: 122, status: "Normal", history: generateHistory(110, 6), synonyms: [] },
    { id: "BG007", category: "혈액가스", name: "Ca++", result: 1.31, unit: "mmol/L", min: 1.16, max: 1.47, status: "Normal", history: generateHistory(1.3, 6), synonyms: [] },
    { id: "BG008", category: "혈액가스", name: "Hct", result: 48, unit: "%", min: 32, max: 55, status: "Normal", history: generateHistory(45, 6), synonyms: [] },
    { id: "BG009", category: "혈액가스", name: "Glu", result: 114, unit: "mg/dL", min: 74, max: 143, status: "Normal", history: generateHistory(110, 6), synonyms: [] },
    { id: "BG010", category: "혈액가스", name: "Lac", result: 3.7, unit: "mmol/L", min: 0.5, max: 2.5, status: "High", history: generateHistory(1.5, 6), synonyms: ["Lactate"] },
    { id: "BG011", category: "혈액가스", name: "tHb", result: 17.7, unit: "g/dL", min: 13.5, max: 17.5, status: "High", history: generateHistory(15, 6), synonyms: [] },
    { id: "BG012", category: "혈액가스", name: "BEecf", result: -1.7, unit: "mmol/L", min: -7, max: 2.9, status: "Normal", history: generateHistory(-1, 6), synonyms: [] },
    { id: "BG013", category: "혈액가스", name: "HCO3-", result: 23.7, unit: "mmol/L", min: 21, max: 28, status: "Normal", history: generateHistory(24, 6), synonyms: [] },
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
        {
            date: "2024-05-21",
            author: "보호자 작성",
            text: "최근에 밥을 잘 안 먹고 기운이 없어 보여요. 산책도 가기 싫어합니다.",
            tags: ["식욕부진", "활력저하"]
        },
        {
            date: "2024-05-20",
            author: "보호자 작성",
            text: "사료를 잘 먹지 않고 잠만 자려고 함.",
            tags: ["식욕부진"]
        },
        {
            date: "2024-05-19",
            author: "보호자 작성",
            text: "밤에 기침을 조금 하는 것 같아요.",
            tags: ["기침"]
        },
    ],
    selectedDetail: {
        date: "2024-05-21",
        originalText: `"어제부터 사료를 거의 안 먹고 물만 조금 마셔요. 좋아하는 간식을 줘도 냄새만 맡고 안 먹네요.
        그리고 평소보다 잠을 많이 자고 산책 나가자고 해도 현관에서 안 움직이려고 해요.
        구토나 설사는 아직 없었습니다."`,
        chiefComplaint: "식욕 부진, 활력 저하, 운동 불내성",
        specialNote: "소화기 증상(구토/설사) 없음",
        keywords: [
            { text: "식욕부진", type: "default" },
            { text: "기력저하", type: "default" },
            { text: "구토없음", type: "outline" },
            { text: "설사없음", type: "outline" },
        ]
    },
    normalizedSymptoms: ["호흡 곤란", "야간 기침", "식욕 부진", "기력 저하"],
};

// 5. Imaging Findings
export const mockImaging = {
    thumbnails: [
        {
            id: 1,
            label: "X-ray 1",
            path: "/documents/EXPORT_93_핑핑이(토이푸들)_20250922081143_1_thumb.jpg"
        },
        {
            id: 2,
            label: "X-ray 2",
            path: "/documents/EXPORT_93_핑핑이(토이푸들)_20250922081143_2_thumb.jpg"
        },
        {
            id: 3,
            label: "X-ray 3",
            path: "/documents/EXPORT_93_핑핑이(토이푸들)_20250922081143_3_thumb.jpg"
        },
        {
            id: 4,
            label: "US 1",
            path: "/documents/EXPORT_93_핑핑이(토이푸들)_20250922081143_4_thumb.jpg"
        },
    ],
    findings: {
        title: "영상 판독 소견",
        description: `흉부 방사선 상 심비대 소견 관찰됨 (VHS 11.5).
        좌심방 확장이 의심되며, 폐수종 소견은 명확하지 않음.
        기관지 패턴이 일부 관찰되나 노령성 변화로 추정됨.`,
        measurements: [
            { label: "VHS", value: "11.5", status: "High" },
            { label: "VLAS", value: "2.1", status: "Normal" },
        ]
    }
};

// 6. Documents
export const mockDocuments = [
    {
        id: "doc-1",
        name: "핑핑 검진결과서.pdf",
        date: "2024-05-25",
        type: "검진결과",
        path: "/documents/핑핑 검진결과서.pdf"
    },
    {
        id: "doc-2",
        name: "핑핑 사전문진표.pdf",
        date: "2024-05-19",
        type: "문진표",
        path: "/documents/핑핑 사전문진표.pdf"
    },
    {
        id: "doc-3",
        name: "핑핑 외부의뢰 (그린벳).pdf",
        date: "2024-05-21",
        type: "외부의뢰",
        path: "/documents/핑핑_문진결과.pdf"
    },
    {
        id: "doc-4",
        name: "구름(20250096_하늘).pdf",
        date: "2024-04-15",
        type: "검진결과",
        path: "/documents/구름(20250096_하늘).pdf"
    },
    {
        id: "doc-5",
        name: "까미(20250097_하늘).pdf",
        date: "2024-04-15",
        type: "검진결과",
        path: "/documents/까미(20250097_하늘).pdf"
    },
    {
        id: "doc-6",
        name: "핑핑이 소견.txt",
        date: "2024-03-10",
        type: "소견서",
        path: "/documents/핑핑이 소견.txt"
    }
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


// 8. Visit Timeline Data
export interface VisitTimelineItem {
    date: string;
    title: string;
    status: "completed" | "scheduled";
    description: string;
    dataAvailable: {
        type: "questionnaire" | "lab" | "imaging" | "document" | "referral" | "report";
        date: string;
        label: string;
        documentId?: string; // For linking to specific documents
    }[];
}

export const mockVisitTimeline: VisitTimelineItem[] = [
    {
        date: "2024-05-19",
        title: "정기 검진 방문",
        status: "completed",
        description: "정기 건강검진 및 검사 진행",
        dataAvailable: [
            {
                type: "questionnaire",
                date: "2024-05-19",
                label: "사전문진표",
                documentId: "doc-2"
            },
            {
                type: "lab",
                date: "2024-05-20",
                label: "혈액검사 결과"
            },
            {
                type: "referral",
                date: "2024-05-21",
                label: "외부 진료결과 (그린벳)",
                documentId: "doc-3"
            },
            {
                type: "imaging",
                date: "2024-05-22",
                label: "영상 및 소견"
            },
            {
                type: "report",
                date: "2024-05-25",
                label: "검진결과서",
                documentId: "doc-1"
            }
        ]
    },
    {
        date: "2024-04-15",
        title: "내과 진료",
        status: "completed",
        description: "구토 및 설사 증상",
        dataAvailable: [
            {
                type: "lab",
                date: "2024-04-15",
                label: "혈액검사"
            },
            {
                type: "imaging",
                date: "2024-04-15",
                label: "복부 초음파"
            }
        ]
    },
    {
        date: "2024-03-10",
        title: "예방접종",
        status: "completed",
        description: "종합백신 5차",
        dataAvailable: [
            {
                type: "document",
                date: "2024-03-10",
                label: "접종 기록",
                documentId: "doc-6"
            }
        ]
    },
    {
        date: "2024-01-05",
        title: "초진",
        status: "completed",
        description: "기초 건강검진",
        dataAvailable: [
            {
                type: "lab",
                date: "2024-01-05",
                label: "기초 혈액검사"
            },
            {
                type: "imaging",
                date: "2024-01-05",
                label: "기본 X-ray"
            }
        ]
    },
];

// 9. Research Dashboard Data
export const mockResearchData = {
    // Test Result Statistics
    testResultSummary: {
        total: 145,
        abnormal: 28,
        critical: 5,
        normalRate: 0.807, // (145-28)/145
        byCategory: [
            { category: "기본 신체검사", total: 5, abnormal: 0, critical: 0 },
            { category: "소변검사", total: 3, abnormal: 3, critical: 0 },
            { category: "소변-UPC", total: 3, abnormal: 0, critical: 0 },
            { category: "심장표지자", total: 1, abnormal: 1, critical: 1 },
            { category: "혈청 생화학 (AU480)", total: 14, abnormal: 4, critical: 0 },
            { category: "혈청 생화학 (Catalyst)", total: 20, abnormal: 3, critical: 0 },
            { category: "염증표지자", total: 1, abnormal: 0, critical: 0 },
            { category: "췌장표지자", total: 1, abnormal: 0, critical: 0 },
            { category: "CBC", total: 14, abnormal: 2, critical: 0 },
            { category: "혈액가스", total: 13, abnormal: 4, critical: 1 },
        ]
    },

    // Critical Value Alerts
    criticalValues: [
        { patientId: "P-2024001", patientName: "초코", testId: "CM001", testName: "c.NT-proBNP", value: 922, unit: "pmol/L", threshold: 900, date: "2024-05-20" },
        { patientId: "P-2024003", patientName: "바둑이", testId: "BG010", testName: "Lactate", value: 3.7, unit: "mmol/L", threshold: 2.5, date: "2024-05-18" },
        { patientId: "P-2024007", patientName: "구름", testId: "BG005", testName: "K+", value: 6.1, unit: "mmol/L", threshold: 5.3, date: "2024-05-15" },
        { patientId: "P-2024012", patientName: "코코", testId: "BA004", testName: "AST", value: 75, unit: "U/L", threshold: 41, date: "2024-05-22" },
        { patientId: "P-2024015", patientName: "몽이", testId: "BG011", testName: "tHb", value: 17.7, unit: "g/dL", threshold: 17.5, date: "2024-05-19" },
    ],

    // Biomarker Trends (monthly median values)
    biomarkerTrends: [
        {
            month: "1월",
            "NT-proBNP": 650,
            "Creatinine": 0.85,
            "ALT": 42,
            "BUN": 12,
            "Glucose": 105
        },
        {
            month: "2월",
            "NT-proBNP": 680,
            "Creatinine": 0.88,
            "ALT": 45,
            "BUN": 13,
            "Glucose": 108
        },
        {
            month: "3월",
            "NT-proBNP": 720,
            "Creatinine": 0.82,
            "ALT": 48,
            "BUN": 11,
            "Glucose": 110
        },
        {
            month: "4월",
            "NT-proBNP": 780,
            "Creatinine": 0.90,
            "ALT": 50,
            "BUN": 14,
            "Glucose": 112
        },
        {
            month: "5월",
            "NT-proBNP": 850,
            "Creatinine": 0.92,
            "ALT": 52,
            "BUN": 13,
            "Glucose": 115
        },
        {
            month: "6월",
            "NT-proBNP": 922,
            "Creatinine": 0.95,
            "ALT": 55,
            "BUN": 15,
            "Glucose": 118
        },
    ],

    // Disease-specific correlations
    diseaseCorrelations: {
        "MMVD": {
            keyBiomarkers: ["NT-proBNP", "VHS"],
            abnormalityRate: 0.85,
            patientCount: 16,
            avgNTproBNP: 922
        },
        "CKD": {
            keyBiomarkers: ["Creatinine", "BUN", "SDMA", "USG"],
            abnormalityRate: 0.92,
            patientCount: 10,
            avgCreatinine: 1.8
        },
        "간질환": {
            keyBiomarkers: ["ALT", "AST", "ALP", "TBIL"],
            abnormalityRate: 0.78,
            patientCount: 8,
            avgALT: 85
        },
        "당뇨": {
            keyBiomarkers: ["Glucose", "Fructosamine"],
            abnormalityRate: 0.95,
            patientCount: 5,
            avgGlucose: 245
        }
    },

    // Test volume metrics
    testVolumeMetrics: {
        dailyAverage: 12,
        weeklyTotal: 84,
        monthlyTotal: 360,
        avgTurnaroundTime: 4.5, // hours
        peakHours: ["09:00-11:00", "14:00-16:00"]
    },

    // Age distribution (kept for compatibility)
    ageDistribution: [
        { name: "Puppy (<2)", value: 150, fill: "#8884d8" },
        { name: "Adult (2-7)", value: 450, fill: "#82ca9d" },
        { name: "Senior (7+)", value: 300, fill: "#ffc658" },
        { name: "Geriatric (12+)", value: 120, fill: "#ff8042" },
    ],

    // Diagnosis trend (kept for compatibility)
    diagnosisTrend: [
        { month: "1월", mmvd: 12, patella: 18, ckd: 5 },
        { month: "2월", mmvd: 15, patella: 20, ckd: 7 },
        { month: "3월", mmvd: 18, patella: 15, ckd: 8 },
        { month: "4월", mmvd: 22, patella: 25, ckd: 10 },
        { month: "5월", mmvd: 20, patella: 22, ckd: 9 },
        { month: "6월", mmvd: 25, patella: 28, ckd: 12 },
    ],

    // Breed distribution (kept for compatibility)
    breedDistribution: [
        { name: "말티즈", count: 320 },
        { name: "푸들", count: 280 },
        { name: "포메라니안", count: 210 },
        { name: "치와와", count: 150 },
        { name: "시츄", count: 90 },
    ],

    // Enhanced patient data with test result linkages
    patients: Array.from({ length: 50 }).map((_, i) => {
        const baseId = 2024001 + i;
        const diagnoses = ['MMVD (B1)', 'MMVD (B2)', '슬개골 탈구 (2기)', '슬개골 탈구 (3기)', '만성 신부전', '아토피 피부염', '건강함', '간질환', '당뇨'];
        const breeds = ['말티즈', '푸들', '포메라니안', '치와와', '시츄'];
        const diagnosis = diagnoses[i % diagnoses.length];

        let diseaseStage = null;
        if (diagnosis.includes('MMVD')) diseaseStage = diagnosis.includes('B2') ? 'B2' : 'B1';
        else if (diagnosis.includes('신부전')) diseaseStage = `CKD Stage ${(i % 3) + 1}`;
        else if (diagnosis.includes('슬개골')) diseaseStage = `Grade ${diagnosis.includes('3기') ? '3' : '2'}`;

        // Generate dynamic test results based on mockTestResults
        const testResults: Record<string, any> = {};
        const testResultIds: string[] = [];

        mockTestResults.forEach(test => {
            // Base value from the mock test item
            let value = test.result;

            // Adjust based on diagnosis
            if (diagnosis.includes('신부전') && ['CREA', 'BUN', 'SDMA', 'PHOS'].includes(test.name)) {
                value = value * (1.5 + Math.random());
            } else if (diagnosis.includes('간질환') && ['ALT', 'AST', 'ALP', 'GGT'].includes(test.name)) {
                value = value * (2 + Math.random() * 3);
            } else if (diagnosis.includes('MMVD') && ['c.NT-proBNP'].includes(test.name)) {
                value = value * (1.2 + Math.random());
            } else if (diagnosis.includes('당뇨') && ['GLU', 'FRUC'].includes(test.name)) {
                value = value * (1.5 + Math.random());
            } else {
                // Random variation for normal values
                value = value * (0.9 + Math.random() * 0.2);
            }

            // Round to 2 decimals
            testResults[test.id] = Number(value.toFixed(2));

            // Add to testResultIds if abnormal (simplified logic)
            if (value < test.min || value > test.max) {
                testResultIds.push(test.id);
            }
        });

        const abnormalCount = testResultIds.length;
        const hasCritical = abnormalCount > 5;

        return {
            id: `P-${baseId}`,
            name: `환자_${i + 1}`,
            breed: breeds[i % breeds.length],
            age: 5 + (i % 10),
            gender: i % 2 === 0 ? 'M' : 'F',
            weight: (2.5 + (i * 0.15)).toFixed(1),
            diagnosis,
            diseaseStage,
            lastVisit: `2024-${String(Math.floor(i / 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            abnormalTestCount: abnormalCount,
            criticalFlags: hasCritical,

            // Vitals
            hr: (70 + Math.random() * 90).toFixed(0),
            rr: (15 + Math.random() * 25).toFixed(0),
            temp: (37.8 + Math.random() * 1.2).toFixed(1),

            // Spread all dynamic test results
            ...testResults,

            testResultIds
        };
    })
};

// Dynamically generate column definitions from mockTestResults
const dynamicTestColumns = mockTestResults.map(test => ({
    key: test.id,
    label: `${test.name} (${test.unit})`,
    type: 'number',
    group: test.category,
    referenceRange: { min: test.min, max: test.max },
    description: test.description
}));

export const columnDefinitions = [
    // General
    { key: 'id', label: '환자 ID', type: 'text', group: 'General' },
    { key: 'name', label: '이름', type: 'text', group: 'General' },
    { key: 'breed', label: '품종', type: 'select', group: 'General' },
    { key: 'age', label: '나이', type: 'number', group: 'General' },
    { key: 'gender', label: '성별', type: 'select', group: 'General' },
    { key: 'weight', label: '체중', type: 'number', group: 'General' },
    { key: 'diagnosis', label: '주요 진단', type: 'select', group: 'General' },
    { key: 'diseaseStage', label: '질병 단계', type: 'select', group: 'General' },
    { key: 'lastVisit', label: '최근 방문일', type: 'text', group: 'General' },
    { key: 'abnormalTestCount', label: '이상 검사 수', type: 'number', group: 'General' },
    { key: 'criticalFlags', label: '위험 수치', type: 'select', group: 'General' },

    // Vitals
    { key: 'hr', label: 'HR (bpm)', type: 'number', group: 'Vitals', referenceRange: { min: 70, max: 160 } },
    { key: 'rr', label: 'RR (bpm)', type: 'number', group: 'Vitals', referenceRange: { min: 10, max: 30 } },
    { key: 'temp', label: 'Temp (°C)', type: 'number', group: 'Vitals', referenceRange: { min: 37.5, max: 39.2 } },

    // Dynamic Test Columns
    ...dynamicTestColumns
];
