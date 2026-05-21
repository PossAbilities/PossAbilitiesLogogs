import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DataProvider, useData } from './DataProvider';
import { supabase } from '@/utils/supabase';
import React from 'react';

// Mock Supabase
const mockOrder = vi.fn();
const mockSelect = vi.fn(() => ({ order: mockOrder }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: (table: string) => ({
      select: () => ({
        order: (col: string, opts: unknown) => mockOrder(table, col, opts)
      })
    })
  }
}));

const TestConsumer = () => {
  const { news, events, fetchNews, fetchEvents } = useData();
  return (
    <div>
      <div data-testid="news-count">{news.length}</div>
      <div data-testid="events-count">{events.length}</div>
      <div data-testid="news-title">{news[0]?.title}</div>
      <div data-testid="events-title">{events[0]?.title}</div>
      <button onClick={fetchNews} data-testid="fetch-news-btn">Fetch News</button>
      <button onClick={fetchEvents} data-testid="fetch-events-btn">Fetch Events</button>
    </div>
  );
};

const ErrorConsumer = () => {
  useData();
  return <div>Should not render</div>;
};

describe('DataProvider', () => {
  const originalWarn = console.warn;

  beforeEach(() => {
    console.warn = vi.fn();
    vi.clearAllMocks();

    // Default mock implementation
    mockOrder.mockImplementation((table) => {
      if (table === 'news') {
        return Promise.resolve({
          data: [{
            id: 1,
            title: 'Supabase News',
            content: 'Content',
            created_at: '2023-01-01',
            image_url: 'placeholder',
            image_urls: []
          }],
          error: null
        });
      }
      if (table === 'events') {
        return Promise.resolve({
          data: [{
            id: 1,
            title: 'Supabase Event',
            description: 'Desc',
            location: 'Loc',
            event_date: '2023-01-02',
            created_at: '2023-01-01',
            image_url: 'placeholder'
          }],
          error: null
        });
      }
      return Promise.resolve({ data: [], error: null });
    });
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  it('provides context to children and fetches data on mount', async () => {
    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    // Initial render might have mock data, but we wait for supabase mock data
    await waitFor(() => {
      expect(screen.getByTestId('news-title')).toHaveTextContent('Supabase News');
      expect(screen.getByTestId('events-title')).toHaveTextContent('Supabase Event');
    });
  });

  it('throws error when useData is used outside provider', () => {
    // We want to suppress the console.error from React
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ErrorConsumer />)).toThrow('useData must be used within a DataProvider');
    consoleError.mockRestore();
  });

  it('handles supabase fetch error gracefully', async () => {
    mockOrder.mockImplementation(() => Promise.resolve({
      data: null,
      error: new Error('Supabase error')
    }));

    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Using mock news data (Supabase fetch failed):'),
        expect.any(Error)
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Using mock events data (Supabase fetch failed):'),
        expect.any(Error)
      );
    });
  });

  it('manual fetch calls update context', async () => {
    // First let it mount with error so it stays on mock data
    mockOrder.mockImplementation(() => Promise.resolve({ data: null, error: new Error('err') }));

    render(
      <DataProvider>
        <TestConsumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalled();
    });

    // Now fix mock to return real data
    mockOrder.mockImplementation((table) => {
      if (table === 'news') {
        return Promise.resolve({
          data: [{
            id: 2,
            title: 'Manual Fetch News',
            content: 'Content',
            created_at: '2023-01-01'
          }],
          error: null
        });
      }
      if (table === 'events') {
        return Promise.resolve({
          data: [{
            id: 2,
            title: 'Manual Fetch Event',
            created_at: '2023-01-01'
          }],
          error: null
        });
      }
      return Promise.resolve({ data: [], error: null });
    });

    // Click buttons
    screen.getByTestId('fetch-news-btn').click();

    await waitFor(() => {
      expect(screen.getByTestId('news-title')).toHaveTextContent('Manual Fetch News');
    });

    screen.getByTestId('fetch-events-btn').click();

    await waitFor(() => {
      expect(screen.getByTestId('events-title')).toHaveTextContent('Manual Fetch Event');
    });
  });
});
