import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
};

export const lineData = {
  labels: new Array(30),
  datasets: [
    {
      data: new Array(30).map(() => faker.datatype.number({ min: 0, max: 20 })),
      backgroundColor: '#1f2a5c',
    },
  ],
};

const Dashboard = () => {
  const { userData, setUserData } = useContext(AppContext)

  const circleData = {
    labels: ['Completed Chapters', 'Remaining Chapters'],
    datasets: [
      {
        data: [userData.stats.completedChapters, 2 - userData.stats.completedChapters], // Data not available so using sample data
        backgroundColor: [
          '#b0b6d3',
          '#1f2a5c',
        ],
        borderColor: '#181e3b',
        borderWidth: 4
      },
    ],
  };

  return (
    <div className='dashboard-section'>
      <h1 className='title'>Welcome back, {userData.user.name}</h1>
      <p className='title'>Current balance: {userData.user.creditBalance} credits</p>
      <hr />
      <div className="top-dashboard-wrapper">
        <div className="dashboard-section">
          <h2 className='count'>{userData.stats.enrolledCourses}</h2>
          <p className='description'>Enrolled courses</p>
        </div>
        <div className="dashboard-section">
          <h2 className='count'>{userData.stats.completedChapters}</h2>
          <p className='description'>Completed chapters</p>
        </div>
        <div className="dashboard-section">
          <h2 className='count'>{userData.stats.totalCreditsEarned}</h2>
          <p className='description'>Total credits earned</p>
        </div>
      </div>
      <div className="bottom-dashboard-wrapper">
        <div className="dashboard-section">
          <h2 className="title">Credit progress (last 30 days)</h2>
          <hr />
          <p>No actual data</p>
          <Line options={options} data={lineData} />
        </div>
        <div className="dashboard-section">
          <h2 className="title">Course completion status</h2>
          <hr />
          <Doughnut data={circleData} />
        </div>
        <Link to="/courses" className="dashboard-section title">Browse Courses</Link>
        <Link to="/mentors" className="dashboard-section title">Book mentor session</Link>
      </div>
    </div>
  )
}

export default Dashboard