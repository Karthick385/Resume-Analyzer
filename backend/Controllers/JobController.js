const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skills,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      skills,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Job Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  deleteJob,
};