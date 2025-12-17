'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  FileText,
  Presentation,
  Download,
  BookOpen,
  GraduationCap,
  History,
  Trash2,
  AlertCircle,
  CheckCircle,
  Globe,
} from 'lucide-react';
import { type Language, languages, t } from '@/lib/i18n';

interface HistoryItem {
  id: number;
  type: string;
  topic: string;
  subject: string;
  pages: number;
  created_at: string;
}

export default function HomePage() {
  const [lang, setLang] = useState<Language>('ru');
  const [formData, setFormData] = useState({
    type: 'srs',
    topic: '',
    subject: '',
    pages: 5,
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch {
      console.error('Failed to load history');
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { type, topic, subject, pages, additionalInfo } = formData;

    if (!topic.trim() || !subject.trim()) {
      setError(t(lang, 'errorFillFields'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, subject, pages, additionalInfo, language: lang }),
      });

      const contentType = res.headers.get('content-type');
      
      if (!res.ok || !contentType?.includes('application/pdf')) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Ошибка генерации');
      }

      const blob = await res.blob();
      
      if (blob.size === 0) {
        throw new Error('Получен пустой PDF файл');
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_${topic.slice(0, 30)}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(t(lang, 'success'));
      loadHistory();
      setFormData((prev) => ({ ...prev, topic: '', additionalInfo: '' }));
    } catch (err) {
      console.error('Generation error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    const res = await fetch(`/api/history/${id}?download=pdf`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document_${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t(lang, 'confirmDelete'))) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    loadHistory();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(lang === 'en' ? 'en-GB' : lang === 'tg' ? 'tg-TJ' : 'ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 glass-card px-3 py-2">
            <Globe className="w-4 h-4 text-slate-400" />
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  lang === l.code
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.flag} {l.name}
              </button>
            ))}
          </div>
        </div>

        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 animate-float pulse-glow">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">{t(lang, 'appName')}</span>
          </h1>
          <p className="text-slate-400">{t(lang, 'appDescription')}</p>
        </header>

        <div className="glass-card p-8 mb-6">
          <form onSubmit={handleGenerate}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">{t(lang, 'documentType')}</label>
              <div className="type-toggle">
                <div
                  className="absolute h-[calc(100%-8px)] bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg transition-all duration-300"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: formData.type === 'srs' ? '4px' : 'calc(50%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => updateField('type', 'srs')}
                  className={`type-toggle-btn flex items-center justify-center gap-2 ${formData.type === 'srs' ? 'active' : ''}`}
                >
                  <FileText className="w-4 h-4" />
                  {t(lang, 'srs')}
                </button>
                <button
                  type="button"
                  onClick={() => updateField('type', 'presentation')}
                  className={`type-toggle-btn flex items-center justify-center gap-2 ${formData.type === 'presentation' ? 'active' : ''}`}
                >
                  <Presentation className="w-4 h-4" />
                  {t(lang, 'presentation')}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">{t(lang, 'topic')} {t(lang, 'required')}</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => updateField('topic', e.target.value)}
                placeholder={t(lang, 'topicPlaceholder')}
                className="glass-input"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">{t(lang, 'subject')} {t(lang, 'required')}</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder={t(lang, 'subjectPlaceholder')}
                className="glass-input"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {formData.type === 'srs' ? t(lang, 'pagesCount') : t(lang, 'slidesCount')}
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => updateField('pages', Math.max(3, Math.min(20, parseInt(e.target.value) || 5)))}
                min={3}
                max={20}
                className="glass-input w-32"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">{t(lang, 'additionalInfo')}</label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => updateField('additionalInfo', e.target.value)}
                placeholder={t(lang, 'additionalPlaceholder')}
                rows={3}
                className="glass-input resize-none"
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="spinner" />
                  {t(lang, 'generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t(lang, 'generate')}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2 font-medium">
              <History className="w-5 h-5" />
              {t(lang, 'history')} ({history.length})
            </span>
            <span className="text-2xl">{showHistory ? '−' : '+'}</span>
          </button>

          {showHistory && history.length > 0 && (
            <div className="mt-4 space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.type === 'srs' ? (
                      <FileText className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    ) : (
                      <Presentation className="w-5 h-5 text-accent-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.topic}</p>
                      <p className="text-xs text-slate-400">
                        {item.subject} • {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDownload(item.id)}
                      className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                      title={t(lang, 'download')}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title={t(lang, 'delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showHistory && history.length === 0 && (
            <p className="mt-4 text-center text-slate-500 py-4">{t(lang, 'historyEmpty')}</p>
          )}
        </div>

        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t(lang, 'poweredBy')}
          </p>
          <p className="mt-1 text-xs text-slate-600">v2.0.0 (Next.js)</p>
        </footer>
      </div>
    </div>
  );
}
