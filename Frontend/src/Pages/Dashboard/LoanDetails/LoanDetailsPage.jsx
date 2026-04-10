import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../../utils/api.js';
import { calculateAmortization, getSmartInsight } from '../../../utils/loanLogic.js';
import { generateLoanPDF } from '../../../utils/pdfGenerator.js';


function LoanDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [extraPay, setExtraPay] = useState(0);
    const [projection, setProjection] = useState(null);
    const [originalStats, setOriginalStats] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);

    // Calculate insight based on current loan and original stats
    const insight = getSmartInsight(loan, originalStats);

    useEffect(() => {
        const fetchLoanData = async () => {
            try {
                const res = await client.get(`/user/loan/${id}`);
                if (res.data.success) {
                    const loanData = res.data.loan;
                    setLoan(loanData);

                    const base = calculateAmortization(loanData.amount, loanData.rate, loanData.emi, 0);
                    setProjection(base);
                    setOriginalStats(base);
                }
            } catch (err) {
                console.error("Error fetching loan details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLoanData();
    }, [id]);

    const handleSliderChange = (val) => {
        setExtraPay(val);
        const result = calculateAmortization(loan.amount, loan.rate, loan.emi, val);
        setProjection(result);
    };

    const handleApplyChanges = async () => {
        if (extraPay <= 0) return alert("Please select an extra payment amount first.");
        const newPrincipal = loan.amount - extraPay;

        if (window.confirm(`This will permanently reduce your loan principal to ₹${newPrincipal.toLocaleString('en-IN')}. Proceed?`)) {
            try {
                const res = await client.put(`/user/loan/update/${id}`, {
                    ...loan,
                    amount: newPrincipal
                });

                if (res.data.success) {
                    alert("Payment Applied! Your loan balance has been updated.");
                    window.location.reload();
                }
            } catch (err) {
                console.error("Update error:", err);
                alert("Failed to update loan.");
            }
        }
    };

    if (loading) return <div className="text-center p-5 mt-5"><h4>Calculating Projections...</h4></div>;
    if (!loan || !originalStats) return <div className="text-center p-5 mt-5"><h4>Loan not found.</h4></div>;

    const monthsSaved = originalStats.tenureMonths - projection.tenureMonths;
    const interestSaved = originalStats.totalInterest - projection.totalInterest;

    return (
        <div className="container py-4">
            {/* --- HEADER --- */}
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <button className="btn btn-link p-0 text-decoration-none mb-2" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left"></i> Back to Dashboard
                    </button>
                    <h2 className="fw-bold m-0">{loan.loanName}</h2>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle mt-2">
                        {loan.category} Loan
                    </span>
                </div>
                <button className="btn btn-outline-success" onClick={() => generateLoanPDF(loan, projection)}>
                    <i className="bi bi-printer me-2"></i> Print PDF
                </button>
            </div>

            <div className="row g-4">
                {/* --- LEFT: AI INSIGHT & SLIDER --- */}
                <div className="col-lg-7">

                    {/* Updated AI Recommendation Box with Tiered Logic */}
                    {insight && (
                        <div className="card border-0 shadow-sm p-4 mb-4" style={{ background: "linear-gradient(to right, #dbeafe, #ffe4e6)", borderRadius: "15px" }}>
                            <div className="d-flex align-items-center flex-wrap flex-md-nowrap">
                                <div className="flex-shrink-0 me-3 mb-3 mb-md-0">
                                    <span className="display-6">
                                        {insight.type === 'danger' ? '🆘' : '🤖'}
                                    </span>
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1" style={{ color: "#002B49" }}>{insight.title}</h5>
                                    <p className="mb-0 text-secondary" style={{ fontSize: "0.95rem" }}>
                                        {insight.text} Paying <strong>₹{insight.extra.toLocaleString('en-IN')}</strong> extra today
                                        saves <strong>{insight.impact.monthsSaved} months</strong> and <strong>₹{insight.impact.moneySaved.toLocaleString('en-IN')}</strong> in total interest.
                                    </p>
                                </div>
                                <div className="ms-md-3 mt-3 mt-md-0 w-100 w-md-auto text-end">
                                    <button
                                        className="btn btn-white fw-bold shadow-sm px-3 py-2 border"
                                        style={{ backgroundColor: "#fff", borderRadius: "10px", color: "#002B49" }}
                                        onClick={() => handleSliderChange(insight.extra)}
                                    >
                                        Apply Goal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Simulation Slider Card */}
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-4">Simulation: One-Time Extra Payment</h5>
                        <div className="px-2">
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max={loan.amount / 2}
                                step="1000"
                                value={extraPay}
                                onChange={(e) => handleSliderChange(e.target.value)}
                            />
                            <div className="d-flex justify-content-between mt-2 text-muted small">
                                <span>₹0</span>
                                <span className="fw-bold text-primary fs-5">₹{Number(extraPay).toLocaleString('en-IN')}</span>
                                <span>₹{(loan.amount / 2).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="mt-4">
                                <button
                                    className="btn btn-primary w-100 fw-bold py-2 shadow-sm"
                                    disabled={extraPay <= 0}
                                    onClick={handleApplyChanges}
                                >
                                    Apply Extra Payment to Principal
                                </button>
                                <p className="text-center text-muted small mt-2">
                                    <i className="bi bi-info-circle me-1"></i>
                                    This will update your actual loan balance in the database.
                                </p>
                            </div>
                        </div>

                        <div className="row mt-5 g-3 text-center">
                            <div className="col-6">
                                <div className="p-3 bg-light rounded-3">
                                    <small className="text-muted d-block mb-1">New Tenure</small>
                                    <h4 className="fw-bold m-0">{projection.tenureMonths} Months</h4>
                                    {monthsSaved > 0 && <small className="text-success fw-bold">-{monthsSaved} months early</small>}
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 bg-light rounded-3">
                                    <small className="text-muted d-block mb-1">Total Interest</small>
                                    <h4 className="fw-bold m-0">₹{projection.totalInterest.toLocaleString('en-IN')}</h4>
                                    {interestSaved > 0 && <small className="text-success fw-bold">Save ₹{interestSaved.toLocaleString('en-IN')}</small>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: LOAN SUMMARY --- */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4 h-100">
                        <h5 className="fw-bold mb-4">Loan Summary</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between px-0 py-3">
                                <span className="text-muted">Principal Amount</span>
                                <span className="fw-bold">₹{loan.amount.toLocaleString('en-IN')}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between px-0 py-3">
                                <span className="text-muted">Interest Rate</span>
                                <span className="fw-bold">{loan.rate}% p.a.</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between px-0 py-3">
                                <span className="text-muted">Monthly EMI</span>
                                <span className="fw-bold text-primary">₹{loan.emi.toLocaleString('en-IN')}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between px-0 py-3 border-0">
                                <span className="text-muted">Total Repayment</span>
                                <span className="fw-bold">₹{projection.totalAmount.toLocaleString('en-IN')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- REPAYMENT SCHEDULE TABLE --- */}
            <div className="card border-0 shadow-sm mt-5 overflow-hidden">
                <div className="card-header bg-white py-3">
                    <h5 className="fw-bold m-0">Repayment Schedule</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Month</th>
                                <th>Interest</th>
                                <th>Principal Paid</th>
                                <th className="pe-4 text-end">Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(showAll ? projection.schedule : projection.schedule.slice(0, 12)).map((row) => (
                                <tr key={row.month}>
                                    <td className="ps-4 fw-semibold">Month {row.month}</td>
                                    <td className="text-danger">₹{row.interest.toLocaleString('en-IN')}</td>
                                    <td className="text-success">₹{row.principal.toLocaleString('en-IN')}</td>
                                    <td className="pe-4 text-end fw-bold">₹{row.closingBalance.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {projection.schedule.length > 12 && (
                    <div className="card-footer bg-white text-center py-3 border-0">
                        <button className="btn btn-link text-decoration-none fw-bold" onClick={() => setShowAll(!showAll)}>
                            {showAll ? "Show Less" : `Show All ${projection.schedule.length} Months`}
                            <i className={`bi bi-chevron-${showAll ? 'up' : 'down'} ms-2`}></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoanDetails;