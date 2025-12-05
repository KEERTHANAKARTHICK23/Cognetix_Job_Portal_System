import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApplications: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { 'x-auth-token': token },
                });
                setStats(statsRes.data);

                const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { 'x-auth-token': token },
                });
                setUsers(usersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="container" style={{ marginTop: '40px' }}>
            <h1>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalUsers}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Jobs</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalJobs}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Applications</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalApplications}</p>
                </div>
            </div>

            <h2 style={{ marginTop: '40px' }}>Manage Users</h2>
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Role</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '10px' }}>{user.name}</td>
                                <td style={{ padding: '10px' }}>{user.email}</td>
                                <td style={{ padding: '10px' }}>{user.role}</td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
