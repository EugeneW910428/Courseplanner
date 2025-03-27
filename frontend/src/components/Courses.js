import React, { useEffect, useState } from 'react';
import { fetchCourses } from '../services/courseService';
import { useGlobalContext } from '../context/GlobalContext';

const Courses = () => {
    const [coreCourses, setCoreCourses] = useState([]);
    const [electiveCourses, setElectiveCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { uploadedTranscript } = useGlobalContext();

    useEffect(() => {
        const loadCourses = async () => {
            if (!uploadedTranscript) return; // Exit if no transcript is uploaded

            try {
                const formData = new FormData();
                formData.append('transcript', uploadedTranscript);

                const { completed, core, electives } = await fetchCourses(formData);
                setCompletedCourses(completed || []);
                setCoreCourses(core || []);
                setElectiveCourses(electives || []);
            } catch (error) {
                console.error('Error loading courses:', error.message);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, [uploadedTranscript]);

    if (loading) return <div>Loading courses...</div>;

    return (
        <div>
            <h2>Uploaded Transcript</h2>
            {uploadedTranscript ? (
                <p>Transcript file: {uploadedTranscript.name}</p>
            ) : (
                <p>No transcript uploaded yet.</p>
            )}

            <h2>Completed Courses</h2>
            {completedCourses.length > 0 ? (
                <ul>
                    {completedCourses.map((course, index) => (
                        <li key={index}>{course}</li>
                    ))}
                </ul>
            ) : (
                <p>No completed courses found.</p>
            )}
            <h2>Core Courses</h2>
            {coreCourses.length > 0 ? (
                <ul>
                    {coreCourses.map((course, index) => (
                        <li key={index}>{course.CourseTitleLong}</li>
                    ))}
                </ul>
            ) : (
                <p>No core courses found.</p>
         )}

            <h2>Elective Courses</h2>
            {electiveCourses.length > 0 ? (
                <ul>
                    {electiveCourses.map((course, index) => (
                        <li key={index}>{course.CourseTitleLong}</li>
                    ))}
                </ul>
            ) : (
                <p>No elective courses found.</p>
         )}
 

        </div>
    );
};

export default Courses;










