interface MoodLog {
  date: string; // "YYYY-MM-DD"
  mood: string; // "great", "good", etc.
}

export const getMoods = async (): Promise<Record<string, string>> => {
  console.log('Fetching moods...');
  return Promise.resolve({
    '2025-10-01': 'great',
    '2025-10-05': 'good',
    '2025-10-09': 'bad',
  });
};

export const saveMood = async (moodLog: MoodLog): Promise<void> => {
  console.log('Saving mood:', moodLog);
  return Promise.resolve();
};
