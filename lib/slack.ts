import { type RegistrationData } from '@/lib/registrations';

const slackWebhookUrl = process.env.SLACK_SIGNUPS_WEBHOOK_URL;

function formatValue(value?: string) {
  return value && value.trim().length > 0 ? value.trim() : 'N/A';
}

export async function notifySummitSignup(registration: RegistrationData) {
  if (!slackWebhookUrl) {
    console.warn('Slack webhook URL not configured. Skipping signup notification.');
    return;
  }

  try {
    const registeredAt = new Date(registration.timestamp);
    const registeredAtDisplay = Number.isNaN(registeredAt.getTime())
      ? registration.timestamp
      : registeredAt.toLocaleString('en-GB', { timeZone: 'Europe/Oslo' });

    const blocks: Array<Record<string, unknown>> = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'New Summit Signup',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${registration.name}` },
          { type: 'mrkdwn', text: `*Email:*\n${formatValue(registration.email)}` },
          { type: 'mrkdwn', text: `*Company:*\n${formatValue(registration.company)}` },
          { type: 'mrkdwn', text: `*Phone:*\n${formatValue(registration.phone)}` },
          { type: 'mrkdwn', text: `*Summit:*\n${registration.summit}` },
          { type: 'mrkdwn', text: `*Registered:*\n${registeredAtDisplay}` },
          { type: 'mrkdwn', text: `*Ticket ID:*\n\`${registration.id}\`` },
        ],
      },
    ];

    const commentValue = formatValue(registration.comment);
    if (commentValue !== 'N/A') {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Comment:*\n>${commentValue}`,
        },
      });
    }

    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `IP: ${registration.ip}`,
        },
        {
          type: 'mrkdwn',
          text: `User Agent: ${registration.userAgent}`,
        },
      ],
    });

    const payload = {
      text: `:tickets: New summit signup: ${registration.name}`,
      blocks,
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send Slack notification. Response status:', response.status);
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}
