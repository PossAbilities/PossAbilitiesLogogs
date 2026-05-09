"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [easyReads, setEasyReads] = useState<EasyReadItem[]>(mockEasyReads);
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(mockWorkshops);

  return (
    <DataContext.Provider value={{
      users, setUsers,
      news, setNews,
      events, setEvents,
      videos, setVideos,
      easyReads, setEasyReads,
      workshops, setWorkshops
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
