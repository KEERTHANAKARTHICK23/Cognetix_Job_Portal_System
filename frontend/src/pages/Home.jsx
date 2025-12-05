import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Find Your Dream Job</h1>
                <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Browse thousands of job openings from top companies.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {jobs.map((job) => (
                    <div key={job._id} className="card">
                        <h3 style={{ margin: '0 0 10px 0' }}>{job.title}</h3>
                        <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{job.company}</p>
                        <p style={{ color: '#6b7280', marginBottom: '15px' }}>{job.location} • {job.salary}</p>
                        <Link to={`/jobs/${job._id}`} className="btn btn-secondary" style={{ display: 'inline-block' }}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
