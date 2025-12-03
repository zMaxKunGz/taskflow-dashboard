import { Task, TeamMember } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, User, Tag, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDetailDialogProps {
  task: Task | null;
  assignee: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles = {
  'todo': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  'completed': 'bg-success/10 text-success',
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

const priorityStyles = {
  'low': 'bg-muted text-muted-foreground',
  'medium': 'bg-warning/10 text-warning',
  'high': 'bg-destructive/10 text-destructive',
};

export function TaskDetailDialog({ task, assignee, open, onOpenChange }: TaskDetailDialogProps) {
  if (!task || !assignee) return null;

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-card-foreground leading-tight">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("text-xs", statusStyles[task.status])}>
                  {statusLabels[task.status]}
                </Badge>
                <Badge className={cn("text-xs", priorityStyles[task.priority])}>
                  {task.priority} priority
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-card-foreground truncate">{assignee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{assignee.role}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d')}
                </p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Subtasks</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedSubtasks} of {totalSubtasks} completed
                </span>
              </div>
              
              <Progress value={progress} className="h-1.5 mb-3" />
              
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md transition-colors",
                      subtask.completed ? "bg-success/5" : "bg-muted/30"
                    )}
                  >
                    <Checkbox
                      checked={subtask.completed}
                      className="pointer-events-none"
                    />
                    <span className={cn(
                      "text-sm",
                      subtask.completed ? "text-muted-foreground line-through" : "text-card-foreground"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
