import React from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../utils/api';
import { generateLoanPDF } from '../../utils/pdfGenerator';
import { calculateAmortization } from '../../utils/loanLogic'; // Import the math engine

function LoanTable({ loans, onLoanDeleted }) {
    const navigate = useNavigate();

    const icons = { Home: '🏠', Car: '🚗', Education: '🎓', Personal: '💰', Other: '💸' };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const res = await client.delete(`/user/loan/delete/${id}`);
                if (res.data.success) {
                    onLoanDeleted();
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Failed to delete loan.");
            }
        }
    };


    const handlePrint = (loan) => {
        // Calculate the standard projection (baseline) for the PDF
        const projection = calculateAmortization(loan.amount, loan.rate, loan.emi, 0);
        generateLoanPDF(loan, projection);
    };

    return (
        <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-3" style={{ color: "#002B49" }}>Loan Overview</h5>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Loan Details</th>
                            <th>EMI</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <tr key={loan._id}>
                                <td>
                                    <div className="fw-bold">{icons[loan.category] || '💸'} {loan.loanName}</div>
                                    <small className="text-muted">Principal: ₹{loan.amount.toLocaleString('en-IN')}</small>
                                </td>
                                <td className="text-primary fw-bold">₹{loan.emi.toLocaleString('en-IN')}</td>
                                <td className="text-center">
                                    <div className="btn-group shadow-sm">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => navigate(`/loan/${loan._id}`)}
                                            title="View Analysis"
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handlePrint(loan)} // Trigger PDF
                                            title="Print Statement"
                                        >
                                            <i className="bi bi-printer"></i>
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(loan._id, loan.loanName)}
                                            title="Delete Loan"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {loans.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted">
                                    No loans added yet. Use the form to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoanTable;