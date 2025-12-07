import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:8081/api/users/all');
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                // Filter for users with the 'Candidate' role
                const candidateUsers = Array.isArray(data)
                    ? data.filter(user =>
                        user.roles && user.roles.some(role => role.roleName === 'Candidate')
                    )
                    : [];
                setCandidates(candidateUsers);
                setError('');
            } catch (e) {
                console.error(e);
                setError('Failed to load candidates');
                toast.error('Failed to load candidates');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    if (loading) return <div className="loading">Loading candidates...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-users-page">
            <h1>Candidates</h1>
            {candidates.length === 0 ? (
                <div className="empty">No candidates found</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate) => (
                            <tr key={candidate.userId}>
                                <td>{candidate.userId}</td>
                                <td>{candidate.fullName}</td>
                                <td>{candidate.email}</td>
                                <td className="actions">
                                    <Link className="secondary" to={`/admin/users/${candidate.userId}/profile`}>View Profile</Link>
                                    {candidate.resumeFileName ? (
                                        <a
                                            href={`http://localhost:8081/api/user-profiles/${candidate.userId}/resume`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="primary"
                                            download
                                        >
                                            Download Resume
                                        </a>
                                    ) : (
                                        <span>No Resume</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CandidateList;
