import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, type TaskFormValues, type UserTask } from '@/types/schemas';
import { useUserTaskList } from '@/hooks/useTaskList';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trash2, Pencil } from 'lucide-react';
import { useEffect } from 'react';

interface UserTasksTabProps {
  userId: string;
}

export default function UserTasksTab({ userId }: UserTasksTabProps) {
  const {
    userTasks,
    editingTask,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    deleteTask,
    toggleComplete,
  } = useUserTaskList(userId);

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
              <TableHead className="text-xs font-semibold uppercase">Start</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Due</TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase">Done</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {userTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
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
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { userId, taskText: '', startDate: '', endDate: '' },
  });

  useEffect(() => {
    if (editingTask) {
      form.reset({
        userId: editingTask.userId,
        taskText: editingTask.taskText,
        startDate: editingTask.startDate,
        endDate: editingTask.endDate,
      });
    } else {
      form.reset({ userId, taskText: '', startDate: '', endDate: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask, userId]);

  function handleFormSubmit(values: TaskFormValues) {
    onSubmit(values);
    form.reset({ userId, taskText: '', startDate: '', endDate: '' });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex items-end gap-3 rounded-lg border bg-muted/30 p-3"
      >
        <FormField
          control={form.control}
          name="taskText"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-xs">Task</FormLabel>
              <FormControl>
                <Input placeholder="Task description…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Start</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Due</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">
          {editingTask ? 'Update' : 'Add'}
        </Button>
        {editingTask && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </form>
    </Form>
  );
}

interface TaskTableRowProps {
  task: UserTask;
  onToggle: (id: string) => void;
  onEdit: (task: UserTask) => void;
  onDelete: (id: string) => void;
}

function TaskTableRow({ task, onToggle, onEdit, onDelete }: TaskTableRowProps) {
  const today = new Date().toISOString().split('T')[0];
  const overdue = task.endDate < today && !task.isComplete;

  return (
    <TableRow className={overdue ? 'bg-destructive/10' : ''}>
      <TableCell className={`text-sm ${overdue ? 'font-semibold text-destructive' : ''}`}>
        {task.taskText}
      </TableCell>
      <TableCell className="text-sm">{task.startDate}</TableCell>
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
