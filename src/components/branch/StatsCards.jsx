import { GitBranch, GitMerge, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StatsCards({ branches }) {
  const total = branches.length;
  const mergedDev = branches.filter(b => b.merged_with_dev).length;
  const mergedBeta = branches.filter(b => b.merged_with_beta).length;
  const pending = branches.filter(b => !b.merged_with_dev).length;

  const stats = [
    { label: 'Total Branches', value: total, icon: GitBranch, color: 'text-primary bg-accent' },
    { label: 'Merged to Dev', value: mergedDev, icon: GitMerge, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Merged to Beta', value: mergedBeta, icon: CheckCircle2, color: 'text-violet-600 bg-violet-50' },
    { label: 'Pending Merge', value: pending, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-5 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}