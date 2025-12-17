import { NextRequest, NextResponse } from 'next/server';
import { generateSRS, generatePresentation } from '@/lib/ai';
import { generateSRSPdf, generatePresentationPdf } from '@/lib/pdf';
import { saveGeneration } from '@/lib/db';
import type { Language } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, topic, subject, pages, additionalInfo, language = 'ru' } = body;

    if (!type || !topic || !subject || !pages) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    if (!['srs', 'presentation'].includes(type)) {
      return NextResponse.json(
        { error: 'Неверный тип: используйте "srs" или "presentation"' },
        { status: 400 }
      );
    }

    console.log(`📝 Generating ${type} for topic: "${topic}" in ${language}`);

    let content: string;
    let pdfBuffer: Buffer;
    const lang = language as Language;

    if (type === 'srs') {
      content = await generateSRS(topic, subject, pages, additionalInfo, lang);
      pdfBuffer = await generateSRSPdf(content, topic, subject);
    } else {
      const slides = await generatePresentation(topic, subject, pages, additionalInfo, lang);
      content = JSON.stringify(slides, null, 2);
      pdfBuffer = await generatePresentationPdf(slides, topic, subject);
    }

    const saved = await saveGeneration({
      type,
      topic,
      subject,
      pages: parseInt(pages),
      additionalInfo,
      content,
      pdfBuffer,
    });

    console.log(`✅ Generated and saved with ID: ${saved.id}`);

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const pdfData = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}_${Date.now()}.pdf"`,
        'X-Generation-Id': saved.id.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Generation error:', error);
    return NextResponse.json(
      { error: 'Ошибка генерации', message: (error as Error).message },
      { status: 500 }
    );
  }
}
