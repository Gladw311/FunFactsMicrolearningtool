import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import FactDisplay from './components/FactDisplay';
import { UserPreferences } from './types';
import { getStoredPreferences, saveUserPreferences } from './utils/storage';

function App() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stored preferences on app start
    const stored = getStoredPreferences();
    setPreferences(stored);
    setIsLoading(false);
  }, []);

  const handleTopicSelection = (selectedTopics: string[]) => {
    const newPreferences: UserPreferences = {
      selectedTopics,
      readingStats: {},
      totalFactsRead: 0,
      lastVisit: new Date().toISOString()
    };
    
    setPreferences(newPreferences);
    saveUserPreferences(newPreferences);
  };

  const handleRestart = () => {
    setPreferences(null);
    // Clear stored preferences
    localStorage.removeItem('microlearning_preferences');
    localStorage.removeItem('microlearning_sessions');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <div className="text-xl text-gray-600">Loading MicroLearn...</div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return <WelcomeScreen onComplete={handleTopicSelection} />;
  }

  return <FactDisplay preferences={preferences} onRestart={handleRestart} />;
}

export default App;