import pandas as pd
from datetime import datetime, timedelta
import random

# 샘플 데이터 생성
random.seed(42)

# 1. 환자 데이터 (Patients)
breeds = ['말티즈', '푸들', '치와와', '시츄', '포메라니안', '요크셔테리어', '비글', '웰시코기', '골든리트리버', '리트리버']
genders = ['수컷', '암컷', '중성화 수컷', '중성화 암컷']
owner_names = ['김철수', '이영희', '박민수', '최지은', '정다은', '강호동', '유재석', '송지효', '하하', '전소민']

patients_data = []
for i in range(1, 51):  # 50명의 환자
    animal_number = f'A{i:04d}'
    name = f'{random.choice(["뽀삐", "초코", "쿠키", "몽이", "루이", "코코", "두부", "콩이", "별이", "달이"])}{i}'
    owner = random.choice(owner_names)
    breed = random.choice(breeds)
    gender = random.choice(genders)
    birth_date = (datetime.now() - timedelta(days=random.randint(365, 3650))).strftime('%Y-%m-%d')
    reg_date = (datetime.now() - timedelta(days=random.randint(1, 730))).strftime('%Y-%m-%d')
    neutered = '예' if '중성화' in gender else random.choice(['예', '아니오'])
    weight = round(random.uniform(2.5, 35.0), 1)
    microchip = f'KR{random.randint(100000000, 999999999)}' if random.random() > 0.3 else ''
    
    patients_data.append({
        '동물번호': animal_number,
        '동물명': name,
        '보호자명': owner,
        '종': '개',
        '품종': breed,
        '성별': gender,
        '생년월일': birth_date,
        '등록일': reg_date,
        '중성화여부': neutered,
        '체중(kg)': weight,
        '마이크로칩번호': microchip
    })

# 2. 방문 기록 (Visits)
visit_types = ['정기검진', '예약', '응급', '재진']
statuses = ['완료', '진료중', '예약']
complaints = ['피부 가려움', '구토', '설사', '기침', '식욕부진', '무기력', '절뚝거림', '눈곱', '귀 냄새', '치석']
diagnoses = ['피부염', '위장염', '상기도감염', '외이염', '치주질환', '슬개골탈구', '알레르기', '정상', '경과관찰 필요']

visits_data = []
visit_id = 1
for patient in patients_data[:40]:  # 40명의 환자에 대해 방문 기록
    num_visits = random.randint(1, 5)
    for _ in range(num_visits):
        visit_date = (datetime.now() - timedelta(days=random.randint(1, 365))).strftime('%Y-%m-%d')
        visits_data.append({
            '동물번호': patient['동물번호'],
            '방문일': visit_date,
            '방문유형': random.choice(visit_types),
            '주증상': random.choice(complaints),
            '진단': random.choice(diagnoses),
            '처치': '약물처방' if random.random() > 0.3 else '검사 실시',
            '상태': random.choice(statuses),
            '수의사명': random.choice(['김수의사', '이수의사', '박수의사']),
            '메모': ''
        })
        visit_id += 1

# 3. 검사 항목 마스터 (Exam Master)
exam_master_data = [
    {'검사코드': 'CBC001', '검사명': 'WBC (백혈구)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^3/μL', '정상범위최소': 6.0, '정상범위최대': 17.0, '관련신체부위': 'blood'},
    {'검사코드': 'CBC002', '검사명': 'RBC (적혈구)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^6/μL', '정상범위최소': 5.5, '정상범위최대': 8.5, '관련신체부위': 'blood'},
    {'검사코드': 'CBC003', '검사명': 'HGB (헤모글로빈)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': 'g/dL', '정상범위최소': 12.0, '정상범위최대': 18.0, '관련신체부위': 'blood'},
    {'검사코드': 'CBC004', '검사명': 'HCT (헤마토크릿)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '%', '정상범위최소': 37.0, '정상범위최대': 55.0, '관련신체부위': 'blood'},
    {'검사코드': 'CBC005', '검사명': 'PLT (혈소판)', '검사카테고리': 'CBC', '검사유형': '일반', '단위': '10^3/μL', '정상범위최소': 200.0, '정상범위최대': 500.0, '관련신체부위': 'blood'},
    {'검사코드': 'LIVER001', '검사명': 'ALT (간효소)', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 10.0, '정상범위최대': 100.0, '관련신체부위': 'liver'},
    {'검사코드': 'LIVER002', '검사명': 'AST', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 15.0, '정상범위최대': 66.0, '관련신체부위': 'liver'},
    {'검사코드': 'LIVER003', '검사명': 'ALP (알칼리포스파타제)', '검사카테고리': '간기능', '검사유형': '일반', '단위': 'U/L', '정상범위최소': 23.0, '정상범위최대': 212.0, '관련신체부위': 'liver'},
    {'검사코드': 'KIDNEY001', '검사명': 'BUN (혈중요소질소)', '검사카테고리': '신장기능', '검사유형': '일반', '단위': 'mg/dL', '정상범위최소': 7.0, '정상범위최대': 27.0, '관련신체부위': 'kidney'},
    {'검사코드': 'KIDNEY002', '검사명': 'CREA (크레아티닌)', '검사카테고리': '신장기능', '검사유형': '일반', '단위': 'mg/dL', '정상범위최소': 0.5, '정상범위최대': 1.8, '관련신체부위': 'kidney'},
    {'검사코드': 'ELEC001', '검사명': 'Na (나트륨)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 144.0, '정상범위최대': 160.0, '관련신체부위': 'blood'},
    {'검사코드': 'ELEC002', '검사명': 'K (칼륨)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 3.5, '정상범위최대': 5.8, '관련신체부위': 'blood'},
    {'검사코드': 'ELEC003', '검사명': 'Cl (염소)', '검사카테고리': '전해질', '검사유형': '일반', '단위': 'mEq/L', '정상범위최소': 109.0, '정상범위최대': 122.0, '관련신체부위': 'blood'},
    {'검사코드': 'XRAY001', '검사명': '흉부 X-ray', '검사카테고리': '영상', '검사유형': '영상', '단위': '', '정상범위최소': None, '정상범위최대': None, '관련신체부위': 'chest'},
    {'검사코드': 'XRAY002', '검사명': '복부 X-ray', '검사카테고리': '영상', '검사유형': '영상', '단위': '', '정상범위최소': None, '정상범위최대': None, '관련신체부위': 'abdomen'},
]

# 4. 검사 결과 (Test Results)
test_results_data = []
for patient in patients_data[:35]:  # 35명의 환자에 대해 검사 결과
    num_tests = random.randint(3, 10)
    test_date = (datetime.now() - timedelta(days=random.randint(1, 180))).strftime('%Y-%m-%d')
    
    for exam in random.sample(exam_master_data, min(num_tests, len(exam_master_data))):
        if exam['검사유형'] == '일반' and exam['정상범위최소'] is not None:
            # 정상 범위 내 값 생성 (80%는 정상, 20%는 이상)
            if random.random() < 0.8:
                value = round(random.uniform(exam['정상범위최소'], exam['정상범위최대']), 2)
                status = 'N'
            else:
                if random.random() < 0.5:
                    value = round(random.uniform(exam['정상범위최소'] * 0.5, exam['정상범위최소']), 2)
                    status = 'L'
                else:
                    value = round(random.uniform(exam['정상범위최대'], exam['정상범위최대'] * 1.5), 2)
                    status = 'H'
            
            test_results_data.append({
                '동물번호': patient['동물번호'],
                '검사코드': exam['검사코드'],
                '검사일': test_date,
                '검사값': value,
                '검사값텍스트': '',
                '상태': status,
                '메모': ''
            })

# 5. 문진 템플릿 (Question Templates)
question_templates_data = [
    {'카테고리': '피부', '문항': '피부에 발진이나 붉은 반점이 있나요?', '문항유형': 'yes_no', '관련신체부위': 'skin', '표시순서': 1},
    {'카테고리': '피부', '문항': '가려움증으로 긁는 행동을 자주 하나요?', '문항유형': 'yes_no', '관련신체부위': 'skin', '표시순서': 2},
    {'카테고리': '소화기', '문항': '구토 증상이 있나요?', '문항유형': 'yes_no', '관련신체부위': 'digestive', '표시순서': 1},
    {'카테고리': '소화기', '문항': '설사를 하나요?', '문항유형': 'yes_no', '관련신체부위': 'digestive', '표시순서': 2},
    {'카테고리': '소화기', '문항': '식욕은 어떤가요?', '문항유형': 'multiple_choice', '관련신체부위': 'digestive', '표시순서': 3},
    {'카테고리': '호흡기', '문항': '기침을 하나요?', '문항유형': 'yes_no', '관련신체부위': 'respiratory', '표시순서': 1},
    {'카테고리': '호흡기', '문항': '호흡이 빠르거나 힘들어 보이나요?', '문항유형': 'yes_no', '관련신체부위': 'respiratory', '표시순서': 2},
    {'카테고리': '신경', '문항': '걸음걸이가 이상하거나 절뚝거리나요?', '문항유형': 'yes_no', '관련신체부위': 'nervous', '표시순서': 1},
    {'카테고리': '신경', '문항': '발작 증상이 있었나요?', '문항유형': 'yes_no', '관련신체부위': 'nervous', '표시순서': 2},
    {'카테고리': '비뇨기', '문항': '소변 색깔이 이상한가요?', '문항유형': 'yes_no', '관련신체부위': 'urinary', '표시순서': 1},
    {'카테고리': '비뇨기', '문항': '배뇨 시 통증이 있어 보이나요?', '문항유형': 'yes_no', '관련신체부위': 'urinary', '표시순서': 2},
    {'카테고리': '근골격', '문항': '관절 부위를 만지면 아파하나요?', '문항유형': 'yes_no', '관련신체부위': 'musculoskeletal', '표시순서': 1},
    {'카테고리': '근골격', '문항': '계단 오르내리기를 힘들어하나요?', '문항유형': 'yes_no', '관련신체부위': 'musculoskeletal', '표시순서': 2},
]

# 6. 약물 처방 (Medications)
medications_data = []
med_names = ['항생제 (Amoxicillin)', '소염제 (Carprofen)', '진통제 (Tramadol)', '항히스타민제', '스테로이드', '심장약', '위장약']
frequencies = ['BID (1일 2회)', 'TID (1일 3회)', 'QD (1일 1회)', 'PRN (필요시)']

for patient in patients_data[:30]:  # 30명의 환자에 대해 약물 처방
    if random.random() > 0.4:  # 60% 확률로 약물 처방
        num_meds = random.randint(1, 3)
        for _ in range(num_meds):
            start_date = (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            duration = random.randint(3, 14)
            end_date = (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(days=duration)).strftime('%Y-%m-%d')
            
            medications_data.append({
                '동물번호': patient['동물번호'],
                '약물명': random.choice(med_names),
                '용량': f'{random.randint(5, 50)}mg',
                '투여빈도': random.choice(frequencies),
                '투여기간(일)': duration,
                '시작일': start_date,
                '종료일': end_date,
                '카테고리': random.choice(['항생제', '소염제', '진통제', '기타']),
                '메모': ''
            })

# Excel 파일로 저장
with pd.ExcelWriter('c:/Users/jechan_lee/Documents/workspace/SNUClinicSystem/attached_assets/샘플_데이터_50명.xlsx', engine='openpyxl') as writer:
    pd.DataFrame(patients_data).to_excel(writer, sheet_name='환자정보', index=False)
    pd.DataFrame(visits_data).to_excel(writer, sheet_name='방문기록', index=False)
    pd.DataFrame(exam_master_data).to_excel(writer, sheet_name='검사항목마스터', index=False)
    pd.DataFrame(test_results_data).to_excel(writer, sheet_name='검사결과', index=False)
    pd.DataFrame(question_templates_data).to_excel(writer, sheet_name='문진템플릿', index=False)
    pd.DataFrame(medications_data).to_excel(writer, sheet_name='약물처방', index=False)

print("✅ Excel 파일 생성 완료!")
print(f"환자 수: {len(patients_data)}")
print(f"방문 기록: {len(visits_data)}")
print(f"검사 결과: {len(test_results_data)}")
print(f"약물 처방: {len(medications_data)}")
