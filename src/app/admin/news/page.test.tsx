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

  it('removes existing media and marks for deletion (non-blob URL)', async () => {
    // Setup mocks
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [
        {
          id: 'article-1',
          title: 'Test Article',
          content: 'Test Content',
          date: new Date().toISOString(),
          imageUrls: ['https://example.com/news-media/image.jpg']
        }
      ],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock Supabase upsert to succeed
    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: 'article-1' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    // Mock storage remove
    const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
      remove: mockRemove,
      upload: vi.fn(),
      getPublicUrl: vi.fn()
    });

    render(<AdminNewsPage />);

    // Click edit
    fireEvent.click(screen.getByText('Edit'));

    // Ensure image preview is visible
    expect(screen.getByAltText('Media preview')).toBeInTheDocument();

    // Click remove media
    fireEvent.click(screen.getByTitle('Delete'));

    // Ensure image preview is removed
    expect(screen.queryByAltText('Media preview')).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(mockRemove).toHaveBeenCalledWith(['image.jpg']);
  });

  it('removes newly added media without marking for deletion (blob URL)', async () => {
    // Setup mocks
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/1234');

    // Mock Supabase upsert to succeed
    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: 'new-article' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    // Mock storage remove
    const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null });
    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
      remove: mockRemove,
      upload: vi.fn(),
      getPublicUrl: vi.fn()
    });

    const { container } = render(<AdminNewsPage />);

    // Click create
    fireEvent.click(screen.getByText('+ Create Post'));

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Enter article title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Write your article content here...'), { target: { value: 'Test Content' } });

    // Add media
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });
    }

    // Ensure image preview is visible
    expect(screen.getByAltText('Media preview')).toBeInTheDocument();

    // Click remove media
    fireEvent.click(screen.getByTitle('Delete'));

    // Ensure image preview is removed
    expect(screen.queryByAltText('Media preview')).not.toBeInTheDocument();

    // Submit form
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });

});
