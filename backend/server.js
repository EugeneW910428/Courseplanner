const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer config (for handling transcript uploads)
const upload = multer({ dest: 'uploads/' }); // make sure 'uploads' folder exists

// Import controller
const { generateSchedule } = require('./controllers/scheduleController');

// Route
app.post('/schedule/generate', upload.single('transcript'), generateSchedule);

// Default test route
app.get('/', (req, res) => {
    res.send('Welcome to the Auto Course Planner API');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});














