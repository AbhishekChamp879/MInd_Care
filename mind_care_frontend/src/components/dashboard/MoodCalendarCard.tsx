import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getMoods } from '@/lib/moodsApi';

const moodMap: Record<string, { emoji: string; color: string; image?: string }> = {
  happy: { emoji: '😊', color: '#FDE68A', image: 'https://via.placeholder.com/400x240.png?text=Happy' },
  sad: { emoji: '😔', color: '#BFDBFE', image: 'https://via.placeholder.com/400x240.png?text=Sad' },
  anxious: { emoji: '😬', color: '#FECACA', image: 'https://via.placeholder.com/400x240.png?text=Anxious' },
  neutral: { emoji: '😐', color: '#E5E7EB', image: 'https://via.placeholder.com/400x240.png?text=Neutral' },
  excited: { emoji: '🤩', color: '#FDE68A', image: 'https://via.placeholder.com/400x240.png?text=Excited' },
};

function getMoodKey(label: string | undefined): string {
  if (!label) return 'neutral';
  const l = label.toLowerCase();
  if (l.includes('great') || l.includes('excited') || l.includes('happy')) return 'excited';
  if (l.includes('good') || l.includes('okay') || l.includes('fine')) return 'happy';
  if (l.includes('bad') || l.includes('sad')) return 'sad';
  if (l.includes('anx') || l.includes('worried') || l.includes('nerv')) return 'anxious';
  return 'neutral';
}

export const MoodCalendarCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [moodData, setMoodData] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMoodKey, setSelectedMoodKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const fallbackImage = 'https://via.placeholder.com/400x240.png?text=No+image';

  useEffect(() => {
    getMoods().then((result) => {
      const map: Record<string, string> = {};
      if (!result) return setMoodData(map);

      if (Array.isArray(result)) {
        (result as Array<{ date: string; mood: string }>).forEach((m) => {
          map[new Date(m.date).toDateString()] = m.mood;
        });
      } else {
        Object.entries(result as Record<string, string>).forEach(([date, mood]) => {
          map[new Date(date).toDateString()] = mood;
        });
      }

      setMoodData(map);
    });
  }, []);

  // Group dates by mood key
  const moodDates: Record<string, Date[]> = Object.keys(moodData).reduce((acc: Record<string, Date[]>, d) => {
    const moodLabel = moodData[d];
    const key = getMoodKey(moodLabel);
    acc[key] = acc[key] || [];
    acc[key].push(new Date(d));
    return acc;
  }, {});

  const onDayClick = (day?: Date | undefined) => {
    if (!day) return;
    const ds = new Date(day).toDateString();
    setSelectedDate(new Date(day));
    setSelectedMoodKey(moodData[ds] ? getMoodKey(moodData[ds]) : null);
  };

  return (
    <Card className={`enhanced-card ${className} relative overflow-hidden`}> 
      <div className="absolute right-3 top-3">
        <Badge variant="secondary" className="bg-gradient-primary text-white shadow-soft">Mood Tracker</Badge>
      </div>

      <CardHeader
        className="pb-4 text-center cursor-pointer"
        onClick={() => setExpanded((s) => !s)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center shadow-soft">
          <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 18c0-2.21 3.58-4 6-4s6 1.79 6 4v2H6v-2z" fill="currentColor" />
          </svg>
        </div>

        <CardTitle className="text-lg">Mood Calendar</CardTitle>
        <CardDescription>Track daily moods and view visual history</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Only show calendar + details when expanded */}
        {expanded ? (
          <div>
            <DayPicker
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(d) => onDayClick(d as Date)}
              modifiers={{ ...moodDates }}
              modifiersStyles={Object.keys(moodDates).reduce((acc: Record<string, React.CSSProperties>, key) => {
                acc[key] = { backgroundColor: moodMap[key]?.color || '#F3F4F6', color: '#111827', borderRadius: '8px' };
                return acc;
              }, {} as Record<string, React.CSSProperties>)}
              fromDate={new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)}
              toDate={new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1)}
            />

            {selectedDate && (
              <div className="mt-4 text-center">
                <div className="text-xl">
                  <span className="text-2xl mr-2">{selectedMoodKey ? moodMap[selectedMoodKey]?.emoji : '—'}</span>
                  <span className="align-middle">{selectedDate.toDateString()}</span>
                </div>
                {selectedMoodKey && (
                  <img
                    src={moodMap[selectedMoodKey]!.image || fallbackImage}
                    alt={selectedMoodKey}
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (t.src !== fallbackImage) t.src = fallbackImage;
                    }}
                    className="mt-3 mx-auto rounded-lg max-h-40 object-cover"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          // Collapsed placeholder area (no calendar grid)
          <div>
            
          </div>
        )}

        {/* Features list + Learn More button */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary mt-1" />
            <div>
              <div className="font-semibold">Daily mood logging</div>
              
            </div>
          </div>

          <div className="flex items-start justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary mt-1" />
            <div>
              <div className="font-semibold">Emoji timeline</div>
              
            </div>
          </div>

          <div className="flex items-start justify-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary mt-1" />
            <div>
              <div className="font-semibold">Private notes</div>
              
            </div>
          </div>

          <div className="mt-4">
            <Button asChild className="w-full bg-gradient-primary hover:shadow-glow">
              <Link to="/app/mood-calendar" className="flex items-center justify-center">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodCalendarCard;
