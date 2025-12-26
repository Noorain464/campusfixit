import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import Issue from "./models/issue.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedStudentPassword = await bcrypt.hash("student123", salt);

    // Create Admin
    const admin = await User.create({
      name: "Campus Admin",
      email: "admin@college.edu",
      password: hashedAdminPassword,
      role: "admin",
    });

    // Create Student
    const student = await User.create({
      name: "John Doe",
      email: "john@student.edu",
      password: hashedStudentPassword,
      role: "student",
    });

    // Create Sample Issues
    await Issue.create([
      {
        title: "WiFi not working",
        description: "Internet is down in Block C since morning.",
        category: "Internet",
        status: "Open",
        createdBy: student._id,
      },
      {
        title: "Leaking Pipe",
        description: "Water leaking in the ground floor washroom.",
        category: "Water",
        status: "In Progress",
        remarks: "Plumber notified.",
        createdBy: student._id,
      }
    ]);

    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedData();