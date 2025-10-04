import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, BookOpenCheck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ReadingModeButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ReadingModeButton: React.FC<ReadingModeButtonProps> = ({
  className = '',
  size = 'default',
  variant = 'outline',
}) => {
  const { settings, updateSettings } = useTheme();
  const isReadingMode = settings.readingMode?.enabled || false;

  const toggleReadingMode = () => {
    updateSettings({
      readingMode: {
        ...settings.readingMode,
        enabled: !isReadingMode,
      },
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={toggleReadingMode}
          className={`transition-all duration-200 ${isReadingMode ? 'bg-primary text-primary-foreground' : ''} ${className}`}
          aria-label={isReadingMode ? 'Exit reading mode' : 'Enter reading mode'}
        >
          {isReadingMode ? <BookOpenCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
          {size !== 'sm' && (
            <span className="ml-2">{isReadingMode ? 'Exit Reading' : 'Reading Mode'}</span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isReadingMode ? 'Exit reading mode' : 'Enter reading mode for comfortable reading'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ReadingModeButton;
