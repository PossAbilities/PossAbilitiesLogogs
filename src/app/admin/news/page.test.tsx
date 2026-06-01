import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminNewsPage from './page';
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

describe('AdminNewsPage Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it('saves news successfully and updates data from Supabase', async () => {
    // Setup mocks
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock Supabase upsert to succeed
    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '123' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    // Click create
    fireEvent.click(screen.getByText('+ Create Post'));

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Enter article title'), { target: { value: 'Success Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write your article content here...'), { target: { value: 'Success Content' } });

    // Submit form
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(alertMock).toHaveBeenCalledWith('News Published Successfully! ✨');
    expect(fetchNewsMock).toHaveBeenCalled();
  });

  it('handles error when saving news to Supabase fails and falls back to local state', async () => {
    // Setup mocks
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase upsert to fail
    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ error: new Error('Supabase error') }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    // Click create
    fireEvent.click(screen.getByText('+ Create Post'));

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Enter article title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write your article content here...'), { target: { value: 'Test Content' } });

    // Submit form
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async operations
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Error saving:', 'Supabase error');
    });

    expect(alertMock).toHaveBeenCalledWith('Something went wrong saving to Supabase! Falling back to local state.');
    expect(setNewsMock).toHaveBeenCalled();
  });

  it('handles error in deleteImageFromStorage gracefully', async () => {
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [{ id: '1', title: 'Test Article', content: 'Test Content', date: new Date().toISOString(), imageUrls: ['news-media/test-image.jpg'] }],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase upsert to succeed
    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    // Mock storage to throw error
    const removeMock = vi.fn().mockRejectedValue(new Error('Storage delete failed'));
    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({ remove: removeMock });

    render(<AdminNewsPage />);

    // Click Edit on the article
    fireEvent.click(screen.getByText('Edit'));

    // Wait for form to appear and click delete on the image
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    // Submit form
    fireEvent.click(screen.getByText('Publish Changes'));

    // Verify error is logged
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Failed to delete image:', expect.any(Error));
    });
  });
});
