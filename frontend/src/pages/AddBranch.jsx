// @ts-nocheck
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';
import BranchForm from '@/components/branch/BranchForm';

export default function AddBranch() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      await apiClient.createBranch(data);
    },
    onSuccess: () => {
      toast.success('Branch created successfully!');
      navigate('/Dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Branch</h1>
        <p className="text-muted-foreground text-sm mt-1">Log a new branch you've created</p>
      </div>

      <BranchForm
        initialData={{ developer_name: user?.full_name || '' }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/Dashboard')}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}