const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  deleteJob,
} = require(
  "../controllers/JobController"
);

router.post("/", createJob);

router.get("/", getJobs);

router.delete("/:id", deleteJob);

module.exports = router;