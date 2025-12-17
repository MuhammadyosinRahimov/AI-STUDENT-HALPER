import { NextResponse } from 'next/server';
import { hasCyrillicFont } from '@/lib/pdf';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    fontAvailable: hasCyrillicFont(),
    message: hasCyrillicFont() ? 'Шрифт загружен' : 'Добавьте font в public/fonts/',
  });
}
