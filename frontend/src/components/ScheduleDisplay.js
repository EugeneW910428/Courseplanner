import React from 'react';

const ScheduleDisplay = ({ schedule }) => {
    if (!schedule || schedule.length === 0) {
        return <div>No schedule generated.</div>;
    }

    return (
        <div>
            <h2>Academic Year 2023-2024</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {schedule.map((quarter, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        <h3>{quarter.quarter}</h3>
                        <ul>
                            {quarter.courses.map((course, idx) => (
                                <li key={idx}>
                                    {course.name} - {course.credits} CR
                                </li>
                            ))}
                        </ul>
                        <p>
                            <strong>Credits:</strong> {quarter.courses.reduce((sum, course) => sum + (course.credits || 0), 0)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleDisplay;
