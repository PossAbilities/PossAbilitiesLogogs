"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import {
  NewsItem,
  EventItem,
  VideoItem,
  EasyReadItem,
  WorkshopItem,
  User
} from "@/lib/data";
import mockDataRaw from "@/lib/mock-data.json";

// Type assertion for mock data
const mockData = {
  ...mockDataRaw,
  mockUsers: mockDataRaw.mockUsers.map(user => ({
    ...user,
    role: user.role as "user" | "admin",
    dateOfBirth: user.dateOfBirth === "CURRENT_DATE_PLACEHOLDER" ? new Date().toISOString() : user.dateOfBirth
  }))
};


interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  easyReads: EasyReadItem[];
  setEasyReads: React.Dispatch<React.SetStateAction<EasyReadItem[]>>;
  workshops: WorkshopItem[];
  setWorkshops: React.Dispatch<React.SetStateAction<WorkshopItem[]>>;
  fetchNews: () => Promise<void>;
  fetchEvents: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockData.mockUsers);
  const [news, setNews] = useState<NewsItem[]>(mockData.mockNews);
  const [events, setEvents] = useState<EventItem[]>(mockData.mockEvents);
  const [videos, setVideos] = useState<VideoItem[]>(mockData.mockVideos);
  const [easyReads, setEasyReads] = useState<EasyReadItem[]>(mockData.mockEasyReads);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(mockData.mockWorkshops);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData: NewsItem[] = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          content: item.content,
          date: item.created_at,
          imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,
          imageUrls: item.image_urls || [],
        }));
        setNews(mappedData);
      }
    } catch (error) {
      console.warn("Using mock news data (Supabase fetch failed):", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData: EventItem[] = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description || "",
          location: item.location || "TBD",
          date: item.event_date || item.created_at,
          imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,
        }));
        setEvents(mappedData);
      }
    } catch (error) {
      console.warn("Using mock events data (Supabase fetch failed):", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initFetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedData: NewsItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            content: item.content,
            date: item.created_at,
            imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,
            imageUrls: item.image_urls || [],
          }));
          setNews(mappedData);
        }
      } catch (error) {
        console.warn("Using mock news data (Supabase fetch failed):", error);
      }
    };

    const initFetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (error) throw error;

        if (mounted && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedData: EventItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            description: item.description || "",
            location: item.location || "TBD",
            date: item.event_date || item.created_at,
            imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,
          }));
          setEvents(mappedData);
        }
      } catch (error) {
        console.warn("Using mock events data (Supabase fetch failed):", error);
      }
    };

    initFetchNews();
    initFetchEvents();
    return () => { mounted = false; };
  }, []);

  return (
    <DataContext.Provider value={{
      users, setUsers,
      news, setNews,
      events, setEvents,
      videos, setVideos,
      easyReads, setEasyReads,
      workshops, setWorkshops,
      fetchNews, fetchEvents
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
