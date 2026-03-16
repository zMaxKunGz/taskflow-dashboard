import { Task, TeamMember } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  assignee: TeamMember;
  onClick: () => void;
}

const statusStyles = {
  'waiting': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  'completed': 'bg-success/10 text-success',
};

const statusLabels = {
  'waiting': 'Waiting',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

const priorityStyles = {
  'low': 'bg-muted text-muted-foreground',
  'medium': 'bg-warning/10 text-warning',
  'high': 'bg-destructive/10 text-destructive',
};

export function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-card border border-border rounded-lg p-4 cursor-pointer",
        "hover:shadow-md hover:border-primary/30 transition-all duration-200",
        "animate-fade-in"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {task.title}
        </h4>
        <Badge variant="secondary" className={cn("shrink-0 text-xs", statusStyles[task.status])}>
          {statusLabels[task.status]}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(task.endDate, 'MMM d')}
          </span>
          {totalSubtasks > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}
        </div>
        <Badge variant="secondary" className={cn("text-xs", priorityStyles[task.priority])}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}
