import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, ...props }: any) => <div className={className} data-testid="motion-div" {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Navbar Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  it('renders correctly with logo and desktop navigation links', () => {
    render(<Navbar />);

    // Check for logo text/alt
    expect(screen.getByAltText('PossAbilities Logo')).toBeInTheDocument();

    // Check for desktop navigation links
    expect(screen.getAllByText('News').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Events').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Videos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Easy Reads').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Workshops').length).toBeGreaterThan(0);

    // Admin button
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  it('toggles mobile menu when menu button is clicked', async () => {
    render(<Navbar />);

    // The mobile menu dropdown content might be hidden or not in the DOM initially
    const menuButton = screen.getByLabelText('Toggle navigation menu');

    // Click to open
    fireEvent.click(menuButton);

    // Inside mobile menu, we have an "Admin Area" link
    expect(screen.getByText('Admin Area')).toBeInTheDocument();

    // Click a link inside should close it
    fireEvent.click(screen.getByText('Admin Area'));
    expect(screen.queryByText('Admin Area')).not.toBeInTheDocument();
  });

  describe('Voice Search Functionality', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockSpeechRecognition: any;

    beforeEach(() => {
      mockSpeechRecognition = {
        start: vi.fn(),
        stop: vi.fn(),
        abort: vi.fn(),
        onstart: null,
        onresult: null,
        onerror: null,
        onend: null,
      };

      // Create a mock constructor using function instead of vi.fn() to make it work with 'new'
      window.SpeechRecognition = function() {
        return mockSpeechRecognition;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    });

    it('initializes speech recognition and handles "news" command', async () => {
      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');

      // Click to start listening
      fireEvent.click(voiceButton);
      expect(mockSpeechRecognition.start).toHaveBeenCalled();

      // Simulate onstart
      act(() => {
        if (mockSpeechRecognition.onstart) mockSpeechRecognition.onstart();
      });

      // Should show listening feedback
      expect(screen.getByText(/Listening... Say a page name like/)).toBeInTheDocument();

      // Simulate voice result
      act(() => {
        if (mockSpeechRecognition.onresult) {
          mockSpeechRecognition.onresult({
            results: [[{ transcript: 'news' }]]
          });
        }
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/news');
      expect(screen.getByText('Navigating to News')).toBeInTheDocument();

      // Fast forward to clear feedback
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.queryByText('Navigating to News')).not.toBeInTheDocument();
    });

    it('handles various voice commands', () => {
      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');
      fireEvent.click(voiceButton);

      const testCommand = (transcript: string, expectedPath: string) => {
        act(() => {
          if (mockSpeechRecognition.onresult) {
            mockSpeechRecognition.onresult({
              results: [[{ transcript }]]
            });
          }
        });
        expect(mockRouter.push).toHaveBeenCalledWith(expectedPath);
        mockRouter.push.mockClear();
      };

      testCommand('go to events', '/events');
      testCommand('play video', '/videos');
      testCommand('easy read', '/easy-reads');
      testCommand('read', '/easy-reads');
      testCommand('workshop', '/workshops');
      testCommand('home', '/');
    });

    it('handles unknown commands with an error message', () => {
      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');
      fireEvent.click(voiceButton);

      act(() => {
        if (mockSpeechRecognition.onresult) {
          mockSpeechRecognition.onresult({
            results: [[{ transcript: 'random gibberish' }]]
          });
        }
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(screen.getByText(/I heard "random gibberish", but I didn't understand/)).toBeInTheDocument();
    });

    it('shows error if browser does not support SpeechRecognition', () => {
      delete window.SpeechRecognition;

      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');
      fireEvent.click(voiceButton);

      expect(screen.getByText('Voice search is not supported in your browser.')).toBeInTheDocument();
    });

    it('handles speech recognition errors', () => {
      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');
      fireEvent.click(voiceButton);

      act(() => {
        if (mockSpeechRecognition.onerror) {
          mockSpeechRecognition.onerror({ error: 'not-allowed' });
        }
      });

      expect(screen.getByText(/Error listening/)).toBeInTheDocument();
    });

    it('stops listening when button is clicked again', () => {
      render(<Navbar />);

      const voiceButton = screen.getByLabelText('Start voice search');

      // Start listening
      fireEvent.click(voiceButton);
      expect(mockSpeechRecognition.start).toHaveBeenCalled();

      act(() => {
        if (mockSpeechRecognition.onstart) mockSpeechRecognition.onstart();
      });

      // Click again to stop
      const stopButton = screen.getByLabelText('Stop listening');
      fireEvent.click(stopButton);
      expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    });
  });
});
