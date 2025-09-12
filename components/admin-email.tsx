"use client";

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Cohort = 'interested_2025_2' | 'signedup_2025_2' | 'previous_events';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminEmail() {
  // Discover summits for filtering
  const { data: regSummary } = useSWR('/api/summit/registrations', fetcher);
  const summits: string[] = useMemo(() => regSummary?.summitCounts ? Object.keys(regSummary.summitCounts) : [], [regSummary]);

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [subject, setSubject] = useState('Homborsund AI — Join us for 2025.2');
  const [preheader, setPreheader] = useState('Flashy Agents & Friendly Robots — October 18');
  const [intro, setIntro] = useState('We’d love to see you at our next gathering.');
  const [ctaLabel, setCtaLabel] = useState('Learn more and register');
  const [ctaUrl, setCtaUrl] = useState('/summit/2025.2');
  const [footerNote, setFooterNote] = useState('Questions? Just reply to this email.');
  const [body, setBody] = useState('<p>Agents are stepping into the real world — robots, drones and tools. Expect sharp talks, friendly demos and real conversations.</p><p>Bring a friend. Bring a demo. Bring your curiosity.</p>');
  const [campaignTag, setCampaignTag] = useState('2025-2-invite');
  const [includeSummits, setIncludeSummits] = useState<string[]>([]);
  const [includeEmailsText, setIncludeEmailsText] = useState('');
  const [excludeEmailsText, setExcludeEmailsText] = useState('');
  const [previewRecipients, setPreviewRecipients] = useState<{ email: string; name?: string; summits?: string[] }[] | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggleCohort = (c: Cohort) => {
    setCohorts((prev) => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const previewHtml = renderPreviewHtml({ subject, preheader, intro, body, cta: { label: ctaLabel, url: ctaUrl }, footerNote });

  const parseEmails = (text: string) => Array.from(new Set(text.split(/[\n,;\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean)));

  const preview = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/email/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohorts,
          includeSummits,
          includeEmails: parseEmails(includeEmailsText),
          excludeEmails: parseEmails(excludeEmailsText),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult(`Error: ${json.error || 'Failed to preview'}`);
        setPreviewRecipients(null);
        setSelectedRecipients({});
      } else {
        setPreviewRecipients(json.recipients || []);
        const defaults: Record<string, boolean> = {};
        for (const r of json.recipients || []) defaults[r.email] = true;
        setSelectedRecipients(defaults);
        setResult(`Preview: ${json.count || 0} recipients`);
      }
    } catch (err: any) {
      setResult(`Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  const send = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohorts,
          includeSummits,
          includeEmails: parseEmails(includeEmailsText),
          excludeEmails: parseEmails(excludeEmailsText),
          subject,
          preheader,
          intro,
          contentHtml: body,
          cta: { label: ctaLabel, url: ctaUrl },
          footerNote,
          campaignTag,
          // If a preview has been generated, honor the current selection.
          // Otherwise, fall back to server-side filtering only.
          overrideRecipients: previewRecipients ? Object.entries(selectedRecipients).filter(([email, on]) => on).map(([email]) => email) : [],
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult(`Error: ${json.error || 'Failed to send'}`);
      } else {
        setResult(`Sent ${json.sent} emails`);
      }
    } catch (err: any) {
      setResult(`Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Audience & Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Recipients</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={cohorts.includes('interested_2025_2')} onChange={() => toggleCohort('interested_2025_2')} /> Interested — 2025.2</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={cohorts.includes('signedup_2025_2')} onChange={() => toggleCohort('signedup_2025_2')} /> Signed Up — 2025.2</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={cohorts.includes('previous_events')} onChange={() => toggleCohort('previous_events')} /> Previous events — 2024 & 2025.1</label>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Summits (optional include)</p>
            <div className="grid grid-cols-2 gap-2">
              {summits.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input type="checkbox" checked={includeSummits.includes(s)} onChange={() => setIncludeSummits(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Include emails (one per line or comma separated)</label>
            <textarea className="w-full p-2 border rounded text-black min-h-[80px]" value={includeEmailsText} onChange={e => setIncludeEmailsText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Exclude emails (one per line or comma separated)</label>
            <textarea className="w-full p-2 border rounded text-black min-h-[80px]" value={excludeEmailsText} onChange={e => setExcludeEmailsText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Subject</label>
            <input className="w-full p-2 border rounded text-black" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Preheader</label>
            <input className="w-full p-2 border rounded text-black" value={preheader} onChange={e => setPreheader(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Intro (optional)</label>
            <input className="w-full p-2 border rounded text-black" value={intro} onChange={e => setIntro(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Body (HTML)</label>
            <textarea className="w-full p-2 border rounded text-black min-h-[150px]" value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="block text-sm">CTA Label</label>
              <input className="w-full p-2 border rounded text-black" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">CTA URL</label>
              <input className="w-full p-2 border rounded text-black" value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Footer note (optional)</label>
            <input className="w-full p-2 border rounded text-black" value={footerNote} onChange={e => setFooterNote(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Campaign tag</label>
            <input className="w-full p-2 border rounded text-black" value={campaignTag} onChange={e => setCampaignTag(e.target.value)} />
          </div>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Button onClick={preview} disabled={sending || (cohorts.length === 0 && includeSummits.length === 0 && !includeEmailsText)}>
              {sending ? 'Working…' : 'Preview Recipients'}
            </Button>
            <Button onClick={send} disabled={sending || (cohorts.length === 0 && includeSummits.length === 0 && !includeEmailsText) || !subject || !body}>
              {sending ? 'Sending…' : 'Send Email'}
            </Button>
            {result && <span className="text-sm text-gray-500">{result}</span>}
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe title="preview" className="w-full h-[700px] bg-white border" srcDoc={previewHtml} />
        </CardContent>
      </Card>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end mb-3">
            <span className="text-xs text-gray-500">{previewRecipients ? `${previewRecipients.length} found` : 'Preview to list recipients'}</span>
          </div>
          <div className="max-h-[640px] overflow-auto bg-white text-black rounded border p-2 space-y-1">
            {previewRecipients && previewRecipients.length > 0 ? (
              previewRecipients.map(r => (
                <label key={r.email} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!selectedRecipients[r.email]} onChange={() => setSelectedRecipients(prev => ({ ...prev, [r.email]: !prev[r.email] }))} />
                  <span className="font-medium">{r.name || r.email}</span>
                  <span className="text-gray-600">{r.name ? ` <${r.email}>` : ''}</span>
                  {r.summits && r.summits.length > 0 && (
                    <span className="ml-auto text-xs text-gray-500">{r.summits.join(', ')}</span>
                  )}
                </label>
              ))
            ) : (
              <div className="text-sm text-gray-600">No recipients yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function renderPreviewHtml({ subject, preheader, intro, body, cta, footerNote }: { subject: string; preheader?: string; intro?: string; body: string; cta?: { label: string; url: string }; footerNote?: string }) {
  // Basic preview wrapper; the server renders final HTML
  return `<!doctype html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/></head><body>
  <div style=\"max-width:600px;margin:16px auto;font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto;\">
    <div style=\"background: linear-gradient(90deg, #C2767A, #644C54); color:#fff; padding:16px 20px; border-radius:10px;\">
      <h1 style=\"margin:0;font-size:22px;\">${escapeHtml(subject)}</h1>
      ${preheader ? `<p style=\"margin:6px 0 0 0; opacity:.9;\">${escapeHtml(preheader)}</p>` : ''}
    </div>
    <div style=\"background:#102E3B;color:#E5E7EB;margin-top:12px;padding:16px 20px;border-radius:10px;\">
      ${intro ? `<p style=\"margin:0 0 12px 0; color:#C7D2FE;\">${escapeHtml(intro)}</p>` : ''}
      <div>${body}</div>
      ${cta ? `<p style=\"margin:16px 0 0 0;\"><a href=\"${cta.url}\" style=\"background: linear-gradient(90deg, #C2767A, #644C54); color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px; display: inline-block; font-weight: 600;\">${escapeHtml(cta.label)}</a></p>` : ''}
      ${footerNote ? `<p style=\"margin:16px 0 0 0; color:#9CA3AF; font-size:12px;\">${escapeHtml(footerNote)}</p>` : ''}
    </div>
  </div>
  </body></html>`;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
