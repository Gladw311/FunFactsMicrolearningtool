import React, { useState, useEffect, useRef } from 'react';
import { Fact, UserPreferences } from '../types';
import { getRandomFact, getTopicStats } from '../utils/factSelection';
import { updateReadingStats, saveReadingSession } from '../utils/storage';
import { topics } from '../data/topics';
import { RotateCcw, TrendingUp, Clock } from 'lucide-react';

interface FactDisplayProps {
  preferences: UserPreferences;
  onRestart: () => void;
}

const FactDisplay: React.FC<FactDisplayProps> = ({ preferences, onRestart }) => {
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [shownFactIds, setShownFactIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showStats, setShowStats] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadNextFact = () => {
    // Record time spent on current fact
    if (currentFact) {
      const timeSpent = Date.now() - startTime;
      updateReadingStats(currentFact.topic, timeSpent);
      
      saveReadingSession({
        factId: currentFact.id,
        timeSpent,
        timestamp: new Date().toISOString()
      });
    }

    // Get next fact
    const nextFact = getRandomFact(preferences, shownFactIds);
    
    if (nextFact) {
      setCurrentFact(nextFact);
      setShownFactIds(prev => [...prev, nextFact.id]);
      setStartTime(Date.now());
    } else {
      // Reset if no more facts available
      setShownFactIds([]);
      const resetFact = getRandomFact(preferences);
      if (resetFact) {
        setCurrentFact(resetFact);
        setShownFactIds([resetFact.id]);
        setStartTime(Date.now());
      }
    }
  };

  useEffect(() => {
    // Load initial fact
    if (!currentFact) {
      loadNextFact();
    }

    // Set up interval to track reading time
    intervalRef.current = setInterval(() => {
      if (currentFact) {
        const timeSpent = Date.now() - startTime;
        // Update stats every 2 seconds while reading
        if (timeSpent > 2000 && timeSpent % 2000 < 100) {
          updateReadingStats(currentFact.topic, 100);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentFact, startTime, preferences]);

  const getCurrentTopicInfo = () => {
    if (!currentFact) return null;
    return topics.find(topic => topic.id === currentFact.topic);
  };

  const topicInfo = getCurrentTopicInfo();
  const stats = getTopicStats(preferences);

  if (!currentFact || !topicInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <p className="text-gray-600">Loading your next fact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🧠</div>
            <span className="text-xl font-bold text-gray-800">MicroLearn</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onRestart}
              className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Your Learning Stats
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{preferences.totalFactsRead}</div>
                <div className="text-sm text-blue-800">Facts Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{preferences.selectedTopics.length}</div>
                <div className="text-sm text-green-800">Topics</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(Object.values(preferences.readingStats).reduce((a, b) => a + b, 0) / 1000)}s
                </div>
                <div className="text-sm text-purple-800">Reading Time</div>
              </div>
            </div>

            <div className="space-y-2">
              {stats.map(stat => {
                const topic = topics.find(t => t.id === stat.topic);
                return (
                  <div key={stat.topic} className="flex items-center">
                    <span className="text-lg mr-2">{topic?.icon}</span>
                    <span className="font-medium text-gray-700 flex-1">{topic?.name}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${topic?.color || 'bg-gray-400'}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{stat.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fact Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Topic Header */}
          <div className={`${topicInfo.color} p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{topicInfo.icon}</span>
                <span className="font-semibold text-lg">{topicInfo.name}</span>
              </div>
              <div className="flex items-center text-sm opacity-90">
                <Clock className="w-4 h-4 mr-1" />
                <span>Fact #{preferences.totalFactsRead + 1}</span>
              </div>
            </div>
          </div>

          {/* Fact Content */}
          <div className="p-8">
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              {currentFact.content}
            </p>

            <button
              onClick={loadNextFact}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Next Fact →
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center text-sm text-gray-500">
          You've explored {shownFactIds.length} facts in this session
        </div>
      </div>
    </div>
  );
};

export default FactDisplay;