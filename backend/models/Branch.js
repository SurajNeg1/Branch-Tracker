import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    developer_name: {
      type: String,
    },
    parent_branch: {
      type: String,
    },
    changes_description: {
      type: String,
    },
    has_jira_task: {
      type: Boolean,
      default: false,
    },
    jira_link: {
      type: String,
    },
    merged_with_dev: {
      type: Boolean,
      default: false,
    },
    merged_with_demo: {
      type: Boolean,
      default: false,
    },
    merged_with_beta: {
      type: Boolean,
      default: false,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Branch', branchSchema);
