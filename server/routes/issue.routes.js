import express from "express";
import { createIssue, getMyIssues, getAllIssues, updateIssue } from "../controllers/issue.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Student
router.post("/", protect, upload.single("image"), createIssue);
router.get("/my", protect, getMyIssues);

// Admin
router.get("/", protect, isAdmin, getAllIssues);
router.patch("/:id", protect, isAdmin, updateIssue);


export default router;
