const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

// Load local mock courses
const mockCourses = require(path.join(__dirname, 'mockCourses.json'));

// === Constants ===
const coreCoursesList = ["CSS301", "CSS342", "CSS343", "CSS350", "CSS360", "CSS370", "CSS422", "CSS430", "CSS497"];

const electiveMapping = {
    cyber: ["CSS110", "CSS310", "CSS315", "CSS320", "CSS337", "CSS415", "CSS416", "CSS431", "CSS432", "CSS436", "CSS484", "CSS487"],
    ai: ["CSS382", "CSS385", "CSS485", "CSS486", "CSS487", "CSS488"],
    software: ["CSS133", "CSS143", "CSS360", "CSS370", "CSS371", "CSS390", "CSS449", "CSS450", "CSS452", "CSS461", "CSS477"],
    data: ["CSS123", "CSS290", "CSS330", "CSS340", "CSS444", "CSS475", "CSS483"],
    web: ["CSS250", "CSS370", "CSS371", "CSS480", "CSS481", "CSS478"]
};

const synonyms = {
    cyber: ["cybersecurity", "network security", "cryptography", "forensics", "ethical hacking", "penetration testing", "security"],
    ai: ["artificial intelligence", "machine learning", "deep learning", "neural networks", "NLP", "AI", "robotics"],
    software: ["software development", "programming", "coding", "devops", "agile"],
    data: ["data analytics", "statistics", "SQL", "data science", "ETL", "big data"],
    web: ["web development", "HTML", "CSS", "JavaScript", "React", "frontend", "backend"]
};

// === Helpers ===
const fetch100to400LevelCourses = async () => {
    console.log("✅ Using mock data for course list.");
    return mockCourses.filter(course => {
        const num = parseInt(course.CourseNumber, 10);
        return num >= 100 && num <= 500;
    });
};

const classifyCourses = (courses) => {
    const core = [], electives = [];
    courses.forEach(course => {
        const id = `${course.CurriculumAbbreviation}${course.CourseNumber}`;
        coreCoursesList.includes(id) ? core.push(course) : electives.push(course);
    });
    return { core, electives };
};

const calculateRelevanceScore = (course, aspiration) => {
    const combined = `${course.CourseTitleLong} ${course.CourseDescription}`.toLowerCase();
    let score = 0;

    if (electiveMapping[aspiration]?.includes(`${course.CurriculumAbbreviation}${course.CourseNumber}`)) score += 3;
    if (combined.includes(aspiration)) score += 2;
    if ((synonyms[aspiration] || []).some(s => combined.includes(s.toLowerCase()))) score += 1.5;
    return score;
};

const addCourseToSchedule = (course, creditsPerQuarter, schedule) => {
    for (const quarter of schedule) {
        const remaining = parseInt(creditsPerQuarter, 10) - quarter.totalCredits;
        if (course.Credits <= remaining) {
            quarter.courses.push({
                id: `${course.CurriculumAbbreviation}${course.CourseNumber}`,
                name: course.CourseTitleLong,
                credits: course.Credits
            });
            quarter.totalCredits += course.Credits;
            return true;
        }
    }
    return false;
};

// === Core APIs ===
let completedCourses = [];

const extractCompletedCourses = async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const parsedData = await pdf(dataBuffer);
        const matches = parsedData.text.match(/CSS\s+\d{3}/g) || [];

        completedCourses = matches.map(m => m.replace(/\s+/g, ""));
        console.log("📄 Completed courses:", completedCourses);
        res.json({ completedCourses });
    } catch (error) {
        console.error("❌ PDF parsing error:", error.message);
        res.status(500).json({ error: "Failed to process transcript file." });
    }
};

const getCompletedCourses = (req, res) => {
    if (!completedCourses.length) {
        return res.status(404).json({ error: "No completed courses found." });
    }
    res.json({ completedCourses });
};

const generateSchedule = async (req, res) => {
    const { careerAspiration, creditsPerQuarter, coursePreference } = req.body;
    if (!careerAspiration || !creditsPerQuarter || !coursePreference || !req.file) {
        return res.status(400).json({ error: "Missing required fields or transcript file." });
    }

    try {
        // Extract completed courses from transcript
        const dataBuffer = fs.readFileSync(req.file.path);
        const parsedData = await pdf(dataBuffer);
        const matches = parsedData.text.match(/CSS\s+\d{3}/g) || [];
        const completed = matches.map(m => m.replace(/\s+/g, ""));

        // Fetch + classify courses
        const allCourses = await fetch100to400LevelCourses();
        const { core, electives } = classifyCourses(allCourses);

        const remainingCore = core.filter(c => !completed.includes(`${c.CurriculumAbbreviation}${c.CourseNumber}`));
        const relevantElectives = electives.map(course => ({
            ...course,
            relevanceScore: calculateRelevanceScore(course, careerAspiration.toLowerCase())
        })).filter(c => c.relevanceScore > 1.5).sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Initialize quarters
        const schedule = ["Winter", "Spring", "Summer", "Autumn"].map(q => ({
            quarter: q,
            courses: [],
            totalCredits: 0
        }));
        const unplacedCourses = [];

        // Build schedule logic
        let coreIndex = 0, electiveIndex = 0;
        switch (coursePreference) {
            case "2-core-1-elective":
                while (coreIndex < remainingCore.length || electiveIndex < relevantElectives.length) {
                    for (let i = 0; i < 2 && coreIndex < remainingCore.length; i++) {
                        const added = addCourseToSchedule(remainingCore[coreIndex++], creditsPerQuarter, schedule);
                        if (!added) unplacedCourses.push(remainingCore[coreIndex - 1]);
                    }
                    if (electiveIndex < relevantElectives.length) {
                        const added = addCourseToSchedule(relevantElectives[electiveIndex++], creditsPerQuarter, schedule);
                        if (!added) unplacedCourses.push(relevantElectives[electiveIndex - 1]);
                    }
                }
                break;
            case "1-core-2-electives":
                while (coreIndex < remainingCore.length || electiveIndex < relevantElectives.length) {
                    if (coreIndex < remainingCore.length) {
                        const added = addCourseToSchedule(remainingCore[coreIndex++], creditsPerQuarter, schedule);
                        if (!added) unplacedCourses.push(remainingCore[coreIndex - 1]);
                    }
                    for (let i = 0; i < 2 && electiveIndex < relevantElectives.length; i++) {
                        const added = addCourseToSchedule(relevantElectives[electiveIndex++], creditsPerQuarter, schedule);
                        if (!added) unplacedCourses.push(relevantElectives[electiveIndex - 1]);
                    }
                }
                break;
            case "all-core":
                remainingCore.forEach(course => {
                    const added = addCourseToSchedule(course, creditsPerQuarter, schedule);
                    if (!added) unplacedCourses.push(course);
                });
                break;
            case "all-elective":
                relevantElectives.forEach(course => {
                    const added = addCourseToSchedule(course, creditsPerQuarter, schedule);
                    if (!added) unplacedCourses.push(course);
                });
                break;
            default:
                return res.status(400).json({ error: "Invalid course preference" });
        }

        if (!schedule.some(q => q.courses.length)) {
            return res.status(500).json({ error: "Schedule is empty. Check course load or transcript." });
        }

        res.json({ schedule, unplacedCourses });
    } catch (error) {
        console.error("❌ Error generating schedule:", error.message);
        res.status(500).json({ error: "Failed to generate schedule." });
    }
};

module.exports = {
    extractCompletedCourses,
    getCompletedCourses,
    generateSchedule
};
