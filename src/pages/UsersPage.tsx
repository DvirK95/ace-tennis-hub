import PermissionsMatrix from "@/components/Permissions/PermissionsMatrix";
import PageHeader from "@/components/Layout/PageHeader";

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="Permissions Matrix" description="Configure permissions for each role" />
      <PermissionsMatrix />
    </div>
  );
}
