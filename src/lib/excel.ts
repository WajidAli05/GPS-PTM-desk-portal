import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export interface StudentRecord {
  'Sr No': number;
  'Reg No': number | string;
  'Student Name': string;
  'Father Name': string;
  'Father-CNIC': string;
  'Class - Sec': string;
  'Campus': string;
  'Building No': string;
}

export function getStudentsData(): StudentRecord[] {
  // Uses process.cwd() to locate the file reliably in Vercel serverless environments
  const filePath = path.join(process.cwd(), 'data', 'students_report.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error("Excel file not found at:", filePath);
    return [];
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<StudentRecord>(sheet);
}