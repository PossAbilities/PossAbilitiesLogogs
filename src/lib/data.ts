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
};

export type WorkshopItem = {
  id: string;
  title: string;
  description: string;
  materialsUrl?: string;
};

export const mockUsers: User[] = [
  { id: "1", name: "Alex", role: "user", dateOfBirth: new Date().toISOString() }, // Today
  { id: "2", name: "Admin Sam", role: "admin", dateOfBirth: "1990-01-01T00:00:00Z" },
];

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Welcome to the PossAbilities Portal!",
    content: "We are so excited to launch our new portal. You can find news, events, and easy reads here.",
    date: "2024-05-01T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Summer Party Coming Soon",
    content: "Get ready for our big summer party next month! There will be music, food, and dancing.",
    date: "2024-05-05T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
  }
];

export const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Art Workshop",
    description: "Join us for a fun afternoon of painting and drawing.",
    date: "2024-05-15T14:00:00Z",
    location: "Main Hall",
  },
  {
    id: "2",
    title: "Cooking Class",
    description: "Learn how to make healthy and tasty pizzas.",
    date: "2024-05-20T10:30:00Z",
    location: "Kitchen",
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: "1",
    title: "How to use the new portal",
    url: "https://example.com/video1",
  },
  {
    id: "2",
    title: "Last month's dance party",
    url: "https://example.com/video2",
  }
];

export const mockEasyReads: EasyReadItem[] = [
  {
    id: "1",
    title: "How to stay safe online",
    content: "Always keep your passwords secret. Do not share personal info with strangers.",
  },
  {
    id: "2",
    title: "Healthy Eating",
    content: "Eat lots of fruits and vegetables. Drink lots of water every day.",
  }
];

export const mockWorkshops: WorkshopItem[] = [
  {
    id: "1",
    title: "Money Management",
    description: "Learn how to budget your money and save for things you want.",
  },
  {
    id: "2",
    title: "Travel Training",
    description: "Learn how to use the bus and train safely.",
  }
];
