import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------- MongoDB Connection --------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error", err));

// -------- Student Schema --------
const studentSchema = new mongoose.Schema(
  {
    name: String,
    standard: String,
    age: Number,
    schoolName: String,
    mobile: String
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// -------- API --------
app.post("/api/students", async (req, res) => {
  try {
    await Student.create(req.body);
    res.json({ message: "Student enrolled successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to enroll student" });
  }
});
// -------- Get All Students --------
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// -------- Serve Frontend --------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// -------- Start Server --------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
