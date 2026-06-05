import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminNewsPage from './page';
import { useData } from '@/components/DataProvider';


// Mock dependencies
vi.mock('@/components/DataProvider', () => ({
  useData: vi.fn(),
}));




describe('AdminNewsPage Error Handling', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it('logs error when deleting image from storage returns an error object', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [{ id: '1', title: 'Test News', excerpt: 'abc', content: 'content', imageUrls: ['https://example.com/news-media/test.jpg'], createdAt: new Date().toISOString() }],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockRemove = vi.fn().mockResolvedValue({ error: new Error('Storage error') });
    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({ remove: mockRemove });

    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.getByText('Publish Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Delete'));

    fireEvent.click(screen.getByText('Publish Changes'));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(['test.jpg']);
      expect(consoleErrorMock).toHaveBeenCalledWith("Error deleting file from storage:", "Storage error");
    });
  });

  it('logs error when deleting image from storage throws an exception', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [{ id: '1', title: 'Test News', excerpt: 'abc', content: 'content', imageUrls: ['https://example.com/news-media/test.jpg'], createdAt: new Date().toISOString() }],
      setNews: setNewsMock,
      fetchNews: fetchNewsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockRemove = vi.fn().mockRejectedValue(new Error('Network error'));
    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({ remove: mockRemove });

    const mockUpsert = vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }) });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ upsert: mockUpsert });

    render(<AdminNewsPage />);

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.getByText('Publish Changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Delete'));

    fireEvent.click(screen.getByText('Publish Changes'));

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith(['test.jpg']);
      expect(consoleErrorMock).toHaveBeenCalledWith("Failed to delete image:", expect.any(Error));
    });
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

    // Mock fetch to succeed
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [{ id: '123' }] })
    } as unknown as Response);

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
      expect(mockFetch).toHaveBeenCalledWith('/api/news', expect.objectContaining({ method: 'POST' }));
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

    // Mock fetch to fail
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Supabase error' })
    } as unknown as Response);

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
      expect(mockFetch).toHaveBeenCalledWith('/api/news', expect.objectContaining({ method: 'POST' }));
    });

    expect(alertMock).toHaveBeenCalledWith('Something went wrong saving to Supabase! Falling back to local state.');
    expect(setNewsMock).toHaveBeenCalled();
  });

  it('handles error in deleteImageFromStorage gracefully', async () => {
    const setNewsMock = vi.fn();
    const fetchNewsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      news: [{ id: '1', title: 'Test Article', content: 'Test Content', date: new Date().toISOString(), imageUrls: ['news-media/test-image.jpg'] }],
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

    // Verify error is logged
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Failed to delete image:', expect.any(Error));
    });
  });
    // Wait for async operations
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(mockRemove).not.toHaveBeenCalled();
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
