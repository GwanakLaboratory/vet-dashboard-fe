
import { readExcelBuffer } from './server/utils/excelReader';
import XLSX from 'xlsx';
import fs from 'fs';

async function testXlsx() {
    const log = (msg: string) => fs.appendFileSync('reproduce_output.txt', msg + '\n');

    try {
        log('Creating sample Excel buffer...');
        const wb = XLSX.utils.book_new();
        const data = [
            { '동물번호': '123', '동물명': 'TestDog', '보호자명': 'Owner' }
        ];
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, '환자정보');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        log('Reading Excel buffer...');
        const result = await readExcelBuffer(buffer, '환자정보');
        log('Result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
        log('Error reading excel: ' + error);
    }
}

testXlsx();
