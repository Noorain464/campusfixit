import Issue from "../models/issue.model.js";
// Student: Create Issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Issue creation failed" });
  }
};

// Student: View own issues
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};

// Admin: View all issues
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};

// Admin: Update issue status
export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = req.body.status || issue.status;
    issue.remarks = req.body.remarks || issue.remarks;

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
