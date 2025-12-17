import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/db';

export async function GET() {
  try {
    const history = await getHistory();
    return NextResponse.json(history);
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Ошибка получения истории' }, { status: 500 });
  }
}
