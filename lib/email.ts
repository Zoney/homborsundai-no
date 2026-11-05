// The e-mails summit attendees get: the ticket (with the link to the QR code page) and the
// admins' campaign mails. Sent from summit@post.homborsundai.no through our own mail server
// (lib/epost.ts), never through a third party.

import { sendEpost } from './epost';
import { SUMMIT_METADATA, findSummitIdByRegistrationKey, resolveSummitId } from './summit-config';
import type { RegistrationData } from './registrations';

export function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3520').replace(/\/+$/, '');
}

export function ticketUrl(token: string): string {
  return `${baseUrl()}/ticket/${encodeURIComponent(token)}`;
}

export function summitLabel(summitKey: string): { title: string; date: string; id: string } {
  const id = findSummitIdByRegistrationKey(summitKey) ?? resolveSummitId(summitKey);
  const meta = SUMMIT_METADATA[id];
  return { id, title: meta ? `${meta.title} ${id}` : `Homborsund AI ${summitKey}`, date: meta?.date ?? '' };
}

export function renderTicketEmail(reg: Pick<RegistrationData, 'id' | 'name' | 'summit'>) {
  const s = summitLabel(reg.summit);
  const url = ticketUrl(reg.id);
  const mine = `${baseUrl()}/my-tickets`;
  const subject = `Your ticket: ${s.title}`;
  const text = [
    `Hi ${reg.name},`,
    '',
    `You are signed up for ${s.title}${s.date ? ` (${s.date})` : ''}.`,
    '',
    'Your ticket, with the QR code we scan at the door:',
    url,
    '',
    'Keep this e-mail, or open the link and save the page. If you cannot come after all, you can cancel on the same page.',
    '',
    `Want all your tickets in one place? Log in at ${mine} with this e-mail address. You get a code by e-mail, and you can add a passkey (Face ID, Touch ID) so you do not need the code next time. An account is optional.`,
    '',
    'See you there,',
    'Homborsund AI',
    '',
    `Privacy: ${baseUrl()}/personvern`,
    '(This e-mail was sent automatically. Replies do not reach anyone.)',
  ].join('\n');
  const html = renderCampaignEmail({
    title: s.title,
    preheader: 'Your ticket and QR code',
    intro: `Hi ${reg.name}, you are signed up${s.date ? ` for ${s.date}` : ''}.`,
    bodyHtml: `<p>Your ticket, with the QR code we scan at the door, is one click away. Keep this e-mail, or open the link and save the page. If you cannot come after all, you can cancel on the same page.</p>
<p>Want all your tickets in one place? <a href="${escapeHtml(mine)}">Log in</a> with this e-mail address. You get a code by e-mail, and you can add a passkey so you do not need the code next time. An account is optional.</p>`,
    cta: { label: 'Show my ticket', url },
    footerNote: 'Sent automatically from summit@post.homborsundai.no. Replies do not reach anyone.',
  });
  return { subject, text, html };
}

export async function sendTicketEmail(reg: Pick<RegistrationData, 'id' | 'name' | 'summit' | 'email'>) {
  if (!reg.email) return;
  const { subject, text, html } = renderTicketEmail(reg);
  await sendEpost({ type: 'billett', til: reg.email, emne: subject, tekst: text, html });
}

export type CampaignEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendCampaignEmail({ to, subject, html, text }: CampaignEmailOptions) {
  if (!to) return { ok: false } as const;
  try {
    await sendEpost({ type: 'kampanje', til: to, emne: subject, html, tekst: text ?? htmlToText(html) });
    return { ok: true } as const;
  } catch {
    return { ok: false } as const;
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<(br|\/p|\/h[1-6]|\/tr|\/li)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function renderCampaignEmail(params: {
  title: string;
  preheader?: string;
  intro?: string;
  bodyHtml: string; // already sanitized/allowed HTML
  cta?: { label: string; url: string };
  footerNote?: string;
}): string {
  const { title, preheader, intro, bodyHtml, cta, footerNote } = params;
  const safePreheader = preheader || '';
  const safeIntro = intro || '';
  const ctaHtml = cta
    ? `<tr>
         <td align="center" style="padding: 24px 0 0 0;">
           <a href="${escapeHtml(cta.url)}"
              style="background: linear-gradient(90deg, #C2767A, #644C54); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 10px; display: inline-block; font-weight: 600;">
             ${escapeHtml(cta.label)}
           </a>
         </td>
       </tr>`
    : '';

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>${escapeHtml(title)}</title>
    <style>
      /* Basic resets for email clients */
      body { margin:0; padding:0; background-color:#0E1C24; }
      table { border-collapse:collapse; }
      img { border:0; outline:none; text-decoration:none; }
      a { color: #C2767A; }
      .container { width:100%; padding: 0 16px; }
      .shadow { box-shadow: 0 10px 30px rgba(194, 118, 122, 0.25); }
      .card { border-radius:16px; overflow:hidden; }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#0E1C24; color:#1F2937;">
    <span style="display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden;">${escapeHtml(safePreheader)}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container card shadow-sm" style="max-width:600px; background:#0F2C35;">
            <tr>
              <td style="background: linear-gradient(90deg, #C2767A, #644C54); padding: 28px 24px; text-align:center;">
                <h1 style="margin:0; font-size: 26px; line-height: 1.2; color:#ffffff; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px; background:#102E3B; color:#E5E7EB; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
                ${safeIntro ? `<p style=\"margin:0 0 12px 0; color:#C7D2FE;\">${escapeHtml(safeIntro)}</p>` : ''}
                <div style="color:#E5E7EB; line-height:1.6;">${bodyHtml}</div>
              </td>
            </tr>
            ${ctaHtml}
            <tr>
              <td style="padding: 18px 24px 28px 24px; background:#102E3B; color:#9CA3AF; text-align:center; font-size:12px; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
                <p style="margin:0 0 6px 0;">Homborsund AI • Org. nr: 935616913</p>
                <p style="margin:0;">You receive this because you registered your interest or attended our events.</p>
                ${footerNote ? `<p style=\"margin:6px 0 0 0;\">${escapeHtml(footerNote)}</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
