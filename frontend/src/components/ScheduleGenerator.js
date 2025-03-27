import React, { useState } from 'react';
import { generateSchedule } from '../services/courseService';
import { useGlobalContext } from '../context/GlobalContext';
import './ScheduleGenerator.css';

const ScheduleGenerator = () => {
    const { uploadedTranscript, setUploadedTranscript } = useGlobalContext();
    const [careerAspiration, setCareerAspiration] = useState('');
    const [creditsPerQuarter, setCreditsPerQuarter] = useState('');
    const [coursePreference, setCoursePreference] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!careerAspiration || !creditsPerQuarter || !coursePreference || !uploadedTranscript) {
            setError('All fields are required, including uploading a transcript.');
            return;
        }

        const formData = new FormData();
        formData.append('careerAspiration', careerAspiration);
        formData.append('creditsPerQuarter', creditsPerQuarter);
        formData.append('coursePreference', coursePreference);
        formData.append('transcript', uploadedTranscript);

        try {
            const response = await generateSchedule(formData);
            setSchedule(response.schedule);
            setError('');
        } catch (err) {
            setError('Failed to generate schedule. Please try again.');
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setUploadedTranscript(e.target.files[0]);
    };

    return (
        <div className="schedule-generator">
            <h2>Schedule Generator</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Career Aspiration:</label>
                    <input
                        type="text"
                        value={careerAspiration}
                        onChange={(e) => setCareerAspiration(e.target.value)}
                        placeholder="Enter your career aspiration"
                    />
                </div>
                <div className="form-group">
                    <label>Credits Per Quarter:</label>
                    <input
                        type="number"
                        value={creditsPerQuarter}
                        onChange={(e) => setCreditsPerQuarter(e.target.value)}
                        placeholder="Enter credits per quarter"
                    />
                </div>
                <div className="form-group">
                    <label>Course Preference:</label>
                    <select
                        value={coursePreference}
                        onChange={(e) => setCoursePreference(e.target.value)}
                    >
                        <option value="">Select Preference</option>
                        <option value="all-core">All Core Courses</option>
                        <option value="all-elective">All Elective Courses</option>
                        <option value="2-core-1-elective">2 Core, 1 Elective</option>
                        <option value="2-elective-1-core">2 Elective, 1 Core</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Upload Transcript:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Generate Schedule</button>
            </form>

            {error && <p className="error">{error}</p>}

            {schedule.length > 0 && (
                <div className="schedule">
                    <h3>Academic Year 2023-2024</h3>
                    <div className="quarters">
                        {schedule.map((quarter, index) => (
                            <div key={index} className="quarter-card">
                                <h4>{quarter.quarter}</h4>
                                <ul>
                                    {quarter.courses.map((course, idx) => (
                                        <li key={idx}>
                                            {course.id} - {course.name} - {course.credits || 0} CR
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Credits:</strong> {quarter.courses.reduce((sum, c) => sum + (c.credits || 0), 0)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleGenerator;

















