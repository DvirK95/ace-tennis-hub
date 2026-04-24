import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormValues, type UserTask } from '@/types/schemas';
import { useUserTaskList } from '@/hooks/useTaskList';
import { usePersonStore } from '@/stores/usePersonStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/Button/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Pencil } from 'lucide-react';
import { useEffect, useMemo } from 'react';

interface UserTasksTabProps {
  userId: string;
}

export default function UserTasksTab({ userId }: UserTasksTabProps) {
  const { userTasks, editingTask, handleSubmit, handleEdit, handleCancelEdit, deleteTask, toggleComplete } =
    useUserTaskList(userId);

  return (
    <div className="space-y-4">
      <TaskForm
        userId={userId}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase">Task</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Creator</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Assignee</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Due</TableHead>
              <TableHead className="w-16 text-center text-xs font-semibold uppercase">Done</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {userTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No tasks assigned
                </TableCell>
              </TableRow>
            ) : (
              userTasks.map((task) => (
                <TaskTableRow
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface TaskFormProps {
  userId: string;
  editingTask: UserTask | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

function TaskForm({ userId, editingTask, onSubmit, onCancel }: TaskFormProps) {
  const people = usePersonStore((s) => s.people);
  const currentUserId = useAuthStore((s) => s.currentUserId);

  const creatorOptions = useMemo(
    () => people.filter((p) => p.roles.includes('ADMIN') || p.roles.includes('COACH')),
    [people],
  );

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      userId,
      creatorId: currentUserId ?? '00000000-0000-0000-0000-000000000001',
      assigneeId: undefined,
      taskText: '',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (editingTask) {
      form.reset({
        userId: editingTask.userId,
        creatorId: editingTask.creatorId,
        assigneeId: editingTask.assigneeId ?? undefined,
        taskText: editingTask.taskText,
        startDate: editingTask.startDate,
        endDate: editingTask.endDate,
      });
    } else {
      form.reset({
        userId,
        creatorId: currentUserId ?? '00000000-0000-0000-0000-000000000001',
        assigneeId: undefined,
        taskText: '',
        startDate: '',
        endDate: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask, userId]);

  function handleFormSubmit(values: TaskFormValues) {
    onSubmit(values);
    form.reset({ userId, creatorId: currentUserId ?? '', assigneeId: undefined, taskText: '', startDate: '', endDate: '' });
  }

  const { register, handleSubmit: rhfSubmit, setValue, watch, formState: { errors } } = form;
  const creatorId = watch('creatorId');
  const assigneeId = watch('assigneeId');

  return (
    <form
      onSubmit={rhfSubmit(handleFormSubmit)}
      className="space-y-3 rounded-lg border bg-muted/30 p-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Label className="text-xs">Task description</Label>
          <Input placeholder="Task description…" {...register('taskText')} className="mt-1" />
          {errors.taskText && <p className="mt-0.5 text-xs text-destructive">{errors.taskText.message}</p>}
        </div>
        <div>
          <Label className="text-xs">Start date</Label>
          <Input type="date" {...register('startDate')} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Due date</Label>
          <Input type="date" {...register('endDate')} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Created by</Label>
          <Select
            value={creatorId}
            onValueChange={(v) => setValue('creatorId', v)}
          >
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue placeholder="Select creator" />
            </SelectTrigger>
            <SelectContent>
              {creatorOptions.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Assigned to (optional)</Label>
          <Select
            value={assigneeId ?? 'none'}
            onValueChange={(v) => setValue('assigneeId', v === 'none' ? undefined : v)}
          >
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {people.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {editingTask && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm">
          {editingTask ? 'Update' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
}

interface TaskTableRowProps {
  task: UserTask;
  onToggle: (id: string) => void;
  onEdit: (task: UserTask) => void;
  onDelete: (id: string) => void;
}

function TaskTableRow({ task, onToggle, onEdit, onDelete }: TaskTableRowProps) {
  const people = usePersonStore((s) => s.people);
  const nameMap = useMemo(() => new Map(people.map((p) => [p.id, p.name])), [people]);

  const today = new Date().toISOString().split('T')[0];
  const overdue = task.endDate < today && !task.isComplete;

  return (
    <TableRow className={overdue ? 'bg-destructive/5' : ''}>
      <TableCell className={`text-sm ${overdue ? 'font-semibold text-destructive' : ''}`}>
        {task.taskText}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {nameMap.get(task.creatorId) ?? '—'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {task.assigneeId ? nameMap.get(task.assigneeId) ?? '—' : '—'}
      </TableCell>
      <TableCell className={`text-sm ${overdue ? 'font-semibold text-destructive' : ''}`}>
        {task.endDate}
      </TableCell>
      <TableCell className="text-center">
        <Checkbox checked={task.isComplete} onCheckedChange={() => onToggle(task.id)} />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            icon={<Pencil className="h-3.5 w-3.5" />}
            aria-label="Edit task"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
            aria-label="Delete task"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
