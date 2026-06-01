import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminEventsPage from './page';
import { useData } from '@/components/DataProvider';
import { supabase } from '@/utils/supabase';

// Mock dependencies
vi.mock('@/components/DataProvider', () => ({
  useData: vi.fn(),
}));

vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

describe('AdminEventsPage Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: vi.fn(),
      fetchEvents: vi.fn(),
    });

    const mockStorageFrom = vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-url' } }),
    });

    (supabase.storage.from as ReturnType<typeof vi.fn>) = mockStorageFrom;
  });

  it('saves event successfully and updates state', async () => {
    const setEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: vi.fn(),
    });

    // Mock Supabase upsert to succeed
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminEventsPage />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)'), { target: { value: 'Success Event' } });
    fireEvent.change(document.querySelector("input[name='date']")!, { target: { value: '2023-12-01' } });
    fireEvent.change(document.querySelector("input[name='time']")!, { target: { value: '14:00' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Success Location' } });

    // Submit form
    const form = screen.getByText('Publish Event to Portal').closest('form')!;
    form.reset = vi.fn();
    fireEvent.submit(form);

    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(setEventsMock).toHaveBeenCalled();
  });

  it('handles error when saving event fails and attempts fallback upsert', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase upsert to fail on first try, but succeed on fallback
    const mockUpsert = vi.fn()
      .mockResolvedValueOnce({ error: new Error('Supabase schema error') })
      .mockResolvedValueOnce({ error: null });

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminEventsPage />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)'), { target: { value: 'Fallback Event' } });
    fireEvent.change(document.querySelector("input[name='date']")!, { target: { value: '2023-12-02' } });
    fireEvent.change(document.querySelector("input[name='time']")!, { target: { value: '15:00' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Fallback Location' } });

    // Submit form
    const form = screen.getByText('Publish Event to Portal').closest('form')!;
    form.reset = vi.fn();
    fireEvent.submit(form);

    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledTimes(2);
    });

    expect(consoleErrorMock).toHaveBeenCalledWith('DB Error:', expect.any(Error));
  });

  it('handles exceptions in catch block', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase upsert to throw an exception
    const mockUpsert = vi.fn().mockRejectedValue(new Error('Network failure'));

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminEventsPage />);

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)'), { target: { value: 'Exception Event' } });
    fireEvent.change(document.querySelector("input[name='date']")!, { target: { value: '2023-12-03' } });
    fireEvent.change(document.querySelector("input[name='time']")!, { target: { value: '16:00' } });
    fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Exception Location' } });

    // Submit form
    const submitButton = screen.getByText('Publish Event to Portal');
    const form = submitButton.closest('form')!;
    form.reset = vi.fn();
    fireEvent.submit(form);

    // Wait for async operations
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Error saving event:', expect.any(Error));
    });

    // verify loading state is reset
    expect(submitButton).not.toBeDisabled();
  });
});
