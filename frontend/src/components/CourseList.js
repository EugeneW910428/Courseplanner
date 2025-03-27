// components/CourseList.js
import React, { useEffect, useState } from 'react';
import { getCoreCourses, getElectives } from '../services/courseService';

const CourseList = ({ careerAspiration }) => {
  const [coreCourses, setCoreCourses] = useState([]);
  const [electives, setElectives] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coreData = await getCoreCourses();
        setCoreCourses(coreData);
        if (careerAspiration) {
          const electiveData = await getElectives(careerAspiration);
          setElectives(electiveData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [careerAspiration]);

  return (
    <div>
      <h2>Core Courses</h2>
      <ul>
        {coreCourses.map((course) => (
          <li key={course._id}>
            {course.name} ({course.credits} credits)
          </li>
        ))}
      </ul>
      <h2>Electives</h2>
      <ul>
        {electives.map((course) => (
          <li key={course._id}>
            {course.name} ({course.credits} credits)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
