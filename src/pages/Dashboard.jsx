import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import StatsCards from '@/components/branch/StatsCards';
import BranchTable from '@/components/branch/BranchTable';
import BranchFilters from '@/components/branch/BranchFilters';
import BranchForm from '@/components/branch/BranchForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [mergeFilter, setMergeFilter] = useState('all');
  const [editingBranch, setEditingBranch] = useState(null);

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['my-branches'],
    queryFn: async () => {
      // TODO: Implement custom backend API call to fetch user's branches
      throw new Error('Fetch branches API not yet implemented. Please implement your own backend API.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // TODO: Implement custom backend API call to update branch
      throw new Error('Update branch API not yet implemented. Please implement your own backend API.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-branches'] });
      setEditingBranch(null);
      toast.success('Branch updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // TODO: Implement custom backend API call to delete branch
      throw new Error('Delete branch API not yet implemented. Please implement your own backend API.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-branches'] });
      toast.success('Branch deleted!');
    },
  });

  const filtered = branches.filter((b) => {
    const matchesSearch =
      !search ||
      b.branch_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.developer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.changes_description?.toLowerCase().includes(search.toLowerCase());

    let matchesMerge = true;
    if (mergeFilter === 'not_merged') matchesMerge = !b.merged_with_dev;
    if (mergeFilter === 'merged_dev') matchesMerge = b.merged_with_dev;
    if (mergeFilter === 'merged_demo') matchesMerge = b.merged_with_demo;
    if (mergeFilter === 'merged_beta') matchesMerge = b.merged_with_beta;

    return matchesSearch && matchesMerge;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Branches</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage your git branches</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <StatsCards branches={branches} />
      )}

      {editingBranch && (
        <BranchForm
          initialData={editingBranch}
          onSubmit={(data) => updateMutation.mutate({ id: editingBranch.id, data })}
          onCancel={() => setEditingBranch(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}

      <BranchFilters
        search={search}
        onSearchChange={setSearch}
        mergeFilter={mergeFilter}
        onMergeFilterChange={setMergeFilter}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      ) : (
        <BranchTable
          branches={filtered}
          onEdit={setEditingBranch}
          onDelete={(id) => deleteMutation.mutate(id)}
          showDeveloper={false}
        />
      )}
    </div>
  );
}