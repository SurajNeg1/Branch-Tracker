import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Branch from '../models/Branch.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const branches = await Branch.find({ userId: req.userId });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { branch_name, developer_name, parent_branch, changes_description, has_jira_task, jira_link, merged_with_dev, merged_with_demo, merged_with_beta, status } = req.body;

    if (!branch_name) {
      return res.status(400).json({ message: 'Branch name is required' });
    }

    const branch = new Branch({
      userId: req.userId,
      branch_name,
      developer_name,
      parent_branch,
      changes_description,
      has_jira_task: has_jira_task || false,
      jira_link,
      merged_with_dev: merged_with_dev || false,
      merged_with_demo: merged_with_demo || false,
      merged_with_beta: merged_with_beta || false,
      status: status || 'active',
    });

    await branch.save();
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const branch = await Branch.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { branch_name, developer_name, parent_branch, changes_description, has_jira_task, jira_link, merged_with_dev, merged_with_demo, merged_with_beta, status } = req.body;

    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { branch_name, developer_name, parent_branch, changes_description, has_jira_task, jira_link, merged_with_dev, merged_with_demo, merged_with_beta, status },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
