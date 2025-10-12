import React, { useState } from 'react';

const moods = [
  { emoji: '�', label: 'terrible' },
  { emoji: '�', label: 'bad' },
  { emoji: '😐', label: 'okay' },
  { emoji: '�', label: 'good' },
  { emoji: '�', label: 'great' },
];

export const MoodTracker: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const hasLoggedToday = false; // Placeholder for API logic

  const handleMoodSelect = (moodLabel: string) => {
    console.log(`Mood selected: ${moodLabel}`);
    // TODO: Call API to save the mood
    setSubmitted(true);
  };

  // The base container for our widget, styled to match the site's cards
  const cardClasses = "bg-[#0b132b] border border-slate-700 rounded-xl p-6 text-center shadow-lg";

  if (hasLoggedToday || submitted) {
    return (
      <div className={cardClasses}>
         <h3 className="text-xl font-semibold text-white mb-2">Thanks for checking in!</h3>
         <p className="text-slate-400">Your mood is logged for today.</p>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
        <h3 className="text-xl font-semibold text-white mb-4">How are you feeling today?</h3>
        <div className="flex justify-around items-center gap-2 mt-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.label)}
              // Styling for the emoji buttons to match the blue accent theme
              className="p-3 rounded-full text-3xl transition-all duration-200 hover:bg-cyan-500/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
    </div>
  );
};
