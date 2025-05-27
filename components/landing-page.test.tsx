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

  it('renders the "Explore the Summit" button', () => {
    render(<LandingPage />);

    // Check for the main call to action button that links to the summit page
    const summitButton = screen.getByRole('link', {
      name: /Explore the Summit/i
    });
    expect(summitButton).toBeInTheDocument();
    expect(summitButton).toHaveAttribute('href', '/summit');
  });
});
