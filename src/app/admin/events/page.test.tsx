import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminEventsPage from './page';
import { useData } from '@/components/DataProvider';
import { supabase } from '@/utils/supabase';
import { act } from 'react';

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

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/test-image');

describe('AdminEventsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvents = [
    {
      id: '1',
      title: 'Existing Event',
      description: 'Event Description',
      location: 'Event Location',
      date: '2023-11-01T12:00:00Z',
      imageUrl: 'http://example.com/image.jpg'
    },
    {
      id: '2',
      title: 'Another Event',
      description: 'Another Description',
      location: 'Another Location',
      date: '2023-11-02T12:00:00Z',
      // no image url
    }
  ];

  it('renders correctly and lists existing events', () => {
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: mockEvents,
      setEvents: vi.fn(),
      fetchEvents: vi.fn(),
    });

    render(<AdminEventsPage />);

    expect(screen.getByText('Existing Event')).toBeInTheDocument();
    expect(screen.getByText('Another Event')).toBeInTheDocument();
  });

  it('handles error when saving event fails in try/catch', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase to throw an exception to trigger the catch block
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: vi.fn().mockRejectedValue(new Error('Network error'))
    });

    render(<AdminEventsPage />);

    const titleInput = screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)');
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText('Location');

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(dateInput, { target: { value: '2023-12-01' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });

    const form = document.querySelector('form')!;
    form.reset = vi.fn();

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'currentTarget', { value: form, enumerable: true });
      fireEvent(form, event);
    });

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Error saving event:', expect.any(Error));
    });

    consoleErrorMock.mockRestore();
  });

  it('saves an event successfully without image', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: mockUpsert
    });

    render(<AdminEventsPage />);

    const titleInput = screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)');
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText('Location');

    fireEvent.change(titleInput, { target: { value: 'Success Event' } });
    fireEvent.change(dateInput, { target: { value: '2024-05-05' } });
    fireEvent.change(timeInput, { target: { value: '14:30' } });
    fireEvent.change(locationInput, { target: { value: 'Success Location' } });

    const form = document.querySelector('form')!;
    form.reset = vi.fn();

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'currentTarget', { value: form, enumerable: true });
      fireEvent(form, event);
    });

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });

    // Check optimistic update
    expect(setEventsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Success Event',
          location: 'Success Location',
          date: expect.stringContaining('2024-05-05T14:30:00')
        })
      ])
    );
  });

  it('handles error when saving event fails in supabase upsert', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock first upsert to return error, second to return null
    const mockUpsert = vi.fn()
      .mockResolvedValueOnce({ error: { message: 'db error' } })
      .mockResolvedValueOnce({ error: null });

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: mockUpsert
    });

    render(<AdminEventsPage />);

    const titleInput = screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)');
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText('Location');

    fireEvent.change(titleInput, { target: { value: 'Fallback Event' } });
    fireEvent.change(dateInput, { target: { value: '2024-06-06' } });
    fireEvent.change(locationInput, { target: { value: 'Fallback Location' } });

    const form = document.querySelector('form')!;
    form.reset = vi.fn();

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'currentTarget', { value: form, enumerable: true });
      fireEvent(form, event);
    });

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledTimes(2);
      expect(consoleErrorMock).toHaveBeenCalledWith('DB Error:', { message: 'db error' });
    });

    consoleErrorMock.mockRestore();
  });

  it('saves an event successfully with an image upload', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: mockUpsert
    });

    const mockUpload = vi.fn().mockResolvedValue({ error: null });
    const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'http://example.com/uploaded.jpg' } });

    (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    });

    const { container } = render(<AdminEventsPage />);

    const titleInput = screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)');
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText('Location');

    fireEvent.change(titleInput, { target: { value: 'Image Event' } });
    fireEvent.change(dateInput, { target: { value: '2024-05-05' } });
    fireEvent.change(locationInput, { target: { value: 'Image Location' } });

    // Add media
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    fireEvent.change(fileInput);

    const form = document.querySelector('form')!;
    form.reset = vi.fn();

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'currentTarget', { value: form, enumerable: true });
      fireEvent(form, event);
    });

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled();
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(setEventsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Image Event',
          imageUrl: 'http://example.com/uploaded.jpg'
        })
      ])
    );
  });

  it('handles fallback image upload if main bucket fails', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: [],
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      upsert: mockUpsert
    });

    // Mock upload first call fails, second call succeeds
    const mockUpload = vi.fn()
      .mockResolvedValueOnce({ error: { message: 'Bucket not found' } })
      .mockResolvedValueOnce({ error: null });

    const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: 'http://example.com/fallback.jpg' } });

    (supabase.storage.from as ReturnType<typeof vi.fn>).mockImplementation((bucket) => {
      return {
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl
      }
    });

    const { container } = render(<AdminEventsPage />);

    const titleInput = screen.getByPlaceholderText('Event Title (e.g., Summer BBQ)');
    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
    const locationInput = screen.getByPlaceholderText('Location');

    fireEvent.change(titleInput, { target: { value: 'Fallback Image Event' } });
    fireEvent.change(dateInput, { target: { value: '2024-05-05' } });
    fireEvent.change(locationInput, { target: { value: 'Fallback Image Location' } });

    // Add media
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    fireEvent.change(fileInput);

    const form = document.querySelector('form')!;
    form.reset = vi.fn();

    await act(async () => {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'currentTarget', { value: form, enumerable: true });
      fireEvent(form, event);
    });

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledTimes(2);
      expect(mockUpsert).toHaveBeenCalled();
    });

    expect(setEventsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Fallback Image Event',
          imageUrl: 'http://example.com/fallback.jpg'
        })
      ])
    );
  });

  it('deletes an event successfully', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: mockEvents,
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null })
    });

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      delete: mockDelete
    });

    render(<AdminEventsPage />);

    const deleteButtons = screen.getAllByLabelText('Delete event');

    await act(async () => {
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });

    expect(setEventsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: '2' })
      ])
    );
  });

  it('handles error when deleting an event fails', async () => {
    const setEventsMock = vi.fn();
    const fetchEventsMock = vi.fn();
    (useData as ReturnType<typeof vi.fn>).mockReturnValue({
      events: mockEvents,
      setEvents: setEventsMock,
      fetchEvents: fetchEventsMock,
    });

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: new Error('Delete failed') })
    });

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      delete: mockDelete
    });

    render(<AdminEventsPage />);

    const deleteButtons = screen.getAllByLabelText('Delete event');
    await act(async () => {
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });

    expect(consoleErrorMock).toHaveBeenCalledWith('Error deleting:', 'Delete failed');
    expect(alertMock).toHaveBeenCalledWith('Failed to delete from database.');
    expect(fetchEventsMock).toHaveBeenCalled();

    consoleErrorMock.mockRestore();
    alertMock.mockRestore();
  });
});
