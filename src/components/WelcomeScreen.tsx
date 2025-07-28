import React, { useState } from 'react';
import { topics } from '../data/topics';
import { Topic } from '../types';

interface WelcomeScreenProps {
  onComplete: (selectedTopics: string[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else if (prev.length < 3) {
        return [...prev, topicId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedTopics.length === 3) {
      onComplete(selectedTopics);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            MicroLearn
          </h1>
          <p className="text-gray-600">
            Discover amazing facts tailored to your interests
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose 3 topics you're curious about:
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {topics.map((topic: Topic) => (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                disabled={!selectedTopics.includes(topic.id) && selectedTopics.length >= 3}
                className={`
                  flex items-center p-4 rounded-xl border-2 transition-all duration-200
                  ${selectedTopics.includes(topic.id)
                    ? `${topic.color} text-white border-transparent shadow-lg scale-105`
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }
                  ${!selectedTopics.includes(topic.id) && selectedTopics.length >= 3
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  }
                `}
              >
                <span className="text-2xl mr-3">{topic.icon}</span>
                <span className="font-medium">{topic.name}</span>
                {selectedTopics.includes(topic.id) && (
                  <span className="ml-auto text-xl">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            {selectedTopics.length}/3 topics selected
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedTopics.length !== 3}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
            ${selectedTopics.length === 3
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Start Learning!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;