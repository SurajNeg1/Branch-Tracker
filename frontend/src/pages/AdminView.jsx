// @ts-nocheck
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/client';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import StatsCards from '@/components/branch/StatsCards';
import BranchTable from '@/components/branch/BranchTable';
import BranchFilters from '@/components/branch/BranchFilters';
import BranchForm from '@/components/branch/BranchForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [mergeFilter, setMergeFilter] = useState('all');
  const [editingBranch, setEditingBranch] = useState(null);

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['all-branches'],
    queryFn: async () => {
      return await apiClient.getBranches();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await apiClient.updateBranch(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-branches'] });
      setEditingBranch(null);
      toast({
        title: 'Success',
        description: 'Branch updated!',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update branch',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await apiClient.deleteBranch(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-branches'] });
      toast({
        title: 'Success',
        description: 'Branch deleted!',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete branch',
        variant: 'destructive',
      });
    },
  });

  // Only admins can access this page
//   if (user?.role !== 'admin') {
//     return <Navigate to="/Dashboard" replace />;
//   }

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

  // Get unique developers for summary
  const developers = [...new Set(branches.map(b => b.developer_name))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin — All Branches</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Viewing all branches from {developers.length} developer{developers.length !== 1 ? 's' : ''}
        </p>
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
          showDeveloper={true}
        />
      )}
    </div>
  );
}