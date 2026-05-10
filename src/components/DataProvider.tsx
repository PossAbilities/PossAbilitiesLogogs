"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import {
  NewsItem,
  EventItem,
  VideoItem,
  EasyReadItem,
  WorkshopItem,
  User,
  mockNews,
  mockEvents,
  mockVideos,
  mockEasyReads,
  mockWorkshops,
  mockUsers
} from "@/lib/data";

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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [easyReads, setEasyReads] = useState<EasyReadItem[]>(mockEasyReads);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(mockWorkshops);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map Supabase columns back to our frontend model
        const mappedData: NewsItem[] = data.map((item: { id: number | string, title: string, content: string, created_at: string, image_url: string }) => ({
          id: item.id.toString(),
          title: item.title,
          content: item.content,
          date: item.created_at,
          imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,
        }));
        setNews(mappedData);
      }
    } catch (error) {
      console.warn("Using mock news data (Supabase fetch failed):", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    const initFetch = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted && data && data.length > 0) {
          const mappedData: NewsItem[] = data.map((item: { id: number | string, title: string, content: string, created_at: string, image_url: string, image_urls?: string[] }) => ({
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
    initFetch();
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
      fetchNews
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
