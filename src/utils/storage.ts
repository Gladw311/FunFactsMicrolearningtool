import { UserPreferences, ReadingSession } from '../types';

const STORAGE_KEYS = {
  USER_PREFERENCES: 'microlearning_preferences',
  READING_SESSIONS: 'microlearning_sessions'
};

export const getStoredPreferences = (): UserPreferences | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const getReadingSessions = (): ReadingSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.READING_SESSIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveReadingSession = (session: ReadingSession): void => {
  try {
    const sessions = getReadingSessions();
    sessions.push(session);
    // Keep only last 100 sessions to prevent storage bloat
    const recentSessions = sessions.slice(-100);
    localStorage.setItem(STORAGE_KEYS.READING_SESSIONS, JSON.stringify(recentSessions));
  } catch (error) {
    console.error('Failed to save reading session:', error);
  }
};

export const updateReadingStats = (topic: string, timeSpent: number): void => {
  const preferences = getStoredPreferences();
  if (preferences) {
    preferences.readingStats[topic] = (preferences.readingStats[topic] || 0) + timeSpent;
    preferences.totalFactsRead += 1;
    preferences.lastVisit = new Date().toISOString();
    saveUserPreferences(preferences);
  }
};