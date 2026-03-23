// @ts-nocheck
import { format } from 'date-fns';
import { ExternalLink, Copy, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StatusBadge from './StatusBadge';

/** @type {React.FC<{branches: any[]; onEdit?: Function; onDelete?: Function; showDeveloper?: boolean}>} */
export default function BranchTable({ branches, onEdit, onDelete, showDeveloper = true }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Branch name copied!');
  };

  if (branches.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No branches found</p>
        <p className="text-sm mt-1">Create your first branch to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {showDeveloper && <TableHead className="font-semibold">Developer</TableHead>}
            <TableHead className="font-semibold">Branch Name</TableHead>
            <TableHead className="font-semibold">Parent</TableHead>
            <TableHead className="font-semibold">Changes</TableHead>
            <TableHead className="font-semibold">Jira</TableHead>
            <TableHead className="font-semibold">Merge Status</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            {onEdit && <TableHead className="font-semibold text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch._id} className="hover:bg-muted/30 transition-colors">
              {showDeveloper && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {branch.developer_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{branch.developer_name}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{branch.branch_name}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => copyToClipboard(branch.branch_name)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs font-mono text-muted-foreground">{branch.parent_branch}</code>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <p className="text-sm truncate">{branch.changes_description}</p>
              </TableCell>
              <TableCell>
                {branch.has_jira_task && branch.jira_link ? (
                  <a
                    href={branch.jira_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Jira
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge merged={branch.merged_with_dev} label="Dev" />
                  <StatusBadge merged={branch.merged_with_demo} label="Demo" />
                  <StatusBadge merged={branch.merged_with_beta} label="Beta" />
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {branch.created_date ? format(new Date(branch.created_date), 'MMM d') : '—'}
              </TableCell>
              {onEdit && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(branch)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(branch._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}