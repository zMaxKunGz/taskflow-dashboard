import { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask, TeamMember, TaskSuggestion, TaskFile } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, X, Sparkles, CalendarIcon, Upload, FileIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  prefillData?: TaskSuggestion | null;
}

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export function CreateTaskDialog({
  open,
  onOpenChange,
  teamMembers,
  onCreateTask,
  prefillData,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [assigneeSearchOpen, setAssigneeSearchOpen] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('waiting');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [files, setFiles] = useState<TaskFile[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefillData && open) {
      setTitle(prefillData.title);
      setDescription(prefillData.description);
      setPriority(prefillData.priority);
      setEndDate(addDays(new Date(), prefillData.estimatedDays));
      setIsPrefilled(true);
    }
  }, [prefillData, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssigneeId('');
    setStatus('waiting');
    setPriority('medium');
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 7));
    setFiles([]);
    setSubtasks([]);
    setIsPrefilled(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleAddSubtask = () => {
    setSubtasks([
      ...subtasks,
      {
        id: `new-${Date.now()}`,
        title: '',
        detail: '',
        assigneeId: undefined,
        endDate: undefined,
        completed: false,
      },
    ]);
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== subtaskId));
  };

  const handleSubtaskChange = (subtaskId: string, field: keyof Subtask, value: any) => {
    setSubtasks(
      subtasks.map(s =>
        s.id === subtaskId ? { ...s, [field]: field === 'assigneeId' && value === 'unassigned' ? undefined : value } : s
      )
    );
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: TaskFile[] = droppedFiles.map(f => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const newFiles: TaskFile[] = selectedFiles.map(f => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = () => {
    if (!title.trim() || !assigneeId) return;

    const validSubtasks = subtasks.filter(s => s.title.trim());

    const newTask: Omit<Task, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      assigneeId,
      status,
      priority,
      startDate,
      endDate,
      tags: [],
      files: files.length > 0 ? files : undefined,
      subtasks: validSubtasks.length > 0 ? validSubtasks : undefined,
    };

    onCreateTask(newTask);
    handleClose();
  };

  const selectedAssignee = teamMembers.find(m => m.id === assigneeId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Create New Task
            {isPrefilled && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Suggested
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
            />
          </div>

          {/* Assignee - Search & Click */}
          <div className="space-y-2">
            <Label>Assignee *</Label>
            <Popover open={assigneeSearchOpen} onOpenChange={setAssigneeSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !assigneeId && "text-muted-foreground"
                  )}
                >
                  {selectedAssignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={selectedAssignee.avatar} alt={selectedAssignee.name} />
                        <AvatarFallback>{selectedAssignee.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{selectedAssignee.name}</span>
                      <span className="text-muted-foreground text-xs">— {selectedAssignee.role}</span>
                    </div>
                  ) : (
                    "Search and select assignee..."
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search team members..." />
                  <CommandList>
                    <CommandEmpty>No member found.</CommandEmpty>
                    <CommandGroup>
                      {teamMembers.map((member) => (
                        <CommandItem
                          key={member.id}
                          value={member.name}
                          onSelect={() => {
                            setAssigneeId(member.id);
                            setAssigneeSearchOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => d && setStartDate(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => d && setEndDate(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Description with file drop zone */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div
              className={cn(
                "relative rounded-md border transition-colors",
                isDragging ? "border-primary border-dashed bg-primary/5" : "border-input"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
            >
              <Textarea
                ref={descriptionRef}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description... (drag files here to attach)"
                rows={4}
                className="border-0 focus-visible:ring-0 resize-none"
              />
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-md pointer-events-none">
                  <div className="flex flex-col items-center gap-1 text-primary">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">Drop files here</span>
                  </div>
                </div>
              )}
            </div>

            {/* File upload button */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
                  <Upload className="w-3.5 h-3.5" />
                  Attach files
                </div>
              </label>
            </div>

            {/* Uploaded files */}
            {files.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-md group"
                  >
                    <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Subtasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubtask}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Subtask
              </Button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-3">
                {subtasks.map((subtask, index) => (
                  <SubtaskForm
                    key={subtask.id}
                    subtask={subtask}
                    index={index}
                    teamMembers={teamMembers}
                    onChange={(field, value) => handleSubtaskChange(subtask.id, field, value)}
                    onRemove={() => handleRemoveSubtask(subtask.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !assigneeId}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Subtask form component
interface SubtaskFormProps {
  subtask: Subtask;
  index: number;
  teamMembers: TeamMember[];
  onChange: (field: keyof Subtask, value: any) => void;
  onRemove: () => void;
}

function SubtaskForm({ subtask, index, teamMembers, onChange, onRemove }: SubtaskFormProps) {
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const selectedAssignee = teamMembers.find(m => m.id === subtask.assigneeId);

  return (
    <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/20 relative group">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      {/* Title */}
      <Input
        value={subtask.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Subtask title..."
        className="h-8 text-sm"
      />

      {/* Detail */}
      <Textarea
        value={subtask.detail}
        onChange={(e) => onChange('detail', e.target.value)}
        placeholder="Detail..."
        rows={2}
        className="text-sm resize-none"
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Assignee */}
        <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start text-left font-normal h-8 text-xs",
                !subtask.assigneeId && "text-muted-foreground"
              )}
            >
              {selectedAssignee ? (
                <div className="flex items-center gap-1.5 truncate">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={selectedAssignee.avatar} alt={selectedAssignee.name} />
                    <AvatarFallback className="text-[8px]">{selectedAssignee.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{selectedAssignee.name}</span>
                </div>
              ) : (
                "Assign to..."
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search..." className="h-8" />
              <CommandList>
                <CommandEmpty>No member found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="unassigned"
                    onSelect={() => {
                      onChange('assigneeId', 'unassigned');
                      setAssigneeOpen(false);
                    }}
                  >
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  </CommandItem>
                  {teamMembers.map((member) => (
                    <CommandItem
                      key={member.id}
                      value={member.name}
                      onSelect={() => {
                        onChange('assigneeId', member.id);
                        setAssigneeOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-[8px]">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{member.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start text-left font-normal h-8 text-xs",
                !subtask.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3 w-3" />
              {subtask.endDate ? format(subtask.endDate, 'MMM d, yyyy') : 'End date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={subtask.endDate}
              onSelect={(d) => onChange('endDate', d)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
