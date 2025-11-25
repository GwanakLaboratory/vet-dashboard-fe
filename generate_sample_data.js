import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 샘플 데이터 생성
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max));
const randomChoice = (arr) => arr[randomInt(0, arr.length)];
const randomDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - randomInt(1, daysAgo));
    return date.toISOString().split('T')[0];
};

// 1. 환자 데이터
const breeds = ['말티즈', '푸들', '치와와', '시츄', '포메라니안', '요크셔테리어', '비글', '웰시코기', '골든리트리버', '리트리버'];
const genders = ['수컷', '암컷', '중성화 수컷', '중성화 암컷'];
const ownerNames = ['김철수', '이영희', '박민수', '최지은', '정다은', '강호동', '유재석', '송지효', '하하', '전소민'];
const petNames = ['뽀삐', '초코', '쿠키', '몽이', '루이', '코코', '두부', '콩이', '별이', '달이', '모카', '라떼', '마루', '보리', '복실'];

const patients = [];
for (let i = 1; i <= 50; i++) {
    const animalNumber = `A${String(i).padStart(4, '0')}`;
    const name = `${randomChoice(petNames)}${i}`;
    const owner = randomChoice(ownerNames);
    const breed = randomChoice(breeds);
    const gender = randomChoice(genders);
    const birthDate = randomDate(3650);
    const regDate = randomDate(730);
    const neutered = gender.includes('중성화') ? '예' : randomChoice(['예', '아니오']);
    const weight = (random(2.5, 35.0)).toFixed(1);
    const microchip = Math.random() > 0.3 ? `KR${randomInt(100000000, 999999999)}` : '';

    patients.push({
        '동물번호': animalNumber,
        '동물명': name,
        '보호자명': owner,
        '종': '개',
        '품종': breed,
        '성별': gender,
        '생년월일': birthDate,
        '등록일': regDate,
        '중성화여부': neutered,
        '체중(kg)': parseFloat(weight),
        '마이크로칩번호': microchip
    });
}

// 2. 방문 기록
const visitTypes = ['정기검진', '예약', '응급', '재진'];
const statuses = ['완료', '진료중', '예약'];
const complaints = ['피부 가려움', '구토', '설사', '기침', '식욕부진', '무기력', '절뚝거림', '눈곱', '귀 냄새', '치석'];
const diagnoses = ['피부염', '위장염', '상기도감염', '외이염', '치주질환', '슬개골탈구', '알레르기', '정상', '경과관찰 필요'];

const visits = [];
for (let i = 0; i < 40; i++) {
    const patient = patients[i];
    const numVisits = randomInt(1, 6);

    for (let j = 0; j < numVisits; j++) {
        visits.push({
            '동물번호': patient['동물번호'],
            '방문일': randomDate(365),
            '방문유형': randomChoice(visitTypes),
            '주증상': randomChoice(complaints),
            '진단': randomChoice(diagnoses),
            '처치': Math.random() > 0.3 ? '약물처방' : '검사 실시',
            '상태': randomChoice(statuses),
            '수의사명': randomChoice(['김수의사', '이수의사', '박수의사']),
            '메모': ''
        });
    }
}

// 3. 검사 항목 마스터
const examMaster = [
    { '검사코드': 'CBC001', '검사명': 'WBC (백혈구)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^3/μL', '정상범위최소': 6.0, '정상범위최대': 17.0, '관련신체부위': 'blood' },
    { '검사코드': 'CBC002', '검사명': 'RBC (적혈구)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^6/μL', '정상범위최소': 5.5, '정상범위최대': 8.5, '관련신체부위': 'blood' },
    { '검사코드': 'CBC003', '검사명': 'HGB (헤모글로빈)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': 'g/dL', '정상범위최소': 12.0, '정상범위최대': 18.0, '관련신체부위': 'blood' },
    { '검사코드': 'CBC004', '검사명': 'HCT (헤마토크릿)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '%', '정상범위최소': 37.0, '정상범위최대': 55.0, '관련신체부위': 'blood' },
    { '검사코드': 'CBC005', '검사명': 'PLT (혈소판)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^3/μL', '정상범위최소': 200.0, '정상범위최대': 500.0, '관련신체부위': 'blood' },
    { '검사코드': 'LIVER001', '검사명': 'ALT (간효소)', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 10.0, '정상범위최대': 100.0, '관련신체부위': 'liver' },
    { '검사코드': 'LIVER002', '검사명': 'AST', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 15.0, '정상범위최대': 66.0, '관련신체부위': 'liver' },
    { '검사코드': 'LIVER003', '검사명': 'ALP (알칼리포스파타제)', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 23.0, '정상범위최대': 212.0, '관련신체부위': 'liver' },
    { '검사코드': 'KIDNEY001', '검사명': 'BUN (혈중요소질소)', '검사카테고리': '신장기능', '검사유형': '일반', '단위': 'mg/dL', '정상범위최소': 7.0, '정상범위최대': 27.0, '관련신체부위': 'kidney' },
    { '검사코드': 'KIDNEY002', '검사명': 'CREA (크레아티닌)', '검사카테고리': '신장기능', '검사유형': '일반', '단위': 'mg/dL', '정상범위최소': 0.5, '정상범위최대': 1.8, '관련신체부위': 'kidney' },
    { '검사코드': 'ELEC001', '검사명': 'Na (나트륨)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 144.0, '정상범위최대': 160.0, '관련신체부위': 'blood' },
    { '검사코드': 'ELEC002', '검사명': 'K (칼륨)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 3.5, '정상범위최대': 5.8, '관련신체부위': 'blood' },
    { '검사코드': 'ELEC003', '검사명': 'Cl (염소)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 109.0, '정상범위최대': 122.0, '관련신체부위': 'blood' },
];

// 4. 검사 결과
const testResults = [];
for (let i = 0; i < 35; i++) {
    const patient = patients[i];
    const numTests = randomInt(3, 11);
    const testDate = randomDate(180);

    const selectedExams = [];
    for (let j = 0; j < numTests && j < examMaster.length; j++) {
        const exam = examMaster[randomInt(0, examMaster.length)];
        if (!selectedExams.includes(exam['검사코드'])) {
            selectedExams.push(exam['검사코드']);

            let value, status;
            if (Math.random() < 0.8) {
                // 정상 범위
                value = random(exam['정상범위최소'], exam['정상범위최대']);
                status = 'N';
            } else {
                // 이상 범위
                if (Math.random() < 0.5) {
                    value = random(exam['정상범위최소'] * 0.5, exam['정상범위최소']);
                    status = 'L';
                } else {
                    value = random(exam['정상범위최대'], exam['정상범위최대'] * 1.5);
                    status = 'H';
                }
            }

            testResults.push({
                '동물번호': patient['동물번호'],
                '검사코드': exam['검사코드'],
                '검사일': testDate,
                '검사값': parseFloat(value.toFixed(2)),
                '검사값텍스트': '',
                '상태': status,
                '메모': ''
            });
        }
    }
}

// 5. 문진 템플릿
const questionTemplates = [
    { '카테고리': '피부', '문항': '피부에 발진이나 붉은 반점이 있나요?', '문항유형': 'yes_no', '관련신체부위': 'skin', '표시순서': 1 },
    { '카테고리': '피부', '문항': '가려움증으로 긁는 행동을 자주 하나요?', '문항유형': 'yes_no', '관련신체부위': 'skin', '표시순서': 2 },
    { '카테고리': '소화기', '문항': '구토 증상이 있나요?', '문항유형': 'yes_no', '관련신체부위': 'digestive', '표시순서': 1 },
    { '카테고리': '소화기', '문항': '설사를 하나요?', '문항유형': 'yes_no', '관련신체부위': 'digestive', '표시순서': 2 },
    { '카테고리': '소화기', '문항': '식욕은 어떤가요?', '문항유형': 'multiple_choice', '관련신체부위': 'digestive', '표시순서': 3 },
    { '카테고리': '호흡기', '문항': '기침을 하나요?', '문항유형': 'yes_no', '관련신체부위': 'respiratory', '표시순서': 1 },
    { '카테고리': '호흡기', '문항': '호흡이 빠르거나 힘들어 보이나요?', '문항유형': 'yes_no', '관련신체부위': 'respiratory', '표시순서': 2 },
    { '카테고리': '신경', '문항': '걸음걸이가 이상하거나 절뚝거리나요?', '문항유형': 'yes_no', '관련신체부위': 'nervous', '표시순서': 1 },
    { '카테고리': '신경', '문항': '발작 증상이 있었나요?', '문항유형': 'yes_no', '관련신체부위': 'nervous', '표시순서': 2 },
    { '카테고리': '비뇨기', '문항': '소변 색깔이 이상한가요?', '문항유형': 'yes_no', '관련신체부위': 'urinary', '표시순서': 1 },
    { '카테고리': '비뇨기', '문항': '배뇨 시 통증이 있어 보이나요?', '문항유형': 'yes_no', '관련신체부위': 'urinary', '표시순서': 2 },
    { '카테고리': '근골격', '문항': '관절 부위를 만지면 아파하나요?', '문항유형': 'yes_no', '관련신체부위': 'musculoskeletal', '표시순서': 1 },
    { '카테고리': '근골격', '문항': '계단 오르내리기를 힘들어하나요?', '문항유형': 'yes_no', '관련신체부위': 'musculoskeletal', '표시순서': 2 },
];

// 6. 약물 처방
const medications = [];
const medNames = ['항생제 (Amoxicillin)', '소염제 (Carprofen)', '진통제 (Tramadol)', '항히스타민제', '스테로이드', '심장약', '위장약'];
const frequencies = ['BID (1일 2회)', 'TID (1일 3회)', 'QD (1일 1회)', 'PRN (필요시)'];

for (let i = 0; i < 30; i++) {
    const patient = patients[i];
    if (Math.random() > 0.4) {
        const numMeds = randomInt(1, 4);
        for (let j = 0; j < numMeds; j++) {
            const startDate = randomDate(90);
            const duration = randomInt(3, 15);
            const start = new Date(startDate);
            start.setDate(start.getDate() + duration);
            const endDate = start.toISOString().split('T')[0];

            medications.push({
                '동물번호': patient['동물번호'],
                '약물명': randomChoice(medNames),
                '용량': `${randomInt(5, 51)}mg`,
                '투여빈도': randomChoice(frequencies),
                '투여기간(일)': duration,
                '시작일': startDate,
                '종료일': endDate,
                '카테고리': randomChoice(['항생제', '소염제', '진통제', '기타']),
                '메모': ''
            });
        }
    }
}

// Excel 파일 생성
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(patients), '환자정보');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(visits), '방문기록');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(examMaster), '검사항목마스터');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(testResults), '검사결과');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(questionTemplates), '문진템플릿');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(medications), '약물처방');

const outputPath = join(__dirname, 'attached_assets', '샘플_데이터_50명.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Excel 파일 생성 완료!');
console.log(`📁 파일 위치: ${outputPath}`);
console.log(`\n📊 생성된 데이터:`);
console.log(`  - 환자: ${patients.length}명`);
console.log(`  - 방문 기록: ${visits.length}건`);
console.log(`  - 검사 항목: ${examMaster.length}개`);
console.log(`  - 검사 결과: ${testResults.length}건`);
console.log(`  - 문진 템플릿: ${questionTemplates.length}개`);
console.log(`  - 약물 처방: ${medications.length}건`);
