import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { STATUS_TONE_CLASS_NAME } from '@/constants/dashboard/assetConstants';
import type { StatusTone } from '@/enums/dashboard/statusTone';

interface StatusBadgeProperties {
  label: string;
  icon: LucideIcon;
  tone: StatusTone;
}

/** A status shown with its icon, label and colour together. */
export const StatusBadge = ({ label, icon: Icon, tone }: StatusBadgeProperties) => (
  <Badge variant="outline" className={STATUS_TONE_CLASS_NAME[tone]}>
    <Icon aria-hidden="true" />
    {label}
  </Badge>
);
