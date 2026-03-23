// @ts-nocheck
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { GitBranch, Save, X } from 'lucide-react';

const defaultFormData = {
  developer_name: '',
  branch_name: '',
  parent_branch: '',
  changes_description: '',
  has_jira_task: false,
  jira_link: '',
  merged_with_dev: false,
  merged_with_demo: false,
  merged_with_beta: false,
};

export default function BranchForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (!data.has_jira_task) {
      data.jira_link = '';
    }
    onSubmit(data);
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitBranch className="h-5 w-5 text-primary" />
          {initialData ? 'Edit Branch' : 'Add New Branch'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="developer_name">Developer Name</Label>
              <Input
                id="developer_name"
                placeholder="e.g. John Doe"
                value={formData.developer_name}
                onChange={(e) => handleChange('developer_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch_name">Branch Name</Label>
              <Input
                id="branch_name"
                placeholder="e.g. feature/user-auth"
                value={formData.branch_name}
                onChange={(e) => handleChange('branch_name', e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_branch">Parent Branch</Label>
              <Input
                id="parent_branch"
                placeholder="e.g. dev, main"
                value={formData.parent_branch}
                onChange={(e) => handleChange('parent_branch', e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jira_link">Jira Link</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.has_jira_task}
                    onCheckedChange={(val) => handleChange('has_jira_task', val)}
                  />
                  <span className="text-xs text-muted-foreground">Has Jira task</span>
                </div>
              </div>
              <Input
                id="jira_link"
                placeholder="https://jira.atlassian.net/browse/TASK-123"
                value={formData.jira_link}
                onChange={(e) => handleChange('jira_link', e.target.value)}
                disabled={!formData.has_jira_task}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changes_description">Changes Description</Label>
            <Textarea
              id="changes_description"
              placeholder="Describe what changes are being made in this branch..."
              value={formData.changes_description}
              onChange={(e) => handleChange('changes_description', e.target.value)}
              className="h-24 resize-none"
            />
          </div>

          {/* Merge Status */}
          <div className="space-y-3">
            <Label>Merge Status</Label>
            <div className="flex flex-wrap gap-6">
              {[
                { key: 'merged_with_dev', label: 'Merged with Dev' },
                { key: 'merged_with_demo', label: 'Merged with Demo' },
                { key: 'merged_with_beta', label: 'Merged with Beta' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <Checkbox
                    id={item.key}
                    checked={formData[item.key]}
                    onCheckedChange={(val) => handleChange(item.key, val)}
                  />
                  <Label htmlFor={item.key} className="text-sm font-normal cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {initialData ? 'Update Branch' : 'Create Branch'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}