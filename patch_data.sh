#!/bin/bash
cat << 'INNER_EOF' > src/lib/data.ts
export type User = {
  id: string;
  name: string;
  role: "user" | "admin";
  dateOfBirth: string;
};

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  imageUrls?: string[];
};

export type EventItem = {
  imageUrl?: string;
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
};

export type EasyReadItem = {
  id: string;
  title: string;
  content: string;
  icon?: string;
  coverUrl?: string;
  fileUrl?: string;
};

export type WorkshopItem = {
  id: string;
  title: string;
  description: string;
  materialsUrl?: string;
};

export type HeroSettings = {
  id?: string;
  showHero: boolean;
  imageUrl?: string;
  linkUrl?: string;
};
INNER_EOF
