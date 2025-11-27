import { subDays, subMonths, format } from "date-fns";

// 1. Patient Overview Data
export const mockPatient = {
    animalNumber: "10000001",
    name: "초코",
    owner: "김철수",
    phone: "010-1234-5678",
    primaryVet: "김철수",
    breed: "말티즈 (Maltese)",
    gender: "Male (Castrated)",
    age: "8Y 3M",
    weight: "3.5kg",
    weightTrend: -0.1,
    heartRate: 110,
    tags: ["주의 환자"],
    majorDiseases: ["슬개골 탈구", "피부염"],
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
        date: "2024-05-21",
        type: "검진결과",
        path: "/documents/핑핑 검진결과서.pdf"
    },
    {
        id: "doc-2",
        name: "핑핑 사전문진표.pdf",
        date: "2024-05-21",
        type: "문진표",
        path: "/documents/핑핑 사전문진표.pdf"
    },
    {
        id: "doc-3",
        name: "핑핑_문진결과.pdf",
        date: "2024-05-19",
        type: "문진결과",
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
export const mockVisitTimeline = [
    {
        date: "2024-05-21",
        title: "정기 검진",
        status: "completed", // completed, scheduled
        hasLab: true,
        hasImaging: false,
        hasDocument: true,
        hasQuestionnaire: true,
        description: "정기 건강검진 및 예방접종",
    },
    {
        date: "2024-05-19",
        title: "피부과 진료",
        status: "completed",
        hasLab: true,
        hasImaging: false,
        hasDocument: true,
        hasQuestionnaire: true,
        description: "피부 발진 및 소양감 호소",
    },
    {
        date: "2024-04-15",
        title: "내과 진료",
        status: "completed",
        hasLab: true,
        hasImaging: true,
        hasDocument: false,
        hasQuestionnaire: false,
        description: "구토 및 설사 증상",
    },
    {
        date: "2024-03-10",
        title: "예방접종",
        status: "completed",
        hasLab: false,
        hasImaging: false,
        hasDocument: true,
        hasQuestionnaire: false,
        description: "종합백신 5차",
    },
    {
        date: "2024-01-05",
        title: "초진",
        status: "completed",
        hasLab: true,
        hasImaging: true,
        hasDocument: true,
        description: "기초 건강검진",
    },
];

// 9. Research Dashboard Data
export const mockResearchData = {
    ageDistribution: [
        { name: "Puppy (<2)", value: 150, fill: "#8884d8" },
        { name: "Adult (2-7)", value: 450, fill: "#82ca9d" },
        { name: "Senior (7+)", value: 300, fill: "#ffc658" },
        { name: "Geriatric (12+)", value: 120, fill: "#ff8042" },
    ],
    diagnosisTrend: [
        { month: "1월", mmvd: 12, patella: 18, ckd: 5 },
        { month: "2월", mmvd: 15, patella: 20, ckd: 7 },
        { month: "3월", mmvd: 18, patella: 15, ckd: 8 },
        { month: "4월", mmvd: 22, patella: 25, ckd: 10 },
        { month: "5월", mmvd: 20, patella: 22, ckd: 9 },
        { month: "6월", mmvd: 25, patella: 28, ckd: 12 },
    ],
    breedDistribution: [
        { name: "말티즈", count: 320 },
        { name: "푸들", count: 280 },
        { name: "포메라니안", count: 210 },
        { name: "치와와", count: 150 },
        { name: "시츄", count: 90 },
    ],
    patients: Array.from({ length: 50 }).map((_, i) => ({
        id: `P-${2024000 + i}`,
        name: `환자_${i + 1}`,
        breed: ['말티즈', '푸들', '포메라니안', '치와와', '시츄'][i % 5],
        age: 8 + (i % 5),
        gender: i % 2 === 0 ? 'M' : 'F',
        weight: (3 + (i * 0.1)).toFixed(1),
        diagnosis: ['MMVD (B2)', '슬개골 탈구 (3기)', '만성 신부전', '아토피 피부염', '건강함'][i % 5],
        lastVisit: `2024-11-${String((i % 30) + 1).padStart(2, '0')}`,

        // Vitals
        hr: (60 + Math.random() * 100).toFixed(0), // Normal: 70-160
        rr: (10 + Math.random() * 40).toFixed(0),  // Normal: 10-30
        temp: (37.5 + Math.random() * 2).toFixed(1), // Normal: 37.5-39.2

        // CBC
        hct: (30 + Math.random() * 30).toFixed(1), // Normal: 37-55
        wbc: (4 + Math.random() * 20).toFixed(1),  // Normal: 6-17
        plt: (100 + Math.random() * 400).toFixed(0), // Normal: 200-500

        // Chemistry
        ast: (20 + Math.random() * 100).toFixed(0), // Normal: 10-50
        bun: (10 + Math.random() * 40).toFixed(1),   // Normal: 7-27
        alp: (20 + Math.random() * 300).toFixed(0), // Normal: 23-212
        creatinine: (0.5 + Math.random() * 3).toFixed(1), // Normal: 0.5-1.8
        glucose: (60 + Math.random() * 100).toFixed(0), // Normal: 70-143
        tp: (5 + Math.random() * 4).toFixed(1), // Normal: 5.2-8.2
    }))
};

export const columnDefinitions = [
    // General
    { key: 'id', label: '환자 ID', type: 'text', group: 'General' },
    { key: 'name', label: '이름', type: 'text', group: 'General' },
    { key: 'breed', label: '품종', type: 'select', group: 'General' },
    { key: 'age', label: '나이', type: 'number', group: 'General' },
    { key: 'gender', label: '성별', type: 'select', group: 'General' },
    { key: 'weight', label: '체중', type: 'number', group: 'General' },
    { key: 'diagnosis', label: '주요 진단', type: 'select', group: 'General' },
    { key: 'lastVisit', label: '최근 방문일', type: 'text', group: 'General' },

    // Vitals
    { key: 'hr', label: 'HR (bpm)', type: 'number', group: 'Vitals', referenceRange: { min: 70, max: 160 } },
    { key: 'rr', label: 'RR (bpm)', type: 'number', group: 'Vitals', referenceRange: { min: 10, max: 30 } },
    { key: 'temp', label: 'Temp (°C)', type: 'number', group: 'Vitals', referenceRange: { min: 37.5, max: 39.2 } },

    // CBC
    { key: 'hct', label: 'Hct (%)', type: 'number', group: 'CBC', referenceRange: { min: 37, max: 55 } },
    { key: 'wbc', label: 'WBC (10^9/L)', type: 'number', group: 'CBC', referenceRange: { min: 6, max: 17 } },
    { key: 'plt', label: 'PLT (10^9/L)', type: 'number', group: 'CBC', referenceRange: { min: 200, max: 500 } },

    // Chemistry
    { key: 'ast', label: 'AST (U/L)', type: 'number', group: 'Chemistry', referenceRange: { min: 10, max: 50 } },
    { key: 'bun', label: 'BUN (mg/dL)', type: 'number', group: 'Chemistry', referenceRange: { min: 7, max: 27 } },
    { key: 'alp', label: 'ALP (U/L)', type: 'number', group: 'Chemistry', referenceRange: { min: 23, max: 212 } },
    { key: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', group: 'Chemistry', referenceRange: { min: 0.5, max: 1.8 } },
    { key: 'glucose', label: 'Glucose (mg/dL)', type: 'number', group: 'Chemistry', referenceRange: { min: 70, max: 143 } },
    { key: 'tp', label: 'TP (g/dL)', type: 'number', group: 'Chemistry', referenceRange: { min: 5.2, max: 8.2 } },
];
