import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resumeLink, setResumeLink] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
                setJob(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'candidate') {
            setMessage('Only candidates can apply for jobs.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/applications',
                { jobId: id, resumeLink },
                { headers: { 'x-auth-token': token } }
            );
            setMessage('Application submitted successfully!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Application failed');
        }
    };

    if (!job) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <div className="card">
                <h1>{job.title}</h1>
                <h3 style={{ color: 'var(--primary-color)' }}>{job.company}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <div style={{ margin: '20px 0' }}>
                    <h4>Job Description</h4>
                    <p>{job.description}</p>
                </div>

                {message && <div style={{ padding: '10px', backgroundColor: '#e5e7eb', borderRadius: '5px', marginBottom: '20px' }}>{message}</div>}

                {user && user.role === 'candidate' ? (
                    <form onSubmit={handleApply}>
                        <div className="input-group">
                            <label>Resume Link (Google Drive, LinkedIn, etc.)</label>
                            <input
                                type="url"
                                value={resumeLink}
                                onChange={(e) => setResumeLink(e.target.value)}
                                required
                                placeholder="https://..."
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Apply Now</button>
                    </form>
                ) : !user ? (
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Login to Apply</button>
                ) : null}
            </div>
        </div>
    );
};

export default JobDetails;
