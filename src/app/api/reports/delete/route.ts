import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST() {
  const filePath = path.join(process.cwd(), 'public', 'reports.csv');

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete file' }, { status: 500 });
  }
}
