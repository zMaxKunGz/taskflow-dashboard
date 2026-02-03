import { useState } from 'react';
import { TaskSuggestion, TaskPriority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, RefreshCw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISuggestionBoxProps {
  onCreateFromSuggestion: (suggestion: TaskSuggestion) => void;
}

// Mock AI suggestions - in real implementation, these would come from an AI service
const mockSuggestions: TaskSuggestion[] = [
  {
    title: 'Implement dark mode toggle',
    description: 'Add a dark mode toggle to improve user experience and accessibility. Include system preference detection and persistence.',
    priority: 'medium',
    tags: ['Frontend', 'UI/UX', 'Accessibility'],
    estimatedDays: 5,
  },
  {
    title: 'Set up automated testing pipeline',
    description: 'Configure CI/CD pipeline with automated unit and integration tests. Ensure code coverage reporting and test failure notifications.',
    priority: 'high',
    tags: ['DevOps', 'Testing', 'Automation'],
    estimatedDays: 7,
  },
  {
    title: 'Create onboarding documentation',
    description: 'Write comprehensive onboarding documentation for new team members. Include setup guides, coding standards, and workflow processes.',
    priority: 'low',
    tags: ['Documentation', 'Onboarding'],
    estimatedDays: 4,
  },
];

const priorityStyles = {
  'low': 'bg-muted text-muted-foreground',
  'medium': 'bg-warning/10 text-warning',
  'high': 'bg-destructive/10 text-destructive',
};

export function AISuggestionBox({ onCreateFromSuggestion }: AISuggestionBoxProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>(mockSuggestions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate AI refreshing suggestions
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % suggestions.length);
      setIsRefreshing(false);
    }, 500);
  };

  const currentSuggestion = suggestions[currentIndex];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Task Suggestions</h3>
            <p className="text-xs text-muted-foreground">Based on your company's goals</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <RefreshCw className={cn("w-4 h-4 mr-1", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-primary/10 rounded-md mt-0.5">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-medium text-card-foreground">{currentSuggestion.title}</h4>
              <Badge variant="secondary" className={cn("text-xs", priorityStyles[currentSuggestion.priority])}>
                {currentSuggestion.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {currentSuggestion.description}
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-wrap gap-1">
                {currentSuggestion.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ~{currentSuggestion.estimatedDays} days
              </span>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onCreateFromSuggestion(currentSuggestion)}
          className="w-full mt-4 gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Create This Task
        </Button>
      </div>

      <div className="flex justify-center gap-1 mt-3">
        {suggestions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex 
                ? "bg-primary w-4" 
                : "bg-primary/30 hover:bg-primary/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}