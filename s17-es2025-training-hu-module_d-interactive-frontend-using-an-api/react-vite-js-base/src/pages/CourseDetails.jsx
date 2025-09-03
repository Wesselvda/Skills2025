import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { coursesApi } from '../api/api';
import AppContext from '../contexts/AppContext';

const CourseDetails = () => {
    const [courseData, setCourseData] = useState();
    const [completedChapters, setCompletedChapters] = useState(0);
    const [chapterProgressPercentage, setChapterProgressPercentage] = useState(0);
    const [creditProgressPercentage, setCreditProgressPercentage] = useState(0);
    const [earnedCredits, setEarnedCredits] = useState(0);
    const [totalCredits, setTotalCredits] = useState(0);
    const { id } = useParams();

    const { getUser } = useContext(AppContext);

    useEffect(() => {
        getCourseData();
    }, []);

    const getCourseData = async () => {
        try {
            const { data } = await coursesApi.getById(id);
            console.log(data.course);
            setCourseData(data.course);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsCompleted = async (chapter_id) => {
        try {
            const { data } = await coursesApi.completeChapter(id, chapter_id);
            getCourseData();
            getUser()
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (courseData) {
            let completionCount = 0;
            let totalCreditCount = 0;
            let earnedCreditCount = 0;

            courseData.chapters.forEach((chapter) => {
                totalCreditCount += chapter.credits;

                if (chapter.isCompleted) {
                    completionCount++;
                    earnedCreditCount += chapter.credits;
                }
            });

            setCompletedChapters(completionCount);
            if (completionCount && courseData.totalChapters) setChapterProgressPercentage((completionCount / courseData.totalChapters) * 100);
            setTotalCredits(totalCreditCount);
            setEarnedCredits(earnedCreditCount);
            if (earnedCreditCount && totalCreditCount) setCreditProgressPercentage((earnedCreditCount / totalCreditCount) * 100);
        }
    }, [courseData]);

    return (
        <>
            {courseData ? <>
                <div className="dashboard-section">
                    <Link to={'/courses'} className='back-button'>Back to courses</Link>
                    <h1 className='title'>{courseData.title}</h1>
                    <p className='description'>{courseData.description}</p>
                    <div className="course-stats">
                        <div className="dashboard-section">
                            <h2 className='title'>Chapter progress</h2>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${chapterProgressPercentage}%` }}></div>
                            </div>
                            <p className='description'>{completedChapters} of {courseData.totalChapters} chapters completed ({chapterProgressPercentage}%)</p>
                        </div>
                        <div className="dashboard-section">
                            <h2 className="title">Credit progress</h2>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${creditProgressPercentage}%` }}></div>
                            </div>
                            <p className='description'>{earnedCredits} of {totalCredits} credits earned ({creditProgressPercentage}%)</p>
                        </div>
                    </div>
                </div>
                {courseData.chapters.map((chapter, index) => {
                    return <div key={chapter.id} className="dashboard-section chapter">
                        <h2 className="title">Chapter {index + 1}: {chapter.title}</h2>
                        <hr />
                        <p>{chapter.description}</p>
                        <div className="credit-count">
                            {chapter.credits} credits
                        </div>
                        <button className='view-chapter' disabled>View chapter</button>
                        {chapter.isCompleted ? <>
                            <span className="chapter-completed">Chapter completed</span>
                            <button className="share-achievement">Share achievement</button>
                        </> : <>
                            <button className="mark-as-completed" onClick={() => { markAsCompleted(chapter.id) }}>Mark as completed</button>
                        </>}
                    </div>
                })}
            </> : <>
                <h1 className='title'>Loading...</h1>
            </>}
        </>
    )
}

export default CourseDetails