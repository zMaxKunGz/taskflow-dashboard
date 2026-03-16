import { Task, TeamMember } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TeamMemberSectionProps {
  member: TeamMember;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TeamMemberSection({ member, tasks, onTaskClick }: TeamMemberSectionProps) {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const waitingCount = tasks.filter(t => t.status === 'waiting').length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">{member.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{member.role}</p>
          </div>
          <div className="flex items-center gap-2">
            {waitingCount > 0 && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {waitingCount} waiting
              </Badge>
            )}
            {inProgressCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {inProgressCount} active
              </Badge>
            )}
            {completedCount > 0 && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                {completedCount} done
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {tasks.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={member}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No tasks assigned</p>
        )}
      </div>
    </div>
  );
}
