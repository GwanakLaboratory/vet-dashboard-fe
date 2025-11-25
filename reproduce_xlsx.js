
const XLSX = require('xlsx');
const fs = require('fs');

const { read, utils, write } = XLSX;

function readExcelBuffer(buffer, sheetName) {
    const workbook = read(buffer, { type: 'buffer' });
    const targetSheetName = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[targetSheetName];

    if (!worksheet) {
        console.log(`Sheet ${targetSheetName} not found`);
        return [];
    }

    const jsonData = utils.sheet_to_json(worksheet, { defval: null });
    return jsonData;
}

async function testXlsx() {
    console.log('Creating sample Excel buffer...');
    const wb = utils.book_new();
    const data = [
        { '동물번호': '123', '동물명': 'TestDog', '보호자명': 'Owner' }
    ];
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, '환자정보');
    const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });

    console.log('Reading Excel buffer...');
    try {
        const result = readExcelBuffer(buffer, '환자정보');
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error reading excel:', error);
    }
}

testXlsx();
