export interface MedicalParameterInfo {
    key: string;
    name: string;
    description: string;
    interpretation: {
        high: string;
        low: string;
        normal: string;
    };
}

export const medicalKnowledgeBase: Record<string, MedicalParameterInfo> = {
    // Vitals
    hr: {
        key: 'hr',
        name: 'Heart Rate (심박수)',
        description: '1분당 심장이 박동하는 횟수입니다. 심장 기능과 전반적인 순환 상태를 나타내는 기본적인 활력 징후입니다.',
        interpretation: {
            high: '빈맥(Tachycardia): 통증, 흥분, 탈수, 심장 질환, 발열, 빈혈 등을 시사할 수 있습니다.',
            low: '서맥(Bradycardia): 심장 전도 장애, 대사 저하, 특정 약물 영향, 또는 운동 선수 심장(건강함)일 수 있습니다.',
            normal: '심박수가 정상 범위 내에 있습니다. 안정적인 순환 상태를 시사합니다.'
        }
    },
    rr: {
        key: 'rr',
        name: 'Respiratory Rate (호흡수)',
        description: '1분당 호흡 횟수입니다. 폐 기능과 호흡기 건강 상태를 반영합니다.',
        interpretation: {
            high: '빈호흡(Tachypnea): 폐 질환, 심부전, 통증, 스트레스, 열사병 등을 시사할 수 있습니다.',
            low: '서호흡(Bradypnea): 약물 중독, 뇌압 상승, 대사성 알칼리증 등을 시사할 수 있습니다.',
            normal: '호흡수가 정상 범위 내에 있습니다.'
        }
    },
    temp: {
        key: 'temp',
        name: 'Body Temperature (체온)',
        description: '신체의 내부 온도입니다. 감염, 염증, 대사 상태를 파악하는 중요한 지표입니다.',
        interpretation: {
            high: '발열(Fever/Hyperthermia): 감염, 염증, 열사병, 종양 등을 시사할 수 있습니다.',
            low: '저체온증(Hypothermia): 쇼크, 마취 회복기, 추위 노출, 대사 저하 등을 시사할 수 있습니다.',
            normal: '체온이 정상 범위 내에 있습니다.'
        }
    },

    // CBC
    hct: {
        key: 'hct',
        name: 'Hematocrit (적혈구 용적률)',
        description: '혈액 전체 부피에서 적혈구가 차지하는 비율입니다. 빈혈이나 탈수 상태를 평가하는 데 사용됩니다.',
        interpretation: {
            high: '적혈구 증가증: 탈수, 심한 설사/구토, 또는 골수 질환을 시사할 수 있습니다.',
            low: '빈혈: 출혈, 용혈, 골수 억제, 만성 질환 등을 시사할 수 있습니다.',
            normal: '적혈구 수치가 정상입니다.'
        }
    },
    wbc: {
        key: 'wbc',
        name: 'White Blood Cell (백혈구)',
        description: '혈액 내 백혈구의 수입니다. 면역 체계의 상태와 감염, 염증 여부를 판단합니다.',
        interpretation: {
            high: '백혈구 증가증: 세균 감염, 염증, 스트레스, 백혈병 등을 시사할 수 있습니다.',
            low: '백혈구 감소증: 바이러스 감염(파보 등), 골수 억제, 패혈증 등을 시사할 수 있습니다.',
            normal: '면역 상태가 정상으로 보입니다.'
        }
    },
    plt: {
        key: 'plt',
        name: 'Platelet (혈소판)',
        description: '혈액 응고에 관여하는 혈소판의 수입니다. 지혈 기능을 평가합니다.',
        interpretation: {
            high: '혈소판 증가증: 염증, 철분 결핍, 비장 적출 후 등을 시사할 수 있습니다.',
            low: '혈소판 감소증: 면역 매개성 파괴, 골수 질환, 출혈, 진드기 매개 질환 등을 시사할 수 있습니다.',
            normal: '지혈 기능이 정상으로 예상됩니다.'
        }
    },

    // Chemistry
    ast: {
        key: 'ast',
        name: 'Aspartate Aminotransferase (AST)',
        description: '간, 심장, 근육 세포에 존재하는 효소입니다. 세포 손상 시 혈액으로 유출되어 수치가 상승합니다.',
        interpretation: {
            high: '간 손상, 근육 손상, 심장 질환 등을 시사할 수 있습니다. ALT와 함께 평가하는 것이 중요합니다.',
            low: '임상적으로 큰 의미가 없는 경우가 많으나, 비타민 B6 결핍 등을 고려할 수 있습니다.',
            normal: '간 및 근육 세포 손상의 증거가 없습니다.'
        }
    },
    bun: {
        key: 'bun',
        name: 'Blood Urea Nitrogen (혈액요소질소)',
        description: '단백질 대사의 최종 산물인 요소 질소의 농도입니다. 신장 기능을 평가하는 주요 지표 중 하나입니다.',
        interpretation: {
            high: '신부전, 탈수, 고단백 식이, 위장관 출혈 등을 시사할 수 있습니다.',
            low: '간부전, 저단백 식이, 수액 과다 투여 등을 시사할 수 있습니다.',
            normal: '신장 배설 기능이 정상 범위로 보입니다.'
        }
    },
    alp: {
        key: 'alp',
        name: 'Alkaline Phosphatase (ALP)',
        description: '간, 담관, 뼈에 존재하는 효소입니다. 담즙 정체나 뼈의 활성도를 반영합니다.',
        interpretation: {
            high: '담즙 정체, 쿠싱 증후군, 스테로이드 투약, 성장기(정상), 골육종 등을 시사할 수 있습니다.',
            low: '임상적 의의가 적으나, 아연 결핍 등을 고려할 수 있습니다.',
            normal: '담관 및 뼈 대사가 정상으로 보입니다.'
        }
    },
    creatinine: {
        key: 'creatinine',
        name: 'Creatinine (크레아티닌)',
        description: '근육 대사 산물로, 신장을 통해서만 배설됩니다. 신장 기능(사구체 여과율)을 평가하는 가장 신뢰할 수 있는 지표입니다.',
        interpretation: {
            high: '신부전, 요로 폐쇄, 탈수 등을 시사합니다. 근육량이 많은 경우 약간 높을 수 있습니다.',
            low: '근육량 감소(악액질)를 시사할 수 있습니다.',
            normal: '신장 기능이 정상입니다.'
        }
    },
    glucose: {
        key: 'glucose',
        name: 'Glucose (혈당)',
        description: '혈액 내 포도당 농도입니다. 당뇨병 진단 및 저혈당 관리에 사용됩니다.',
        interpretation: {
            high: '고혈당: 당뇨병, 스트레스(고양이), 식후, 쿠싱 증후군 등을 시사할 수 있습니다.',
            low: '저혈당: 인슐린 과다, 기아, 간부전, 패혈증, 인슐린종 등을 시사할 수 있습니다.',
            normal: '혈당 조절이 정상입니다.'
        }
    },
    tp: {
        key: 'tp',
        name: 'Total Protein (총단백)',
        description: '혈액 내 알부민과 글로불린의 합입니다. 영양 상태, 간/신장 기능, 염증 상태를 반영합니다.',
        interpretation: {
            high: '탈수, 만성 염증(글로불린 증가), 다발성 골수종 등을 시사할 수 있습니다.',
            low: '단백질 소실(신장/장), 간부전(생성 저하), 출혈, 영양 불량 등을 시사할 수 있습니다.',
            normal: '단백질 수치가 정상입니다.'
        }
    },
    rbc: {
        key: 'rbc',
        name: 'Red Blood Cell (적혈구)',
        description: '혈액 내 적혈구의 수입니다. 산소 운반 능력을 평가합니다.',
        interpretation: {
            high: '적혈구 증가증: 탈수, 심폐 질환, 신장 종양 등을 시사할 수 있습니다.',
            low: '빈혈: 출혈, 용혈, 골수 억제, 만성 질환 등을 시사할 수 있습니다.',
            normal: '산소 운반 능력이 정상으로 보입니다.'
        }
    },
    alt: {
        key: 'alt',
        name: 'Alanine Aminotransferase (ALT)',
        description: '주로 간세포에 존재하는 효소입니다. 간 손상 시 가장 특이적으로 상승하는 지표입니다.',
        interpretation: {
            high: '간세포 손상(간염, 중독, 종양 등)을 강력하게 시사합니다.',
            low: '임상적 의의가 없습니다.',
            normal: '간세포 손상의 증거가 없습니다.'
        }
    },
    na: {
        key: 'na',
        name: 'Sodium (나트륨)',
        description: '세포외액의 주요 양이온입니다. 수분 균형과 신경/근육 기능을 조절합니다.',
        interpretation: {
            high: '고나트륨혈증: 탈수, 요붕증, 염분 과다 섭취 등을 시사할 수 있습니다.',
            low: '저나트륨혈증: 구토/설사, 에디슨병, 신부전, 이뇨제 사용 등을 시사할 수 있습니다.',
            normal: '전해질 및 수분 균형이 정상입니다.'
        }
    },
    k: {
        key: 'k',
        name: 'Potassium (칼륨)',
        description: '세포내액의 주요 양이온입니다. 심장 및 근육 기능에 필수적입니다.',
        interpretation: {
            high: '고칼륨혈증: 요로 폐쇄, 신부전, 에디슨병, 산증 등을 시사하며 심장 마비 위험이 있습니다.',
            low: '저칼륨혈증: 구토/설사, 식욕 부진, 인슐린 투여, 알칼리증 등을 시사하며 근육 무력을 유발할 수 있습니다.',
            normal: '전해질 균형이 정상입니다.'
        }
    }
};
