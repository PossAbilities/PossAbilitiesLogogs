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
  HeroSettings
} from "@/lib/data";
import mockDataRaw from "@/lib/mock-data.json";


interface SupabaseNewsRow {
  id: string | number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  image_urls?: string[];
}

interface SupabaseEventRow {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  event_date?: string;
  created_at: string;
  image_url?: string;
}

interface SupabasePdfRow {
  id: string | number;
  title?: string;
  description?: string;
  content?: string;
  cover_path?: string;
  file_path?: string;
}

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
  heroSettings: HeroSettings;
  setHeroSettings: React.Dispatch<React.SetStateAction<HeroSettings>>;
  fetchHeroSettings: () => Promise<void>;
  updateHeroSettings: (newSettings: HeroSettings) => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchEvents: () => Promise<void>;
  fetchEasyReads: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockData.mockUsers);
  const [news, setNews] = useState<NewsItem[]>(mockData.mockNews);
  const [events, setEvents] = useState<EventItem[]>(mockData.mockEvents);
  const [videos, setVideos] = useState<VideoItem[]>(mockData.mockVideos);
  const [easyReads, setEasyReads] = useState<EasyReadItem[]>(mockData.mockEasyReads);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(mockData.mockWorkshops);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({ id: '00000000-0000-0000-0000-000000000001', showHero: false });


  const fetchHeroSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .single();

      if (error) {
        console.warn("Using default hero settings (Supabase fetch failed):", error.message);
        return;
      }

      if (data) {
        setHeroSettings({
          id: data.id,
          showHero: data.show_hero,
          imageUrl: data.image_url,
          linkUrl: data.link_url
        });
      }
    } catch (error) {
      console.warn("Using default hero settings (fetch threw error):", error);
    }
  };

  const updateHeroSettings = async (newSettings: HeroSettings) => {
    try {
      const { error } = await supabase
        .from('hero_settings')
        .upsert({
          id: newSettings.id,
          show_hero: newSettings.showHero,
          image_url: newSettings.imageUrl,
          link_url: newSettings.linkUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setHeroSettings(newSettings);
    } catch (error) {
      console.error("Error updating hero settings:", error);
      throw error;
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedData: NewsItem[] = data.map((item: SupabaseNewsRow) => ({
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
        const mappedData: EventItem[] = data.map((item: SupabaseEventRow) => ({
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

  const fetchEasyReads = async () => {
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedData: EasyReadItem[] = data.map((item: SupabasePdfRow) => {
          let coverUrl = undefined;
          let fileUrl = undefined;

          if (item.cover_path) {
            coverUrl = supabase.storage.from('covers').getPublicUrl(item.cover_path).data.publicUrl;
          }

          if (item.file_path) {
            fileUrl = supabase.storage.from('pdfs').getPublicUrl(item.file_path).data.publicUrl;
          }

          return {
            id: item.id.toString(),
            title: item.title || "Untitled Document",
            content: item.description || item.content || "Easy Read Document",
            coverUrl,
            fileUrl,
          };
        });
        setEasyReads(mappedData);
      }
    } catch (error) {
      console.warn("Using mock easy reads data (Supabase fetch failed):", error);
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
          const mappedData: NewsItem[] = data.map((item: SupabaseNewsRow) => ({
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
          const mappedData: EventItem[] = data.map((item: SupabaseEventRow) => ({
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

    const initFetchEasyReads = async () => {
      try {
        const { data, error } = await supabase
          .from('pdfs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted && data && data.length > 0) {
          const mappedData: EasyReadItem[] = data.map((item: SupabasePdfRow) => {
            let coverUrl = undefined;
            let fileUrl = undefined;

            if (item.cover_path) {
              coverUrl = supabase.storage.from('covers').getPublicUrl(item.cover_path).data.publicUrl;
            }

            if (item.file_path) {
              fileUrl = supabase.storage.from('pdfs').getPublicUrl(item.file_path).data.publicUrl;
            }

            return {
              id: item.id.toString(),
              title: item.title || "Untitled Document",
              content: item.description || item.content || "Easy Read Document",
              coverUrl,
              fileUrl,
            };
          });
          setEasyReads(mappedData);
        }
      } catch (error) {
        console.warn("Using mock easy reads data (Supabase fetch failed):", error);
      }
    };


    initFetchNews();
    initFetchEvents();
    initFetchEasyReads();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHeroSettings();
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
      fetchNews, fetchEvents, fetchEasyReads,
      heroSettings, setHeroSettings,
      fetchHeroSettings, updateHeroSettings
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
