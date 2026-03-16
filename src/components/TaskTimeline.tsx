import { Task, TeamMember } from '@/types/task';
import { cn } from '@/lib/utils';
import { format, differenceInDays, startOfDay, addDays, isSameDay, isWithinInterval } from 'date-fns';

interface TaskTimelineProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onTaskClick: (task: Task) => void;
}

const statusColors = {
  'waiting': 'bg-muted',
  'in-progress': 'bg-primary',
  'completed': 'bg-success',
};

export function TaskTimeline({ tasks, teamMembers, onTaskClick }: TaskTimelineProps) {
  const today = startOfDay(new Date());
  const startDate = addDays(today, -7);
  const endDate = addDays(today, 14);
  const totalDays = differenceInDays(endDate, startDate);
  
  const days = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  const getTaskPosition = (task: Task) => {
    const taskStart = startOfDay(task.startDate);
    const taskEnd = startOfDay(task.endDate);
    
    const startOffset = Math.max(0, differenceInDays(taskStart, startDate));
    const endOffset = Math.min(totalDays, differenceInDays(taskEnd, startDate) + 1);
    
    const left = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset) / totalDays) * 100;
    
    return { left: `${left}%`, width: `${Math.max(width, 3)}%` };
  };

  const getMemberTasks = (memberId: string) => {
    return tasks.filter(task => task.assigneeId === memberId);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Timeline View</h3>
        <p className="text-sm text-muted-foreground">Task schedule across team members</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b border-border">
            <div className="w-48 shrink-0 p-3 bg-muted/30 border-r border-border">
              <span className="text-sm font-medium text-muted-foreground">Team Member</span>
            </div>
            <div className="flex-1 flex">
              {days.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 p-2 text-center border-r border-border last:border-r-0 min-w-[50px]",
                    isSameDay(day, today) && "bg-primary/10"
                  )}
                >
                  <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    isSameDay(day, today) ? "text-primary" : "text-card-foreground"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {teamMembers.map((member) => {
            const memberTasks = getMemberTasks(member.id);
            
            return (
              <div key={member.id} className="flex border-b border-border last:border-b-0">
                <div className="w-48 shrink-0 p-3 bg-muted/30 border-r border-border">
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-card-foreground truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{member.role}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative h-20">
                  <div className="absolute inset-0 flex">
                    {days.map((day, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 border-r border-border last:border-r-0 min-w-[50px]",
                          isSameDay(day, today) && "bg-primary/5"
                        )}
                      />
                    ))}
                  </div>
                  
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                    style={{ left: `${(differenceInDays(today, startDate) / totalDays) * 100}%` }}
                  />

                  <div className="absolute inset-0 p-2 flex flex-col gap-1">
                    {memberTasks.map((task, idx) => {
                      const position = getTaskPosition(task);
                      const isVisible = isWithinInterval(task.startDate, { start: startDate, end: endDate }) ||
                                       isWithinInterval(task.endDate, { start: startDate, end: endDate }) ||
                                       (task.startDate <= startDate && task.endDate >= endDate);
                      
                      if (!isVisible) return null;

                      return (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={cn(
                            "absolute h-6 rounded cursor-pointer transition-all hover:opacity-80 hover:shadow-sm",
                            statusColors[task.status]
                          )}
                          style={{
                            left: position.left,
                            width: position.width,
                            top: `${8 + idx * 28}px`,
                          }}
                          title={task.title}
                        >
                          <span className="px-2 text-xs font-medium text-primary-foreground truncate block leading-6">
                            {task.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
