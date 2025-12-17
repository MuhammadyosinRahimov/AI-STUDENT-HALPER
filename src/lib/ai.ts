import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Language } from './i18n';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  },
});

const languageInstructions: Record<Language, string> = {
  ru: 'Пиши на русском языке. Используй формальный академический стиль.',
  tg: 'Бо забони тоҷикӣ нависед. Услуби расмии академикӣ истифода баред.',
  en: 'Write in English. Use formal academic style.',
};

const structureLabels: Record<Language, { title: string; toc: string; intro: string; main: string; conclusion: string; refs: string; chapter: string }> = {
  ru: { title: 'ТИТУЛЬНЫЙ ЛИСТ', toc: 'ОГЛАВЛЕНИЕ', intro: 'ВВЕДЕНИЕ', main: 'ОСНОВНАЯ ЧАСТЬ', conclusion: 'ЗАКЛЮЧЕНИЕ', refs: 'СПИСОК ЛИТЕРАТУРЫ', chapter: 'ГЛАВА' },
  tg: { title: 'САҲИФАИ САРЛАВҲА', toc: 'МУНДАРИҶА', intro: 'МУҚАДДИМА', main: 'ҚИСМИ АСОСӢ', conclusion: 'ХУЛОСА', refs: 'РӮЙХАТИ АДАБИЁТ', chapter: 'БОБИ' },
  en: { title: 'TITLE PAGE', toc: 'TABLE OF CONTENTS', intro: 'INTRODUCTION', main: 'MAIN BODY', conclusion: 'CONCLUSION', refs: 'REFERENCES', chapter: 'CHAPTER' },
};

export async function generateSRS(
  topic: string,
  subject: string,
  pages: number,
  additionalInfo?: string,
  language: Language = 'ru'
): Promise<string> {
  const langInstr = languageInstructions[language];
  const labels = structureLabels[language];
  
  const prompt = `You are an academic assistant for students.
${langInstr}
Generate high-quality, structured content.

Create an academic paper on the topic: "${topic}"
Subject: ${subject}
Length: approximately ${pages} pages
${additionalInfo ? `Additional requirements: ${additionalInfo}` : ''}

Structure:
1. ${labels.title} (topic and subject name only)
2. ${labels.toc}
3. ${labels.intro} (relevance, goals, objectives)
4. ${labels.main} (${Math.max(2, pages - 2)} chapters with subsections)
5. ${labels.conclusion} (summary)
6. ${labels.refs} (5-7 sources)

Write in detail with facts and examples. Start each chapter with a new paragraph.
Output format: plain text with headers (no markdown).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export interface Slide {
  slideNumber: number;
  title: string;
  bullets: string[];
}

export async function generatePresentation(
  topic: string,
  subject: string,
  slides: number,
  additionalInfo?: string,
  language: Language = 'ru'
): Promise<Slide[]> {
  const langInstr = languageInstructions[language];

  const prompt = `You are an academic assistant for students.
${langInstr}

Create a presentation on the topic: "${topic}"
Subject: ${subject}
Number of slides: ${slides}
${additionalInfo ? `Additional requirements: ${additionalInfo}` : ''}

IMPORTANT: Response must be ONLY a valid JSON array with no additional text.
Format for each slide:
{
  "slideNumber": 1,
  "title": "Slide title",
  "bullets": ["Point 1", "Point 2", "Point 3"]
}

Slides should include:
1. Title slide (topic and subject)
2. Contents/Plan
3-${slides - 1}. Main information slides
${slides}. Conclusion/Summary

Return ONLY a JSON array, starting with [ and ending with ]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let content = response.text().trim();

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    content = jsonMatch[0];
  }

  return JSON.parse(content) as Slide[];
}
