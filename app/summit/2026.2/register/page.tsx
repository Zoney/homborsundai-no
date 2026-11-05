"use client";

import RegistrationForm from "@/components/registration-form";
import { SUMMIT_METADATA } from "@/lib/summit-config";

const YEAR = "2026.2";
const SUMMIT_KEY = "2026.2.info";

export default function RegisterPage() {
  const summitInfo = SUMMIT_METADATA[YEAR];
  return (
    <RegistrationForm
      year={YEAR}
      summitKey={SUMMIT_KEY}
      title={`Sign up for Summit ${YEAR}`}
      descriptions={[
        summitInfo.theme,
        <>
          Saturday 3 October 2026, Vågsholt skole in Krømpe. Doors at 15:00 with the grill already lit, first talk at 17:00. Four talks, two special guests,
          one old blackboard, no laptops needed. Yes, it&apos;s a real event — the venue just happens to have an outhouse instead of a lobby.
        </>,
      ]}
      commentPlaceholder="A talk you'd like to give, a question you'd like us to wrestle with, or nothing at all."
      submitLabel="Count me in — October 3rd"
      successTitle="You're in!"
      successSubtitle={`${summitInfo.title} ${YEAR} — Saturday 3 October 2026 at Vågsholt skole in Krømpe.`}
      successBody={
        <p>
          Put it in the calendar — Saturday 3 October, doors 15:00, first talk 17:00. We bring the grill; you bring whatever deserves a place on it, a drink
          that flatters AI, and at least one strong opinion. Leave the laptop at home — the schoolhouse has a blackboard and chalk, and that is all we need.
          We&apos;ll be in touch with the practical details as October gets closer.
        </p>
      }
      footerNotice={summitInfo.infoNotice}
    />
  );
}
