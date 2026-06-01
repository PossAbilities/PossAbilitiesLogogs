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
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
});

describe('Media Management', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn((file) => `blob:${file.name}`);
  });

  it('adds existing remote image URLs to deletedMedia when removed', async () => {
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    // useData is imported from Provider, but we can just mock its return
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [{
        id: '1',
        title: 'Article with Image',
        content: 'Content',
        date: new Date().toISOString(),
        imageUrls: ['https://example.supabase.co/storage/v1/object/public/news-media/1/existing-image.jpg']
      }],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    const mockStorageFrom = vi.fn().mockReturnValue({
      remove: mockRemove,
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'new-url' } }),
    });

    (supabase.storage.from as ReturnType<typeof vi.fn>).mockImplementation(() => mockStorageFrom())

    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }) });
    supabase.from.mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    // Click edit on the article
    fireEvent.click(screen.getByText('Edit'));

    // Verify image is rendered
    const mediaImage = screen.getByAltText('Media preview');
    expect(mediaImage).toBeInTheDocument();

    // Click delete button
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    // Assert media is removed from UI
    expect(screen.queryByAltText('Media preview')).not.toBeInTheDocument();

    // Submit form to trigger storage removal
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async operations and verify remove was called
    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(['1/existing-image.jpg']);
    });
  });

  it('does NOT add local blob: image URLs to deletedMedia when removed', async () => {
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    const mockStorageFrom = vi.fn().mockReturnValue({
      remove: mockRemove,
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'new-url' } }),
    });

    (supabase.storage.from as ReturnType<typeof vi.fn>).mockImplementation(() => mockStorageFrom())

    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '2' }, error: null }) });
    supabase.from.mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    // Click create post
    fireEvent.click(screen.getByText('+ Create Post'));

    // Add media
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure it's rendered
    const mediaImage = await screen.findByAltText('Media preview');
    expect(mediaImage).toBeInTheDocument();

    // Click delete button
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    // Assert media is removed from UI
    expect(screen.queryByAltText('Media preview')).not.toBeInTheDocument();

    // Fill form to pass validation and submit
    fireEvent.change(screen.getByPlaceholderText('Enter article title'), { target: { value: 'Blob Test' } });
    fireEvent.change(screen.getByPlaceholderText('Write your article content here...'), { target: { value: 'Content' } });
    fireEvent.click(screen.getByText('Publish Changes'));

    // Wait for async save operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    // Verify remove was NOT called
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
