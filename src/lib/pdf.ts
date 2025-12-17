import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import type { Slide } from './ai';

const FONT_PATH = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');

export function hasCyrillicFont(): boolean {
  return fs.existsSync(FONT_PATH);
}

export function generateSRSPdf(content: string, topic: string, subject: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
      bufferPages: true,
    });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    if (hasCyrillicFont()) {
      doc.font(FONT_PATH);
    }

    // Title Page
    doc.fontSize(24).text(topic, { align: 'center' }).moveDown(2);
    doc.fontSize(16).text(`Предмет: ${subject}`, { align: 'center' }).moveDown(4);
    doc.fontSize(12).text('СРС (Самостоятельная работа студента)', { align: 'center' });

    doc.addPage();

    const lines = content.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        doc.moveDown(0.5);
        continue;
      }

      const isHeader =
        /^[А-ЯЁІЇЄҐ\s\d.]+:?$/.test(trimmedLine) ||
        /^\d+\.\s+[А-ЯЁІЇЄҐ]/.test(trimmedLine) ||
        trimmedLine.startsWith('ГЛАВА') ||
        trimmedLine.startsWith('ВВЕДЕНИЕ') ||
        trimmedLine.startsWith('ЗАКЛЮЧЕНИЕ') ||
        trimmedLine.startsWith('ОГЛАВЛЕНИЕ') ||
        trimmedLine.startsWith('СПИСОК');

      if (isHeader) {
        doc.moveDown(1).fontSize(14).text(trimmedLine, { align: 'left' }).moveDown(0.5);
        doc.fontSize(12);
      } else {
        if (doc.y > 700) doc.addPage();
        doc.text(trimmedLine, { align: 'justify', lineGap: 4, paragraphGap: 8 });
      }
    }

    // Page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(10).text(`${i + 1}`, 0, doc.page.height - 50, { align: 'center' });
    }

    doc.end();
  });
}

export function generatePresentationPdf(slides: Slide[], topic: string, subject: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      bufferPages: true,
    });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    if (hasCyrillicFont()) {
      doc.font(FONT_PATH);
    }

    const colors = {
      primary: '#1a365d',
      secondary: '#2b6cb0',
      accent: '#4299e1',
      text: '#2d3748',
      bullet: '#e53e3e',
    };

    // Filter out empty or invalid slides
    const validSlides = slides.filter(slide => 
      slide && (slide.title || (slide.bullets && slide.bullets.length > 0))
    );

    validSlides.forEach((slide, index) => {
      if (index > 0) doc.addPage();

      const pageWidth = doc.page.width - 120;
      const centerX = 60;

      // Border
      doc.rect(40, 30, doc.page.width - 80, doc.page.height - 60).stroke(colors.accent);

      // Slide number
      doc.fontSize(10).fillColor(colors.secondary).text(`${index + 1} / ${validSlides.length}`, doc.page.width - 100, doc.page.height - 45);

      // Title
      const title = slide.title || `Слайд ${index + 1}`;
      doc.fontSize(28).fillColor(colors.primary).text(title, centerX, 60, { width: pageWidth, align: 'center' });

      // Line under title
      doc.moveTo(100, 120).lineTo(doc.page.width - 100, 120).strokeColor(colors.accent).lineWidth(2).stroke();

      // Bullets
      if (slide.bullets && slide.bullets.length > 0) {
        let yPos = 150;
        doc.fontSize(16).fillColor(colors.text);

        for (const bullet of slide.bullets) {
          if (!bullet || yPos > doc.page.height - 80) continue;
          
          // Bullet point
          doc.circle(80, yPos + 8, 4).fillColor(colors.bullet).fill();
          
          // Bullet text
          doc.fillColor(colors.text).text(bullet, 100, yPos, { 
            width: pageWidth - 60, 
            lineGap: 3 
          });
          
          yPos = doc.y + 12;
        }
      }
    });

    doc.end();
  });
}
