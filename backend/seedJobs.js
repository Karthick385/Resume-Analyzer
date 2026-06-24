const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./models/Job");

dotenv.config();

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    skills: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Backend Developer",
    company: "DevSolutions",
    skills: ["Node.js", "Express", "MongoDB", "SQL"],
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "DevOps Engineer",
    company: "CloudBase",
    skills: ["Docker", "AWS", "Git", "Python"],
  },
  {
    title: "MERN Stack Developer",
    company: "WebAgency",
    skills: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
  },
  {
    title: "Python Developer",
    company: "DataTech",
    skills: ["Python", "SQL", "Git", "Docker"],
  },
  {
    title: "Java Developer",
    company: "EnterpriseCo",
    skills: ["Java", "SQL", "Git", "Docker"],
  },
  {
    title: "Cloud Engineer",
    company: "CloudFirst",
    skills: ["AWS", "Docker", "Git", "Python"],
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Job.deleteMany();
    console.log("Old jobs cleared");

    await Job.insertMany(jobs);
    console.log("Jobs seeded successfully!");

    process.exit();
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

seedJobs();