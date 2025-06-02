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
