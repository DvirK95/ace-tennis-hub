import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button/Button';
import { ArrowLeft } from 'lucide-react';
import UserDetailsTab from '@/components/Profile/UserDetailsTab';
import UserActivityTab from '@/components/Profile/UserActivityTab';
import UserTasksTab from '@/components/Profile/UserTasksTab';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { person, userGroups, absences } = useUserProfile(userId ?? '');

  if (!person) {
    return <p className="p-8 text-muted-foreground">User not found.</p>;
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 gap-1"
        onClick={() => navigate('/people')}
        icon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to People
      </Button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <p className="text-sm text-muted-foreground">{person.email}</p>
      </div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <UserDetailsTab person={person} />
        </TabsContent>
        <TabsContent value="activity">
          <UserActivityTab person={person} userGroups={userGroups} absences={absences} />
        </TabsContent>
        <TabsContent value="tasks">
          <UserTasksTab userId={person.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
