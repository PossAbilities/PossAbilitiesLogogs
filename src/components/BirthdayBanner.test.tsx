import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BirthdayBanner } from './BirthdayBanner';
import { useUser } from './UserProvider';

// Mock dependencies
vi.mock('./UserProvider', () => ({
  useUser: vi.fn(),
}));

// Framer motion mock to avoid issues with animations
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode; className?: string }) => <div data-testid="glass-card" className={className}>{children}</div>,
}));

describe('BirthdayBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing if user is not loaded', async () => {
    vi.mocked(useUser).mockReturnValue({ user: null } as never);

    await act(async () => {
      render(<BirthdayBanner />);
    });

    expect(screen.queryByText(/Happy Birthday/i)).not.toBeInTheDocument();
  });

  it('renders nothing if it is not the user\'s birthday', async () => {
    const today = new Date('2023-10-15T12:00:00Z');
    vi.setSystemTime(today);

    vi.mocked(useUser).mockReturnValue({
      user: { id: '1', name: 'John', dateOfBirth: '1990-05-20' }
    } as never);

    await act(async () => {
      render(<BirthdayBanner />);
    });

    expect(screen.queryByText(/Happy Birthday/i)).not.toBeInTheDocument();
  });

  it('renders the banner if it is the user\'s birthday', async () => {
    const today = new Date('2023-05-20T12:00:00Z');
    vi.setSystemTime(today);

    vi.mocked(useUser).mockReturnValue({
      user: { id: '1', name: 'John', dateOfBirth: '1990-05-20' }
    } as never);

    await act(async () => {
      render(<BirthdayBanner />);
    });

    expect(screen.getByText('🎉 Happy Birthday, John! 🎂')).toBeInTheDocument();
    expect(screen.getByText('We hope you have an amazing day!')).toBeInTheDocument();
  });

  it('dismisses the banner when close button is clicked', async () => {
    const today = new Date('2023-05-20T12:00:00Z');
    vi.setSystemTime(today);

    vi.mocked(useUser).mockReturnValue({
      user: { id: '1', name: 'John', dateOfBirth: '1990-05-20' }
    } as never);

    await act(async () => {
      render(<BirthdayBanner />);
    });

    expect(screen.getByText('🎉 Happy Birthday, John! 🎂')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Dismiss birthday banner');
    fireEvent.click(closeButton);

    expect(screen.queryByText('🎉 Happy Birthday, John! 🎂')).not.toBeInTheDocument();

    // Check localStorage
    const dateStr = today.toISOString().split('T')[0];
    expect(localStorage.getItem(`birthdayDismissed_1_${dateStr}`)).toBe('true');
  });

  it('does not render if already dismissed today', async () => {
    const todayStr = '2023-05-20';
    const today = new Date(`${todayStr}T12:00:00Z`);
    vi.setSystemTime(today);

    localStorage.setItem(`birthdayDismissed_1_${todayStr}`, 'true');

    vi.mocked(useUser).mockReturnValue({
      user: { id: '1', name: 'John', dateOfBirth: '1990-05-20' }
    } as never);

    await act(async () => {
      render(<BirthdayBanner />);
    });

    expect(screen.queryByText(/Happy Birthday/i)).not.toBeInTheDocument();
  });
});
