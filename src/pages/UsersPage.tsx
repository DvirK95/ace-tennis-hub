import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useUserStore } from "@/stores/useUserStore";
import DataTable from "@/components/DataTable";
import UserPermissionsDialog from "@/components/Users/UserPermissionsDialog";
import PageHeader from "@/components/Layout/PageHeader";
import type { AppUser } from "@/types/permissions";

const columnHelper = createColumnHelper<AppUser>();

export default function UsersPage() {
  const { users, togglePermission } = useUserStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name", enableSorting: true }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("permissions", {
        header: "Permissions",
        cell: (info) => `${info.getValue().length} active`,
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <PageHeader title="Users & Permissions" description="Manage user access and permissions" />
      <DataTable
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={(user) => setSelectedUser(user)}
      />
      <UserPermissionsDialog
        open={!!selectedUser}
        onOpenChange={(open) => { if (!open) setSelectedUser(null); }}
        user={selectedUser}
        onToggle={togglePermission}
      />
    </div>
  );
}
