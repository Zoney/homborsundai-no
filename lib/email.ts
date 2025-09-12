import { Resend } from 'resend';

export async function sendTicketEmail(to: string, ticketId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || '';
  const ticketUrl = `${baseUrl}/ticket/${ticketId}`;
  const subject = 'Your Homborsund AI Summit Ticket';
  const htmlBody = `<p>Thank you for registering for the Homborsund AI Summit.</p><p>Your ticket is available <a href="${ticketUrl}">here</a>.</p>`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@homborsund.ai';

  // Check if running in a local development environment
  if (process.env.NODE_ENV === 'development' || baseUrl.includes('localhost')) {
    console.log('--- Sending Ticket Email (Local Development) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Body:', htmlBody);
    console.log('Ticket URL:', ticketUrl);
    console.log('From:', fromEmail);
    console.log('-------------------------------------------------');
    return;
  }

  if (!process.env.RESEND_API_KEY || !to) {
    console.warn('Resend API key not configured or no recipient email.');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return;
    }

    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

export type CampaignEmailOptions = {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
};

export async function sendCampaignEmail({ to, subject, html, tags }: CampaignEmailOptions) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@homborsund.ai';

  // Local dev: log email instead of sending
  if (process.env.NODE_ENV === 'development' || (process.env.NEXT_PUBLIC_BASE_URL || '').includes('localhost')) {
    console.log('--- Sending Campaign Email (Local Development) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML Body:', html);
    console.log('From:', fromEmail);
    console.log('Tags:', tags);
    console.log('-------------------------------------------------');
    return { ok: true } as const;
  }

  if (!process.env.RESEND_API_KEY || !to) {
    console.warn('Resend API key not configured or no recipient email.');
    return { ok: false } as const;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      // Resend supports tagging for analytics; optional
      // @ts-expect-error: tags is supported in Resend API
      tags,
    } as any);

    if (error) {
      console.error('Failed to send campaign email:', error);
      return { ok: false } as const;
    }

    console.log('Campaign email sent:', data);
    return { ok: true } as const;
  } catch (err) {
    console.error('Error sending campaign email:', err);
    return { ok: false } as const;
  }
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
           <a href="${cta.url}"
              style="background: linear-gradient(90deg, #C2767A, #644C54); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 10px; display: inline-block; font-weight: 600;">
             ${cta.label}
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
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container card shadow" style="max-width:600px; background:#0F2C35;">
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
