import { NextRequest, NextResponse } from 'next/server';
import { getById, deleteById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const record = await getById(id);

    if (!record) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    if (searchParams.get('download') === 'pdf' && record.pdf_data) {
      const pdfData = new Uint8Array(record.pdf_data);
      return new NextResponse(pdfData, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${record.type}_${record.id}.pdf"`,
        },
      });
    }

    const { pdf_data, ...metadata } = record;
    return NextResponse.json({ ...metadata, hasPdf: !!pdf_data });
  } catch (error) {
    console.error('Get by ID error:', error);
    return NextResponse.json({ error: 'Ошибка получения записи' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const deleted = await deleteById(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Запись удалена' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}
