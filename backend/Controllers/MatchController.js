const Resume = require("../models/Resume");
const Job = require("../models/Job");

const matchJobs = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const jobs = await Job.find();

    const recommendations = jobs.map((job) => {
      const matchedSkills = job.skills.filter((skill) =>
        resume.skills.includes(skill)
      );

      const score = Math.round(
        (matchedSkills.length / job.skills.length) * 100
      );

      const missingSkills = job.skills.filter(
        (skill) => !resume.skills.includes(skill)
      );

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        matchScore: score,
        matchedSkills,
        missingSkills,
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Delete resume after fetching recommendations
    await Resume.findOneAndDelete({ userId: req.user.id });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { matchJobs };