import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../contexts/AppContext'
import { mentorsApi } from '../api/api';

const SessionStats = ({session}) => {
    return <div className="stats">
        <div className="dashboard-section">
            <h4 className="title">Date</h4>
            <p className='value'>{session.sessionDate}</p>
        </div>
        <div className="dashboard-section">
            <h4 className="title">Time</h4>
            <p className='value'>{session.sessionDate}</p>
        </div>
        <div className="dashboard-section">
            <h4 className="title">Duration</h4>
            <p className='value'>{session.durationMinutes} Minutes</p>
        </div>
        <div className="dashboard-section">
            <h4 className="title">Cost</h4>
            <p className='value'>{session.creditCost} Credits</p>
        </div>
    </div>
}

const Mentors = () => {
    const { userData, getUser } = useContext(AppContext)
    const [mentorData, setMentorData] = useState();

    useEffect(() => {
        getMentorData();
    }, []);

    const getMentorData = async () => {
        try {
            const { data } = await mentorsApi.getSessions();
            console.log(data);
            setMentorData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const bookSession = async (id) => {
        try {
            await mentorsApi.bookSession(id);
            getMentorData();
            getUser()
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="dashboard-section">
                <h1 className="title">Mentor session booking</h1>
                <p className="description">Book one—on—one sessions with expert mentors to accelerate your learning</p>
                <div className='dashboard-section'>Your Current Balance: {userData.user.creditBalance} Credits</div>
            </div>
            {
                mentorData && <div className="dashboard-section available-sessions">
                    <h2 className="title">Available sessions</h2>
                    <div className="session-list">
                        {mentorData.map((session) => {
                            return <div key={session.id} className="dashboard-section">
                                <h3 className='title'>{session.mentorName}</h3>
                                <hr />
                                <p><strong>Expertise: </strong>{session.expertise}</p>
                                <p>{session.experienceLevel}</p>
                                <SessionStats session={session} />
                                <button className='view-profile' disabled>View profile</button>
                                {session.isAvailable ? <>
                                    {session.creditCost > userData.user.creditBalance ? <>
                                        <div className="session-booked">
                                            Not enough credits
                                        </div>
                                    </> : <>
                                        <button className='book-session' onClick={() => {bookSession(session.id)}}>Book session</button>
                                    </>}
                                </> : <>
                                    <div className="session-booked">
                                        Session booked
                                    </div>
                                </>}
                            </div>
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default Mentors