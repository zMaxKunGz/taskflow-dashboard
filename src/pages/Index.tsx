import { useState } from 'react';
import { Task, TaskSuggestion } from '@/types/task';
import { tasks as initialTasks, teamMembers } from '@/data/sampleData';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TeamMemberSection } from '@/components/TeamMemberSection';
import { TaskTimeline } from '@/components/TaskTimeline';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { AISuggestionBox } from '@/components/AISuggestionBox';

const Index = () => {
  const [view, setView] = useState<'team' | 'timeline'>('team');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [prefillData, setPrefillData] = useState<TaskSuggestion | null>(null);

  const handleTaskClick = (task: Task) => {
    setEditTask(task);
    setPrefillData(null);
    setDialogOpen(true);
  };

  const handleCreateTask = () => {
    setEditTask(null);
    setPrefillData(null);
    setDialogOpen(true);
  };

  const handleCreateFromSuggestion = (suggestion: TaskSuggestion) => {
    setEditTask(null);
    setPrefillData(suggestion);
    setDialogOpen(true);
  };

  const handleTaskCreated = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks([...tasks, task]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const getTasksForMember = (memberId: string) => {
    return tasks.filter(task => task.assigneeId === memberId);
  };

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

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AISuggestionBox onCreateFromSuggestion={handleCreateFromSuggestion} />
            </div>
          </div>
        </div>

        <CreateTaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          teamMembers={teamMembers}
          onCreateTask={handleTaskCreated}
          onUpdateTask={handleTaskUpdated}
          editTask={editTask}
          prefillData={prefillData}
        />
      </div>
    </div>
  );
};

export default Index;
