import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
    });
    const [message, setMessage] = useState('');

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/jobs/employer/myjobs', {
                headers: { 'x-auth-token': token },
            });
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/jobs', formData, {
                headers: { 'x-auth-token': token },
            });
            setMessage('Job posted successfully!');
            setFormData({ title: '', description: '', company: '', location: '', salary: '' });
            fetchJobs();
        } catch (err) {
            setMessage('Failed to post job');
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1>Employer Dashboard</h1>

            <div className="card" style={{ marginTop: '20px', marginBottom: '40px' }}>
                <h2>Post a New Job</h2>
                {message && <div style={{ marginBottom: '10px', color: 'green' }}>{message}</div>}
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Job Title</label>
                        <input type="text" name="title" value={formData.title} onChange={onChange} required />
                    </div>
                    <div className="input-group">
                        <label>Company Name</label>
                        <input type="text" name="company" value={formData.company} onChange={onChange} required />
                    </div>
                    <div className="input-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={onChange} required />
                    </div>
                    <div className="input-group">
                        <label>Salary</label>
                        <input type="text" name="salary" value={formData.salary} onChange={onChange} required />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={onChange} required rows="5"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Post Job</button>
                </form>
            </div>

            <h2>My Job Postings</h2>
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {jobs.map((job) => (
                    <div key={job._id} className="card">
                        <h3>{job.title}</h3>
                        <p><strong>Status:</strong> {job.status}</p>
                        <p><strong>Applications:</strong> (Implement view applications feature)</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployerDashboard;
