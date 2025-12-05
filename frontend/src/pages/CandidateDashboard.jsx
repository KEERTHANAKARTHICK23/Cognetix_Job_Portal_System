import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
                    headers: { 'x-auth-token': token },
                });
                setApplications(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1>My Applications</h1>
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                {applications.map((app) => (
                    <div key={app._id} className="card">
                        <h3>{app.jobId.title}</h3>
                        <p><strong>Company:</strong> {app.jobId.company}</p>
                        <p><strong>Status:</strong> <span style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            backgroundColor: app.status === 'hired' ? '#d1fae5' : app.status === 'rejected' ? '#fee2e2' : '#e0f2fe',
                            color: app.status === 'hired' ? '#065f46' : app.status === 'rejected' ? '#991b1b' : '#075985'
                        }}>{app.status.toUpperCase()}</span></p>
                        <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
                {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
            </div>
        </div>
    );
};

export default CandidateDashboard;
