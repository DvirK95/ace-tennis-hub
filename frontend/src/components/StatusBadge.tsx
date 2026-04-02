import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const VARIANT_MAP: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Active: 'default',
  Approved: 'default',
  APPROVED: 'default',
  Present: 'default',
  Maintenance: 'secondary',
  Inactive: 'secondary',
  PENDING_APPROVAL: 'outline',
  Beginner: 'outline',
  Intermediate: 'secondary',
  Advanced: 'default',
  REJECTED: 'destructive',
  Absent: 'destructive',
  Cancelled_Eligible: 'secondary',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variant = VARIANT_MAP[status] ?? 'outline';
  const label = status.replace(/_/g, ' ').replace('PENDING APPROVAL', 'Pending');

  return <Badge variant={variant}>{label}</Badge>;
}
