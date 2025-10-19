import { render, screen } from '@testing-library/react';
import LandingPage from './landing-page'; // Adjust path if your IDE/linter suggests a different alias resolution
import '@testing-library/jest-dom';

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<LandingPage />);

    // Check for the main heading text.
    // The heading text is "Homborsund AI: Ignite Your AI Journey"
    // We can use a flexible matcher to find it, even with the span inside.
    const heading = screen.getByRole('heading', {
      name: /Homborsund AI: Ignite Your AI Journey/i,
      level: 1 // Assuming it's an <h1>
    });

    expect(heading).toBeInTheDocument();
  });

  it('shows next summit with links to details and registration', () => {
    render(<LandingPage />);

    // Title and date from next summit metadata should be visible
    expect(screen.getByText(/Homborsund AI Summit/i)).toBeInTheDocument();
    expect(screen.getByText(/April 2026 \(weekend, date TBA\)/i)).toBeInTheDocument();

    // "Learn more" should link to the summit details page
    const detailsLink = screen.getByRole('link', { name: /Learn more/i });
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', '/summit/2026.1');

    // "Register" should link to the register page
    const signupLink = screen.getByRole('link', { name: /Register/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/summit/2026.1/register');
  });
});
