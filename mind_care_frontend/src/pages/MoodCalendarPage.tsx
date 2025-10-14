import React, { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // We will override this with Tailwind
import { getMoods, saveMood } from '@/lib/moodsApi';

// moodData will be loaded from API (or localStorage) into state

// Define styles for each mood type. These colors are examples.
const moodStyles: Record<string, React.CSSProperties> = {
  great: { backgroundColor: '#2a9d8f', color: 'white' },
  good: { backgroundColor: '#8ab17d' },
  okay: { backgroundColor: '#e9c46a' },
  bad: { backgroundColor: '#f4a261' },
  terrible: { backgroundColor: '#e76f51', color: 'white' },
};

const MoodCalendarPage: React.FC = () => {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [moodDataState, setMoodDataState] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // map mood labels to emojis and scores for a tiny analysis
  const moodMap = useMemo(() => ({
    great: { emoji: '🤩', score: 5 },
    good: { emoji: '😊', score: 4 },
    okay: { emoji: '😐', score: 3 },
    bad: { emoji: '😔', score: 2 },
    terrible: { emoji: '😞', score: 1 },
  } as Record<string, { emoji: string; score: number }>), []);

  // helper to format a Date into YYYY-MM-DD (local date) to match moodData keys
  const formatISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Load moods from API on mount
  useEffect(() => {
    let mounted = true;
    getMoods().then((result) => {
      if (!mounted) return;
      // result may be an object or an array; normalize to record
      const map: Record<string, string> = {};
      if (!result) {
        setMoodDataState(map);
        return;
      }
      if (Array.isArray(result)) {
        (result as Array<{ date: string; mood: string }>).forEach((m) => {
          map[m.date] = m.mood;
        });
      } else {
        Object.assign(map, result as Record<string, string>);
      }
      setMoodDataState(map);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Group dates by mood key so DayPicker can style them
  const moodDates = useMemo(() => {
    const acc: Record<string, Date[]> = {};
    Object.entries(moodDataState).forEach(([iso, mood]) => {
      const key = mood || 'okay';
      acc[key] = acc[key] || [];
      acc[key].push(new Date(iso));
    });
    return acc;
  }, [moodDataState]);

  // quick analytics: total entries and average score over all entries
  const analytics = useMemo(() => {
    const entries = Object.values(moodDataState);
    const total = entries.length;
    const sum = entries.reduce((s, m) => s + (moodMap[m]?.score || 3), 0);
    const avg = total ? +(sum / total).toFixed(1) : 0;
    return { total, avg };
  }, [moodDataState, moodMap]);

  const handleSelect = (day?: Date) => {
    setSelected(day);
  };

  const selectedMoodLabel = selected ? moodDataState[formatISODate(selected)] : undefined;
  const selectedMood = selectedMoodLabel ? moodMap[selectedMoodLabel] : undefined;

  // allow saving/updating a mood for the selected date
  const [pendingMood, setPendingMood] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selected) {
      setPendingMood(selectedMoodLabel);
    } else {
      setPendingMood(undefined);
    }
  }, [selected, selectedMoodLabel]);

  const handleSaveMood = async () => {
    if (!selected || !pendingMood) return;
    const iso = formatISODate(selected);
    setIsSaving(true);
    try {
      await saveMood({ date: iso, mood: pendingMood });
      // update local state so calendar reflects change immediately
      setMoodDataState((s) => ({ ...s, [iso]: pendingMood }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Your Mood History</h1>

      <DayPicker
        className="bg-[#0b132b] p-4 rounded-lg border border-slate-700 text-slate-200"
        classNames={{
          caption: 'flex justify-center items-center h-10 text-white',
          head_cell: 'w-10 h-10 font-semibold text-slate-400',
          cell: 'w-10 h-10',
          day: 'w-10 h-10 rounded-full transition-colors hover:bg-slate-700',
          day_selected: 'bg-cyan-500 text-white font-bold',
          day_today: 'font-bold text-cyan-400',
          day_outside: 'text-slate-600',
        }}
        mode="single"
        selected={selected}
        onSelect={handleSelect}
  modifiers={{ ...moodDates }}
        modifiersStyles={Object.keys(moodDates).reduce((acc: Record<string, React.CSSProperties>, key) => {
          // choose a color from moodStyles if available otherwise fallback
          const style = moodStyles[key as keyof typeof moodStyles] || { backgroundColor: '#334155' };
          acc[key] = { ...(style as React.CSSProperties) };
          return acc;
        }, {} as Record<string, React.CSSProperties>)}
      />

      {/* Selected date details + quick mood analysis */}
      <div className="w-full max-w-3xl mt-6 bg-gradient-to-br from-[#071028]/60 to-[#0b132b]/40 p-6 rounded-lg border border-slate-700">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedMood ? selectedMood.emoji : '—'}</div>
              <div>
                <div className="text-lg font-semibold">{selected.toDateString()}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedMoodLabel ? (
                    <>
                      <span className="capitalize mr-2">{selectedMoodLabel}</span>
                      — Quick insight: {selectedMood ? (selectedMood.score >= 4 ? 'Positive' : selectedMood.score === 3 ? 'Neutral' : 'Needs attention') : '—'}
                    </>
                  ) : (
                    'No mood logged for this date.'
                  )}
                </div>
              </div>
            </div>

            {/* Quick log/update controls */}
            <div className="flex items-center space-x-3">
              <label className="text-sm text-muted-foreground">Log / update mood:</label>
              <select
                value={pendingMood || ''}
                onChange={(e) => setPendingMood(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              >
                <option value="">-- select mood --</option>
                {Object.keys(moodMap).map((k) => (
                  <option key={k} value={k} className="capitalize">
                    {k}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveMood}
                disabled={isSaving || !pendingMood}
                className="ml-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded"
              >
                {isSaving ? 'Saving...' : selectedMoodLabel ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Click a date to view mood details and quick analysis</div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total Entries</div>
            <div className="font-semibold text-lg">{analytics.total}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Average Mood</div>
            <div className="font-semibold text-lg">{analytics.avg} / 5</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Last Logged</div>
            <div className="font-semibold text-lg">{Object.keys(moodDataState).length ? new Date(Object.keys(moodDataState).slice(-1)[0]).toDateString() : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendarPage;
