export async function sendTicketEmail(to: string, ticketId: string) {
  if (!process.env.RESEND_API_KEY || !to) {
    console.warn('Resend API key not configured or no recipient email.');
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || '';
  const ticketUrl = `${baseUrl}/ticket/${ticketId}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@homborsund.ai',
        to,
        subject: 'Your Homborsund AI Summit Ticket',
        html: `<p>Thank you for registering for the Homborsund AI Summit.</p><p>Your ticket is available <a href="${ticketUrl}">here</a>.</p>`,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Failed to send email:', text);
    }
  } catch (err) {
    console.error('Error sending email:', err);
  }
}
