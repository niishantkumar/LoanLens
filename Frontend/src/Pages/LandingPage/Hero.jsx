import React from 'react'
import { useNavigate } from 'react-router-dom';


function Hero() {
    const navigate = useNavigate();

    return (
        <div className='container-fluid mb-5 pb-3 pt-2'>

            <div className='row text-center mt-4'>
                <h1 className='pt-3 pb-2 fs-2 fw-bold'>
                    Take Control of Your Loans, Not the Other Way Around
                </h1>

                <p className='fs-5 fw-semibold'>
                    Stop overpaying interest, missing EMIs, and guessing your loan future.
                    Track, plan, and optimize your loans in one smart dashboard.
                </p>

                <div className="d-flex justify-content-center gap-5 mt-3">
                    <button
                        className="btn btn-outline-primary btn-lg px-4 py-2"
                        onClick={() => {
                            document.getElementById("emiDiv").scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Calculate EMI ↡
                    </button>
                    <button
                        className="btn btn-primary btn-lg px-4 py-2"
                        onClick={() => navigate("/signup")}
                    >
                        Get started →
                    </button>
                </div>
            </div>


            <div className='row mt-5 mb-3 d-flex justify-content-around bg-light p-1 pt-3 pb-3'>
                <div className='col-md-3 p-1 mt-2 mb-2'>
                    <div>
                        <h5>Smart EMI Calculator</h5>
                        <p> Instantly calculate your monthly EMI and total interest.</p>
                    </div>
                    <div>
                        <h5>Loan Dashboard</h5>
                        <p> View all your loans in one place with real-time insights.</p>
                    </div>
                    <div>
                        <h5>Amortization Schedule</h5>
                        <p> See exactly how much principal and interest you pay every month.</p>
                    </div>
                    <div>
                        <h5>Early Repayment Insights</h5>
                        <p> Find out how extra payments reduce your loan duration and save money.</p>
                    </div>

                </div>
                <div className='col-md-3 d-flex flex-column gap-4 p-1 mt-3s mb-2'>

                    <div className="card p-3 shadow-sm">
                        <h6>💰 EMI</h6>
                        <p>Quick calculations</p>
                    </div>

                    <div className="card p-3 shadow-sm">
                        <h6>📊 Dashboard</h6>
                        <p>All loans in one place</p>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default Hero