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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Suggestions</h3>
            <p className="text-xs text-muted-foreground">Based on your goals</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      <div className="space-y-2">
        {mockSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-card rounded-lg p-3 border border-border/50 shadow-sm hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0" />
                <h4 className="font-medium text-card-foreground text-sm truncate">{suggestion.title}</h4>
              </div>
              <Badge variant="secondary" className={cn("text-[10px] shrink-0 px-1.5 py-0", priorityStyles[suggestion.priority])}>
                {suggestion.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2 pl-5">
              {suggestion.description}
            </p>
            <div className="flex items-center justify-between pl-5">
              <span className="text-[10px] text-muted-foreground">~{suggestion.estimatedDays}d</span>
              <Button
                onClick={() => onCreateFromSuggestion(suggestion)}
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1 px-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <Plus className="w-3 h-3" />
                Create
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}