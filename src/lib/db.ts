import { sql } from '@vercel/postgres';

export interface Generation {
  id: number;
  type: string;
  topic: string;
  subject: string;
  pages: number;
  additional_info: string | null;
  content: string;
  pdf_data: Buffer | null;
  created_at: string;
}

export async function initDB(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS generations (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      topic TEXT NOT NULL,
      subject TEXT NOT NULL,
      pages INTEGER NOT NULL,
      additional_info TEXT,
      content TEXT NOT NULL,
      pdf_data BYTEA,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function saveGeneration(data: {
  type: string;
  topic: string;
  subject: string;
  pages: number;
  additionalInfo?: string;
  content: string;
  pdfBuffer: Buffer;
}): Promise<{ id: number }> {
  // Ensure table exists
  await initDB();
  
  const pdfBase64 = data.pdfBuffer.toString('base64');
  
  const result = await sql`
    INSERT INTO generations (type, topic, subject, pages, additional_info, content, pdf_data)
    VALUES (
      ${data.type},
      ${data.topic},
      ${data.subject},
      ${data.pages},
      ${data.additionalInfo || null},
      ${data.content},
      decode(${pdfBase64}, 'base64')
    )
    RETURNING id
  `;
  
  return { id: result.rows[0].id };
}

export async function getHistory(): Promise<Omit<Generation, 'content' | 'pdf_data'>[]> {
  await initDB();
  
  const result = await sql`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations 
    ORDER BY created_at DESC 
    LIMIT 50
  `;
  
  return result.rows as Omit<Generation, 'content' | 'pdf_data'>[];
}

export async function getById(id: number): Promise<Generation | null> {
  await initDB();
  
  const result = await sql`
    SELECT id, type, topic, subject, pages, additional_info, content, 
           encode(pdf_data, 'base64') as pdf_data, created_at
    FROM generations 
    WHERE id = ${id}
  `;
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    ...row,
    pdf_data: row.pdf_data ? Buffer.from(row.pdf_data, 'base64') : null,
  } as Generation;
}

export async function deleteById(id: number): Promise<boolean> {
  await initDB();
  
  const result = await sql`
    DELETE FROM generations 
    WHERE id = ${id}
  `;
  
  return (result.rowCount ?? 0) > 0;
}
