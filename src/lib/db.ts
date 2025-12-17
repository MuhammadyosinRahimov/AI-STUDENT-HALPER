import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'app.db');

function getDb(): Database.Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return new Database(DB_PATH);
}

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

export function initDB(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      topic TEXT NOT NULL,
      subject TEXT NOT NULL,
      pages INTEGER NOT NULL,
      additional_info TEXT,
      content TEXT NOT NULL,
      pdf_data BLOB,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.close();
}

export function saveGeneration(data: {
  type: string;
  topic: string;
  subject: string;
  pages: number;
  additionalInfo?: string;
  content: string;
  pdfBuffer: Buffer;
}): { id: number } {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO generations (type, topic, subject, pages, additional_info, content, pdf_data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.type,
    data.topic,
    data.subject,
    data.pages,
    data.additionalInfo || null,
    data.content,
    data.pdfBuffer
  );
  db.close();
  return { id: result.lastInsertRowid as number };
}

export function getHistory(): Omit<Generation, 'content' | 'pdf_data'>[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations ORDER BY created_at DESC LIMIT 50
  `).all() as Omit<Generation, 'content' | 'pdf_data'>[];
  db.close();
  return rows;
}

export function getById(id: number): Generation | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM generations WHERE id = ?').get(id) as Generation | undefined;
  db.close();
  return row || null;
}

export function deleteById(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM generations WHERE id = ?').run(id);
  db.close();
  return result.changes > 0;
}

// Initialize on import
initDB();
