import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  tasks: Task[];
  view: 'team' | 'timeline';
  onViewChange: (view: 'team' | 'timeline') => void;
}

export function DashboardHeader({ tasks, view, onViewChange }: DashboardHeaderProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'text-foreground' },
    { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-primary' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-success' },
  ];

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage team tasks</p>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('team')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              view === 'team'
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Team View
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              view === 'timeline'
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-4 h-4" />
            Timeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted/50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
