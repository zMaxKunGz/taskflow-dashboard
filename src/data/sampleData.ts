import { Task, TeamMember } from '@/types/task';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@company.com',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'marcus@company.com',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'emily@company.com',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'david@company.com',
  },
];

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard UI',
    description: 'Create wireframes and high-fidelity mockups for the new analytics dashboard. Focus on data visualization and user experience.',
    assigneeId: '1',
    status: 'in-progress',
    priority: 'high',
    startDate: addDays(today, -5),
    endDate: addDays(today, 3),
    tags: ['Design', 'UI/UX'],
    subtasks: [
      { id: '1-1', title: 'Research competitors', detail: '', completed: true },
      { id: '1-2', title: 'Create wireframes', detail: '', completed: true },
      { id: '1-3', title: 'Design mockups', detail: '', completed: false },
      { id: '1-4', title: 'Get stakeholder feedback', detail: '', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Build secure login/logout functionality with OAuth2 integration. Include password reset and email verification.',
    assigneeId: '2',
    status: 'completed',
    priority: 'high',
    startDate: addDays(today, -10),
    endDate: addDays(today, -2),
    tags: ['Frontend', 'Security'],
    subtasks: [
      { id: '2-1', title: 'Set up OAuth providers', detail: '', completed: true },
      { id: '2-2', title: 'Create login UI', detail: '', completed: true },
      { id: '2-3', title: 'Implement token management', detail: '', completed: true },
    ],
  },
  {
    id: '3',
    title: 'API endpoint optimization',
    description: 'Optimize database queries and implement caching for the user data endpoints. Target 50% reduction in response time.',
    assigneeId: '3',
    status: 'in-progress',
    priority: 'medium',
    startDate: addDays(today, -3),
    endDate: addDays(today, 5),
    tags: ['Backend', 'Performance'],
    subtasks: [
      { id: '3-1', title: 'Profile current queries', detail: '', completed: true },
      { id: '3-2', title: 'Implement Redis caching', detail: '', completed: false },
      { id: '3-3', title: 'Load testing', detail: '', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Sprint planning for Q1',
    description: 'Organize and prioritize backlog items for the upcoming quarter. Coordinate with all team leads.',
    assigneeId: '4',
    status: 'waiting',
    priority: 'medium',
    startDate: addDays(today, 2),
    endDate: addDays(today, 4),
    tags: ['Planning', 'Management'],
  },
  {
    id: '5',
    title: 'Mobile responsive fixes',
    description: 'Fix layout issues on tablet and mobile devices. Ensure consistent experience across all breakpoints.',
    assigneeId: '2',
    status: 'waiting',
    priority: 'low',
    startDate: addDays(today, 4),
    endDate: addDays(today, 8),
    tags: ['Frontend', 'Mobile'],
  },
  {
    id: '6',
    title: 'User research interviews',
    description: 'Conduct 5 user interviews to gather feedback on the new feature set. Document findings and create report.',
    assigneeId: '1',
    status: 'waiting',
    priority: 'medium',
    startDate: addDays(today, 1),
    endDate: addDays(today, 7),
    tags: ['Research', 'UX'],
  },
  {
    id: '7',
    title: 'Database migration script',
    description: 'Write migration scripts for the new schema changes. Include rollback procedures.',
    assigneeId: '3',
    status: 'completed',
    priority: 'high',
    startDate: addDays(today, -8),
    endDate: addDays(today, -4),
    tags: ['Backend', 'Database'],
  },
  {
    id: '8',
    title: 'Quarterly review presentation',
    description: 'Prepare slides and data for the quarterly business review meeting.',
    assigneeId: '4',
    status: 'in-progress',
    priority: 'high',
    startDate: addDays(today, -2),
    endDate: addDays(today, 1),
    tags: ['Management', 'Presentation'],
  },
];
