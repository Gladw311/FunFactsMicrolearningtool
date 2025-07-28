export interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Fact {
  id: string;
  topic: string;
  content: string;
  category: string;
}

export interface UserPreferences {
  selectedTopics: string[];
  readingStats: Record<string, number>;
  totalFactsRead: number;
  lastVisit: string;
}

export interface ReadingSession {
  factId: string;
  timeSpent: number;
  timestamp: string;
}