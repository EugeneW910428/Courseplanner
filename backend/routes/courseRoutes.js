const express = require('express');
const multer = require('multer');
const { generateSchedule } = require('../controllers/scheduleController');

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' }); // Ensure the 'uploads' directory exists

// Define route with multer middleware
router.post('/schedule/generate', upload.single('transcript'), generateSchedule);

module.exports = router;
















