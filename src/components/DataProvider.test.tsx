import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DataProvider, useData } from './DataProvider';
import { supabase } from '@/utils/supabase';

// Mock supabase
vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const TestComponent = () => {
  const { news, fetchNews, events, fetchEvents } = useData();

  return (
    <div>
      <div data-testid="news-count">{news.length}</div>
      <div data-testid="events-count">{events.length}</div>
      <button onClick={() => fetchNews()} data-testid="fetch-news-btn">Fetch News</button>
      <button onClick={() => fetchEvents()} data-testid="fetch-events-btn">Fetch Events</button>
    </div>
  );
};

describe('DataProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockChain = (resolvedValue: any) => {
    const orderMock = vi.fn().mockResolvedValue(resolvedValue);
    const selectMock = vi.fn(() => ({ order: orderMock }));
    return { select: selectMock };
  };

  it('handles error in fetchNews gracefully', async () => {
    const mockError = new Error('News fetch failed');
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'news') {
        return createMockChain({ data: null, error: mockError }) as any;
      }
      return createMockChain({ data: [], error: null }) as any;
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    // Initial fetch
    await act(async () => {});

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Using mock news data (Supabase fetch failed):",
      mockError
    );

    consoleWarnSpy.mockClear();

    // Manual fetch
    await act(async () => {
      screen.getByTestId('fetch-news-btn').click();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Using mock news data (Supabase fetch failed):",
      mockError
    );
  });

  it('handles error in fetchEvents gracefully', async () => {
    const mockError = new Error('Events fetch failed');
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'events') {
        return createMockChain({ data: null, error: mockError }) as any;
      }
      return createMockChain({ data: [], error: null }) as any;
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    // Initial fetch
    await act(async () => {});

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Using mock events data (Supabase fetch failed):",
      mockError
    );

    consoleWarnSpy.mockClear();

    // Manual fetch
    await act(async () => {
      screen.getByTestId('fetch-events-btn').click();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Using mock events data (Supabase fetch failed):",
      mockError
    );
  });

  it('fetches data successfully', async () => {
    const mockNewsData = [
      { id: '1', title: 'News 1', content: 'Content 1', created_at: '2023-01-01', image_url: 'placeholder', image_urls: [] },
    ];
    const mockEventsData = [
      { id: '1', title: 'Event 1', description: 'Desc 1', location: 'Loc 1', event_date: '2023-01-02', image_url: 'url2' },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'news') {
        return createMockChain({ data: mockNewsData, error: null }) as any;
      }
      if (table === 'events') {
        return createMockChain({ data: mockEventsData, error: null }) as any;
      }
      return createMockChain({ data: [], error: null }) as any;
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await act(async () => {});

    expect(screen.getByTestId('news-count')).toHaveTextContent('1');
    expect(screen.getByTestId('events-count')).toHaveTextContent('1');
  });

  it('throws error when useData is used outside of DataProvider', () => {
    // Suppress console.error from React error boundary
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow("useData must be used within a DataProvider");

    consoleErrorSpy.mockRestore();
  });
});
