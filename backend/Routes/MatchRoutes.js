const express = require("express");

const router = express.Router();

const { protect } = require(
  "../middleware/authMiddleware"
);

const {
  matchJobs,
} = require(
  "../Controllers/MatchController"
);

router.get(
  "/",
  protect,
  matchJobs
);

module.exports = router;