import { Controller, Post, Get, Param, Res, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageService } from '../storage.service';
import { readExcelBuffer, createExcelBuffer } from '../utils/excelReader';
import { format } from 'date-fns';

@Controller()
export class ExcelController {
    constructor(private readonly storage: StorageService) { }

    @Post('upload-excel')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        console.log('=== UPLOAD EXCEL ENDPOINT CALLED ===');
        console.log('File received:', file ? 'YES' : 'NO');

        if (!file) {
            console.error('ERROR: No file uploaded');
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        console.log('File details:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            bufferLength: file.buffer?.length
        });

        try {
            console.log('Starting Excel file processing...');
            const buffer = file.buffer;
            let totalRecords = 0;

            // 1. 환자정보 처리
            try {
                console.log('Reading 환자정보 sheet...');
                const patientsData = await readExcelBuffer(buffer, '환자정보');
                console.log(`Found ${patientsData.length} patients in Excel`);

                for (const row of patientsData) {
                    await this.storage.createPatient({
                        animalNumber: row['동물번호'],
                        name: row['동물명'],
                        ownerName: row['보호자명'] || null,
                        species: row['종'] || '개',
                        breed: row['품종'] || null,
                        gender: row['성별'] || null,
                        birthDate: row['생년월일'] || null,
                        registrationDate: row['등록일'] || new Date().toISOString().split('T')[0],
                        neutered: row['중성화여부'] === '예',
                        weight: row['체중(kg)'] || null,
                        microchipNumber: row['마이크로칩번호'] || null,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${patientsData.length} patients`);
            } catch (err) {
                console.warn('⚠️ Could not import patients:', err);
            }

            // 2. 방문기록 처리
            try {
                const visitsData = await readExcelBuffer(buffer, '방문기록');
                for (const row of visitsData) {
                    await this.storage.createVisit({
                        animalNumber: row['동물번호'],
                        visitDate: row['방문일'],
                        visitType: row['방문유형'] || null,
                        chiefComplaint: row['주증상'] || null,
                        diagnosis: row['진단'] || null,
                        treatment: row['처치'] || null,
                        status: row['상태'] || '완료',
                        veterinarian: row['수의사명'] || null,
                        notes: row['메모'] || null,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${visitsData.length} visits`);
            } catch (err) {
                console.warn('⚠️ Could not import visits:', err);
            }

            // 3. 검사항목마스터 처리
            try {
                const examMasterData = await readExcelBuffer(buffer, '검사항목마스터');
                for (const row of examMasterData) {
                    await this.storage.createExamMaster({
                        examCode: row['검사코드'],
                        examName: row['검사명'],
                        examCategory: row['검사카테고리'],
                        examType: row['검사유형'] || '일반',
                        unit: row['단위'] || null,
                        normalRangeMin: row['정상범위최소'] || null,
                        normalRangeMax: row['정상범위최대'] || null,
                        normalRangeText: row['정상범위텍스트'] || null,
                        relatedBodyPart: row['관련신체부위'] || null,
                        description: row['설명'] || null,
                        isQuantitative: row['정상범위최소'] != null,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${examMasterData.length} exam master items`);
            } catch (err) {
                console.warn('⚠️ Could not import exam master:', err);
            }

            // 4. 검사결과 처리
            try {
                const testResultsData = await readExcelBuffer(buffer, '검사결과');
                for (const row of testResultsData) {
                    await this.storage.createTestResult({
                        animalNumber: row['동물번호'],
                        examCode: row['검사코드'],
                        testDate: row['검사일'],
                        value: row['검사값'] || null,
                        valueText: row['검사값텍스트'] || null,
                        status: row['상태'] || 'N',
                        notes: row['메모'] || null,
                        visitId: null,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${testResultsData.length} test results`);
            } catch (err) {
                console.warn('⚠️ Could not import test results:', err);
            }

            // 5. 문진템플릿 처리
            try {
                const questionTemplatesData = await readExcelBuffer(buffer, '문진템플릿');
                for (const row of questionTemplatesData) {
                    await this.storage.createQuestionTemplate({
                        category: row['카테고리'],
                        question: row['문항'],
                        questionType: row['문항유형'] || 'yes_no',
                        options: null,
                        relatedBodyPart: row['관련신체부위'] || null,
                        displayOrder: row['표시순서'] || 0,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${questionTemplatesData.length} question templates`);
            } catch (err) {
                console.warn('⚠️ Could not import question templates:', err);
            }

            // 6. 약물처방 처리
            try {
                const medicationsData = await readExcelBuffer(buffer, '약물처방');
                for (const row of medicationsData) {
                    await this.storage.createMedication({
                        animalNumber: row['동물번호'],
                        name: row['약물명'],
                        dosage: row['용량'] || null,
                        frequency: row['투여빈도'] || null,
                        duration: row['투여기간(일)'] || null,
                        startDate: row['시작일'],
                        endDate: row['종료일'] || null,
                        category: row['카테고리'] || null,
                        notes: row['메모'] || null,
                        visitId: null,
                    });
                    totalRecords++;
                }
                console.log(`✅ Imported ${medicationsData.length} medications`);
            } catch (err) {
                console.warn('⚠️ Could not import medications:', err);
            }

            console.log(`=== UPLOAD COMPLETE: ${totalRecords} total records imported ===`);
            return {
                message: 'File uploaded and processed successfully',
                totalRecords,
            };
        } catch (error) {
            console.error('=== ERROR IN UPLOAD ===');
            console.error('Error type:', error?.constructor?.name);
            console.error('Error message:', error?.message);
            console.error('Full error:', error);
            throw new HttpException('Failed to process file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('preview-excel')
    @UseInterceptors(FileInterceptor('file'))
    async previewExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            const buffer = file.buffer;
            const previewData: any = {};

            const sheets = ['환자정보', '방문기록', '검사항목마스터', '검사결과', '문진템플릿', '약물처방'];

            for (const sheet of sheets) {
                try {
                    const data = await readExcelBuffer(buffer, sheet);
                    previewData[sheet] = {
                        count: data.length,
                        preview: data.slice(0, 5)
                    };
                } catch (err) {
                    console.warn(`Could not read sheet ${sheet}:`, err);
                    previewData[sheet] = { count: 0, preview: [] };
                }
            }

            return previewData;
        } catch (error) {
            console.error('Error previewing file:', error);
            throw new HttpException('Failed to preview file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('download/:type')
    async downloadExcel(@Param('type') type: string, @Res() res: Response) {
        try {
            let data: any[] = [];
            let filename = '';
            let headers: Record<string, string> = {};

            switch (type) {
                case 'patients':
                    data = await this.storage.getAllPatients();
                    filename = 'patients.xlsx';
                    headers = {
                        'animalNumber': '동물번호',
                        'name': '동물명',
                        'ownerName': '고객명',
                        'species': '종',
                        'breed': '품종',
                        'gender': '성별',
                        'birthDate': '생년월일',
                        'registrationDate': '등록일',
                        'neutered': '중성화',
                        'weight': '체중',
                        'microchipNumber': '마이크로칩번호'
                    };
                    break;

                case 'visits':
                    data = await this.storage.getAllVisits();
                    filename = 'visits.xlsx';
                    headers = {
                        'animalNumber': '동물번호',
                        'visitDate': '방문일',
                        'status': '상태',
                        'visitType': '방문유형',
                        'chiefComplaint': '주증상',
                        'diagnosis': '진단',
                        'treatment': '치료',
                        'veterinarian': '수의사',
                        'notes': '메모'
                    };
                    break;

                case 'test-results':
                    data = await this.storage.getAllTestResults();
                    filename = 'test-results.xlsx';
                    headers = {
                        'animalNumber': '동물번호',
                        'examCode': '검사코드',
                        'testDate': '검사일',
                        'value': '결과값',
                        'valueText': '결과텍스트',
                        'status': '상태',
                        'notes': '메모'
                    };
                    break;

                case 'questionnaires':
                    data = await this.storage.getAllQuestionnaireResponses();
                    filename = 'questionnaires.xlsx';
                    headers = {
                        'animalNumber': '동물번호',
                        'questionId': '질문ID',
                        'response': '응답',
                        'responseDate': '응답일'
                    };
                    break;

                default:
                    throw new HttpException('Invalid download type', HttpStatus.BAD_REQUEST);
            }

            // Format dates
            const formattedData = data.map(row => {
                const formatted: any = {};
                for (const [key, value] of Object.entries(row)) {
                    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/))) {
                        try {
                            formatted[key] = format(new Date(value as string), 'yyyy-MM-dd');
                        } catch {
                            formatted[key] = value;
                        }
                    } else {
                        formatted[key] = value;
                    }
                }
                return formatted;
            });

            const buffer = await createExcelBuffer(formattedData, headers);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(buffer);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw new HttpException('Failed to download file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('exam-master')
    async getExamMaster() {
        return this.storage.getAllExamMaster();
    }
}
