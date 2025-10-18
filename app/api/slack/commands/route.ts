import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { countRegistrations, getRegistrationsForSummit, type RegistrationData } from '@/lib/registrations';
import {
  DEFAULT_YEAR,
  DEFAULT_SUMMIT_REGISTRATION_KEY,
  SUMMIT_METADATA,
  normalizeSummitRegistrationKey,
  resolveSummitId,
} from '@/lib/summit-config';

const MAX_LIST_RESULTS = 30;
const DEFAULT_LIST_RESULTS = 10;

type SlackResponse = {
  response_type: 'ephemeral' | 'in_channel';
  text: string;
};

function buildUsage(): SlackResponse {
  return {
    response_type: 'ephemeral',
    text: [
      '*Available commands:*',
      '`count [summit|all]` → total signups (default summit is current)',
      '`list [summit] [limit]` → recent signups (default limit 10, max 30)',
      '`help` → this message',
      '',
      '*Examples:*',
      '`/summit-signups count`',
      '`/summit-signups count all`',
      '`/summit-signups list 2025.2 5`',
      '`/summit-signups list limit=15 summit=2025.1`',
    ].join('\n'),
  };
}

function verifySlackSignature(signingSecret: string, body: string, timestamp: string | null, signature: string | null): boolean {
  if (!timestamp || !signature) {
    return false;
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 300) {
    // Replay attack window exceeded (5 minutes)
    return false;
  }

  const baseString = `v0:${timestamp}:${body}`;
  const expectedSignature = `v0=${createHmac('sha256', signingSecret).update(baseString).digest('hex')}`;

  const signatureBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

function resolveSummit(input: string | null | undefined): string | 'all' {
  if (!input) {
    return DEFAULT_YEAR;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return DEFAULT_YEAR;
  }

  const normalized = trimmed.toLowerCase();
  if (normalized === 'all' || normalized === 'total') {
    return 'all';
  }

  if (normalized === 'current' || normalized === 'latest' || normalized === 'default') {
    return DEFAULT_YEAR;
  }

  return resolveSummitId(trimmed);
}

function parseListOptions(args: string[]): { summit: string | 'all'; limit: number } {
  let summitArg: string | null = null;
  let limitArg: number | null = null;

  for (const rawArg of args) {
    const value = rawArg.trim();
    if (!value) {
      continue;
    }

    const equalsIndex = value.indexOf('=');
    if (equalsIndex > -1) {
      const key = value.slice(0, equalsIndex).toLowerCase();
      const val = value.slice(equalsIndex + 1);
      if (!val) continue;

      if (key === 'summit' && !summitArg) {
        summitArg = val;
        continue;
      }

      if (key === 'limit' && !limitArg) {
        const parsedLimit = Number(val);
        if (Number.isFinite(parsedLimit)) {
          limitArg = parsedLimit;
        }
        continue;
      }
    }

    if (!summitArg && !/^\d+$/.test(value)) {
      summitArg = value;
      continue;
    }

    if (!limitArg) {
      const parsedLimit = Number(value);
      if (Number.isFinite(parsedLimit)) {
        limitArg = parsedLimit;
      }
    }
  }

  const resolvedSummit = resolveSummit(summitArg);
  const resolvedLimit = Math.max(1, Math.min(limitArg ?? DEFAULT_LIST_RESULTS, MAX_LIST_RESULTS));

  return { summit: resolvedSummit, limit: resolvedLimit };
}

function formatSummitName(summit: string): string {
  const resolvedId = resolveSummitId(summit);
  const metadata = SUMMIT_METADATA[resolvedId];
  return metadata ? `${metadata.title} (${resolvedId})` : summit;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString('en-GB', { timeZone: 'Europe/Oslo' });
}

function formatList(registrations: RegistrationData[], summit: string, limit: number): SlackResponse {
  if (registrations.length === 0) {
    return {
      response_type: 'ephemeral',
      text: `No registrations found for ${formatSummitName(summit)}.`,
    };
  }

  const sorted = [...registrations].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return (Number.isNaN(timeB) ? 0 : timeB) - (Number.isNaN(timeA) ? 0 : timeA);
  });

  const limited = sorted.slice(0, limit);
  const lines = limited.map((registration, index) => {
    const parts = [
      `${index + 1}. *${registration.name}*`,
    ];

    if (registration.email) {
      parts.push(`<mailto:${registration.email}|${registration.email}>`);
    }

    if (registration.phone) {
      parts.push(registration.phone);
    }

    parts.push(`_${formatTimestamp(registration.timestamp)}_`);

    return parts.join(' • ');
  });

  const extra = registrations.length > limit
    ? `\n…${registrations.length - limit} more. Increase the limit to view additional signups.`
    : '';

  return {
    response_type: 'ephemeral',
    text: [
      `Showing ${limited.length} of ${registrations.length} signups for *${formatSummitName(summit)}*:`,
      '',
      ...lines,
      extra,
    ].join('\n'),
  };
}

async function handleCount(args: string[]): Promise<SlackResponse> {
  const target = resolveSummit(args[0] ?? null);

  if (target === 'all') {
    const [total, currentSummitCount] = await Promise.all([
      countRegistrations(),
      getRegistrationsForSummit(DEFAULT_SUMMIT_REGISTRATION_KEY).then((rows) => rows.length).catch(() => 0),
    ]);

    return {
      response_type: 'ephemeral',
      text: [
        `Total registrations across all summits: *${total}*.`,
        `Current summit (${formatSummitName(DEFAULT_YEAR)}): *${currentSummitCount}*.`,
      ].join('\n'),
    };
  }

  const registrationKey = normalizeSummitRegistrationKey(target);
  const registrations = await getRegistrationsForSummit(registrationKey).catch((error) => {
    console.error('Slack count command error:', error);
    return null;
  });

  if (!registrations) {
    return {
      response_type: 'ephemeral',
      text: 'Unable to fetch registrations right now. Please try again later.',
    };
  }

  return {
    response_type: 'ephemeral',
    text: `Registrations for *${formatSummitName(target)}*: *${registrations.length}*.`,
  };
}

async function handleList(args: string[]): Promise<SlackResponse> {
  const { summit, limit } = parseListOptions(args);

  if (summit === 'all') {
    return {
      response_type: 'ephemeral',
      text: 'Listing registrations across all summits is not supported. Specify a summit (e.g. `list 2025.2`) or use `count all` for totals.',
    };
  }

  const registrationKey = normalizeSummitRegistrationKey(summit);
  const registrations = await getRegistrationsForSummit(registrationKey).catch((error) => {
    console.error('Slack list command error:', error);
    return null;
  });

  if (!registrations) {
    return {
      response_type: 'ephemeral',
      text: 'Unable to fetch registrations right now. Please try again later.',
    };
  }

  return formatList(registrations, summit, limit);
}

function parseCommand(text: string): { action: string; args: string[] } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { action: 'help', args: [] };
  }

  const [action, ...args] = trimmed.split(/\s+/);
  return {
    action: action.toLowerCase(),
    args,
  };
}

export async function POST(request: NextRequest) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;

  if (!signingSecret) {
    console.error('Missing SLACK_SIGNING_SECRET environment variable.');
    return NextResponse.json(
      { response_type: 'ephemeral', text: 'Slack integration is not configured. Missing signing secret.' },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const isValid = verifySlackSignature(
    signingSecret,
    rawBody,
    request.headers.get('x-slack-request-timestamp'),
    request.headers.get('x-slack-signature'),
  );

  if (!isValid) {
    console.warn('Received Slack command with invalid signature.');
    return new NextResponse(null, { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const text = params.get('text') ?? '';

  const { action, args } = parseCommand(text);

  switch (action) {
    case 'count':
      return NextResponse.json(await handleCount(args));
    case 'list':
      return NextResponse.json(await handleList(args));
    case 'help':
    default:
      return NextResponse.json(buildUsage());
  }
}
