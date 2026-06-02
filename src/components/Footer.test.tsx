import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from './Footer';

// Mock next/link to render a simple anchor tag
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the footer navigation area', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo', { name: /footer navigation/i });
    expect(footerElement).toBeInTheDocument();
  });

  it('displays the correct copyright text with the current year', () => {
    // Set a fixed date to test the year rendering reliably
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    render(<Footer />);
    expect(screen.getByText(/© 2024 PossAbilities/i)).toBeInTheDocument();
  });

  it('renders the required navigation links with correct hrefs', () => {
    render(<Footer />);

    const whistleblowingLink = screen.getByRole('link', { name: /whistleblowing/i });
    expect(whistleblowingLink).toBeInTheDocument();
    expect(whistleblowingLink).toHaveAttribute('href', '/whistleblowing');

    const complimentsLink = screen.getByRole('link', { name: /compliments & complaints/i });
    expect(complimentsLink).toBeInTheDocument();
    expect(complimentsLink).toHaveAttribute('href', '/compliments-complaints');

    const termsLink = screen.getByRole('link', { name: /terms of use/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/terms-of-use');
  });
});
