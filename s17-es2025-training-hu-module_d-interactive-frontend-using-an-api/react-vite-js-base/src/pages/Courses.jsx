import React, { useEffect, useState } from 'react'
import { coursesApi } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

const Courses = () => {
    const [courseData, setCourseData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        getCourseData();
    }, []);

    const getCourseData = async () => {
        try {
            const { data } = await coursesApi.getAll();
            setCourseData(data.courses);
        } catch (err) {
            console.error(err);
        }
    };

    const enrollCourse = async (id) => {
        try {
            await coursesApi.enroll(id);
            viewCourse(id);
        } catch (err) {
            console.error(err);
        }
    };

    const viewCourse = async (id) => {
        navigate(`/courses/${id}`);
    };

    return (
        <>
            <div className="dashboard-section">
                <h1 className='title'>Course catalog</h1>
                <p>Discover and enroll in courses to advance your skills</p>
                <input className='search-box' type='text' placeholder='Search courses by title or description...' />
            </div>
            <div className="courses">
                {courseData && courseData.map((course) => {
                    return <div key={course.id} className="dashboard-section">
                        <h2 className="title">{course.title}</h2>
                        <hr />
                        <p className='description'>{course.description}</p>
                        <div className="stats">
                            <div className="dashboard-section">
                                <h3 className="title">Difficulty</h3>
                                <div className="value">{course.difficulty}</div>
                            </div>
                            <div className="dashboard-section">
                                <h3 className="title">Chapters</h3>
                                <div className="count">{course.totalChapters}</div>
                            </div>
                            <div className="dashboard-section">
                                <h3 className="title">Total credits</h3>
                                <div className="count">{course.totalCredits} CREDITS</div>
                            </div>
                        </div>
                        {course.isEnrolled ?
                            <button className="button" onClick={() => {viewCourse(course.id)}}>Continue learning</button> :
                            <button className="button" onClick={() => {enrollCourse(course.id)}}>Enroll now</button>
                        }
                    </div>
                })}
            </div>
        </>
    )
}

export default Courses