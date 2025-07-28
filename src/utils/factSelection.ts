import { facts } from '../data/facts';
import { Fact, UserPreferences } from '../types';

export const getRandomFact = (
  preferences: UserPreferences,
  excludeIds: string[] = []
): Fact | null => {
  // Filter facts based on user's selected topics
  const availableFacts = facts.filter(fact => 
    preferences.selectedTopics.includes(fact.topic) && 
    !excludeIds.includes(fact.id)
  );

  if (availableFacts.length === 0) {
    return null;
  }

  // Get reading stats for weighted selection
  const { readingStats } = preferences;
  
  // Create weighted array based on reading time per topic
  const weightedFacts: Fact[] = [];
  
  availableFacts.forEach(fact => {
    const topicTime = readingStats[fact.topic] || 0;
    // Base weight of 1, plus bonus based on reading time
    // More time spent = higher chance of seeing more facts from that topic
    const weight = Math.max(1, Math.floor(topicTime / 5000) + 1); // 5 seconds = 1 extra weight
    
    for (let i = 0; i < weight; i++) {
      weightedFacts.push(fact);
    }
  });

  // Select random fact from weighted array
  const randomIndex = Math.floor(Math.random() * weightedFacts.length);
  return weightedFacts[randomIndex] || availableFacts[0];
};

export const getTopicStats = (preferences: UserPreferences) => {
  const stats = preferences.selectedTopics.map(topic => ({
    topic,
    timeSpent: preferences.readingStats[topic] || 0,
    percentage: 0
  }));

  const totalTime = stats.reduce((sum, stat) => sum + stat.timeSpent, 0);
  
  if (totalTime > 0) {
    stats.forEach(stat => {
      stat.percentage = Math.round((stat.timeSpent / totalTime) * 100);
    });
  }

  return stats.sort((a, b) => b.timeSpent - a.timeSpent);
};