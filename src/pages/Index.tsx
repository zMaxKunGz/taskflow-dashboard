import { useState } from 'react';
import { Task, TaskSuggestion } from '@/types/task';
import { tasks as initialTasks, teamMembers } from '@/data/sampleData';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TeamMemberSection } from '@/components/TeamMemberSection';
import { TaskTimeline } from '@/components/TaskTimeline';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { AISuggestionBox } from '@/components/AISuggestionBox';

const Index = () => {
  const [view, setView] = useState<'team' | 'timeline'>('team');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<TaskSuggestion | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCreateTask = () => {
    setPrefillData(null);
    setCreateDialogOpen(true);
  };

  const handleCreateFromSuggestion = (suggestion: TaskSuggestion) => {
    setPrefillData(suggestion);
    setCreateDialogOpen(true);
  };

  const handleTaskCreated = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks([...tasks, task]);
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
        <DashboardHeader 
          tasks={tasks} 
          view={view} 
          onViewChange={setView}
          onCreateTask={handleCreateTask}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
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
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AISuggestionBox onCreateFromSuggestion={handleCreateFromSuggestion} />
            </div>
          </div>
        </div>

        <TaskDetailDialog
          task={selectedTask}
          assignee={selectedAssignee}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />

        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          teamMembers={teamMembers}
          onCreateTask={handleTaskCreated}
          prefillData={prefillData}
        />
      </div>
    </div>
  );
};

export default Index;
