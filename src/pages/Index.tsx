import { useState } from 'react';
import { Task } from '@/types/task';
import { tasks, teamMembers } from '@/data/sampleData';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TeamMemberSection } from '@/components/TeamMemberSection';
import { TaskTimeline } from '@/components/TaskTimeline';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';

const Index = () => {
  const [view, setView] = useState<'team' | 'timeline'>('team');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const getTasksForMember = (memberId: string) => {
    return tasks.filter(task => task.assigneeId === memberId);
  };

  const selectedAssignee = selectedTask
    ? teamMembers.find(m => m.id === selectedTask.assigneeId) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader tasks={tasks} view={view} onViewChange={setView} />

        {view === 'team' ? (
          <div className="space-y-6">
            {teamMembers.map((member) => (
              <TeamMemberSection
                key={member.id}
                member={member}
                tasks={getTasksForMember(member.id)}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        ) : (
          <TaskTimeline
            tasks={tasks}
            teamMembers={teamMembers}
            onTaskClick={handleTaskClick}
          />
        )}

        <TaskDetailDialog
          task={selectedTask}
          assignee={selectedAssignee}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </div>
  );
};

export default Index;
