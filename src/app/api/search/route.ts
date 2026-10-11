import { NextResponse } from 'next/server';
import { getStudentsData } from '@/lib/excel';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';
  const type = searchParams.get('type') || 'cnic';

  if (!query) {
    return NextResponse.json({ results: [], parentInfo: null });
  }

  const students = getStudentsData();

  const filtered = students.filter(student => {
    if (type === 'cnic') {
      return String(student['Father-CNIC'] || '').toLowerCase().includes(query);
    } else if (type === 'reg') {
      return String(student['Reg No'] || '').toLowerCase() === query;
    } else if (type === 'name') {
      return String(student['Student Name'] || '').toLowerCase().includes(query);
    } else if (type === 'father') {
      return String(student['Father Name'] || '').toLowerCase().includes(query);
    }
    return false;
  });

  if (filtered.length === 0) {
    return NextResponse.json({ results: [], parentInfo: null });
  }

  // Extract parent summary details from the first matching record
  const primaryRecord = filtered[0];
  const parentInfo = {
    fatherName: primaryRecord['Father Name'],
    fatherCnic: primaryRecord['Father-CNIC'],
    totalChildren: filtered.length,
  };

  return NextResponse.json({ results: filtered, parentInfo });
}