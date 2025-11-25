import XLSX from 'xlsx';
const { readFile, read, utils, write } = XLSX;
import type { WorkBook } from 'xlsx';
import path from 'path';

// 엑셀 파일을 읽어 JSON 데이터로 변환하는 함수
export async function readExcelFile(filePath: string, sheetName?: string): Promise<any[]> {
  const fullPath = path.resolve(filePath);
  const workbook = readFile(fullPath);

  return parseWorkbook(workbook, sheetName);
}

// 엑셀 버퍼를 읽어 JSON 데이터로 변환하는 함수
export async function readExcelBuffer(buffer: Buffer, sheetName?: string): Promise<any[]> {
  const workbook = read(buffer, { type: 'buffer' });

  return parseWorkbook(workbook, sheetName);
}

function parseWorkbook(workbook: WorkBook, sheetName?: string): any[] {
  const targetSheetName = sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[targetSheetName];

  if (!worksheet) {
    console.warn(`Sheet ${targetSheetName} not found`);
    return [];
  }

  const jsonData = utils.sheet_to_json(worksheet, { defval: null });
  return jsonData;
}

// JSON 데이터를 엑셀 버퍼로 변환하는 함수
export function createExcelBuffer(data: any[], headersOrSheetName: Record<string, string> | string = 'Sheet1'): Buffer {
  let processedData = data;
  let sheetName = 'Sheet1';

  // If headers is an object (column mapping), transform the data
  if (typeof headersOrSheetName === 'object') {
    processedData = data.map(row => {
      const newRow: any = {};
      for (const [key, koreanName] of Object.entries(headersOrSheetName)) {
        newRow[koreanName] = row[key];
      }
      return newRow;
    });
  } else {
    sheetName = headersOrSheetName;
  }

  const worksheet = utils.json_to_sheet(processedData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, sheetName);
  return write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

