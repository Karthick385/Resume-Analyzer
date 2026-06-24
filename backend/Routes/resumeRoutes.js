const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume, getResume, deleteResume } = require("../Controllers/ResumeController");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/myresume", protect, getResume);
router.delete("/clear", protect, deleteResume);

module.exports = router;