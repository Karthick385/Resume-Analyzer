const fs = require("fs");
const PDFParser = require("pdf2json");
const Resume = require("../models/Resume");

const skillsDatabase = [
  "React", "Node.js", "MongoDB", "JavaScript",
  "HTML", "CSS", "Express", "Python", "Java",
  "SQL", "Git", "Docker", "AWS",
];

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const text = pdfData.Pages.map((page) =>
          page.Texts.map((t) =>
            decodeURIComponent(t.R.map((r) => r.T).join(""))
          ).join(" ")
        ).join("\n");
        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.loadPDF(filePath);
  });
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const extractedText = await extractTextFromPDF(req.file.path);

    const skills = skillsDatabase.filter((skill) =>
      extractedText.toLowerCase().includes(skill.toLowerCase())
    );

    const score = Math.min(skills.length * 10, 100);

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        fileName: req.file.filename,
        extractedText,
        skills,
        resumeScore: score,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Resume Uploaded Successfully",
      skills,
      resumeScore: score,
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resume after viewing recommendations
const deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Resume cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResume, deleteResume };