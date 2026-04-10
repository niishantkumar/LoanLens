import React, { useEffect, useState } from 'react';
import client from '../../utils/api.js';
import LoanForm from './LoanForm';
import LoanTable from './LoanTable';

function Dashboard() {
    const [loans, setLoans] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // 🔄 Key to refreshing the list

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await client.get("/user/loan/all"); // Adjust path if needed
                if (res.data.success) {
                    setLoans(res.data.loans);
                }
            } catch (err) {
                console.error("Error fetching loans:", err);
            }
        };

        fetchLoans();
    }, [refreshTrigger]);

    return (
        <div className="container-fluid px-4 py-3">
            <h2 className="mb-4 fw-bold" style={{ color: "#002B49" }}>My Loans</h2>
            <div className="row g-4">
                <div className="col-lg-4">
                    {/* Pass function to increment trigger */}
                    <LoanForm onLoanAdded={() => setRefreshTrigger(prev => prev + 1)} />
                </div>

                <div className="col-lg-8">
                    <LoanTable loans={loans} onLoanDeleted={() => setRefreshTrigger(prev => prev + 1)} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;