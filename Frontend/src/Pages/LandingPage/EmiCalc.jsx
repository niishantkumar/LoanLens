import React, { useState } from 'react';
import PieChartComponent from "./PieChartComponent"; // ✅ import correct component

function LandingPage() {

    const [form, setForm] = useState({
        amount: 100000,
        rate: 7.4,
        months: 24
    });

    const [errors, setErrors] = useState({});
    const [emi, setEmi] = useState(4495);
    const [totalAmount, setTotalAmount] = useState(107880);
    const [totalinterest, setTotalInterest] = useState(7880);

    const format = (num) => Number(num).toLocaleString('en-IN');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        let newErrors = {};

        if (!form.amount) newErrors.amount = "Loan amount is required";
        if (form.amount < 0) newErrors.amount = "Invalid amount";

        if (!form.rate) newErrors.rate = "Interest rate is required";
        if (form.rate < 0) newErrors.rate = "Invalid rate";

        if (!form.months) newErrors.months = "Duration is required";
        if (form.months <= 0) newErrors.months = "Invalid duration";

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const P = Number(form.amount);
        const r = Number(form.rate) / 12 / 100;
        const n = Number(form.months);

        const emiValue =
            (P * r * Math.pow(1 + r, n)) /
            (Math.pow(1 + r, n) - 1);

        const roundedEmi = Math.round(emiValue);

        const totalAmt = roundedEmi * n;
        const totalInt = totalAmt - P;

        setEmi(roundedEmi);
        setTotalAmount(totalAmt);
        setTotalInterest(totalInt);
    };

    return (
        <div id="emiDiv" className='container-fluid border rounded bg-white shadow-sm p-4'>
            <h3 className="text-center pt-2 mb-4 fw-bold">EMI Calculator</h3>

            <div className="row justify-content-center align-items-start g-4">


                <div className="col-md-5">
                    <div className="card border-0">
                        <form onSubmit={handleSubmit}>


                            <div className="mb-3">
                                <label className="form-label fw-semibold">Loan Amount</label>
                                <div className="input-group">
                                    <span className="input-group-text">₹</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                    {errors.amount && (
                                        <div className="invalid-feedback">
                                            {errors.amount}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="mb-3">
                                <label className="form-label fw-semibold">Interest Rate (p.a)</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="rate"
                                        className={`form-control ${errors.rate ? 'is-invalid' : ''}`}
                                        value={form.rate}
                                        onChange={handleChange}
                                        placeholder="0.0"
                                    />
                                    <span className="input-group-text">%</span>
                                    {errors.rate && (
                                        <div className="invalid-feedback">
                                            {errors.rate}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="mb-4">
                                <label className="form-label fw-semibold">Duration (months)</label>
                                <input
                                    type="number"
                                    name="months"
                                    className={`form-control ${errors.months ? 'is-invalid' : ''}`}
                                    value={form.months}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                                {errors.months && (
                                    <div className="invalid-feedback">
                                        {errors.months}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
                                Calculate EMI
                            </button>

                        </form>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="card border-0 h-100 d-flex flex-column justify-content-center">

                        {/* PIE CHART */}
                        <div className="d-flex justify-content-center mb-4">
                            <PieChartComponent
                                amount={form.amount}
                                interest={totalinterest}
                            />
                        </div>


                        <div className="d-flex justify-content-center">
                            <table className="table table-sm w-100 table-borderless">
                                <tbody>
                                    <tr className="border-bottom">
                                        <th className="py-2 text-muted fw-normal">Monthly EMI</th>
                                        <td className="text-end py-2 fw-bold text-primary">₹ {format(emi)}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <th className="py-2 text-muted fw-normal">Principal Amount</th>
                                        <td className="text-end py-2 fw-semibold">₹ {format(form.amount)}</td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <th className="py-2 text-muted fw-normal">Total Interest</th>
                                        <td className="text-end py-2 fw-semibold">₹ {format(totalinterest)}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 text-muted fw-normal">Total Amount</th>
                                        <td className="text-end py-2 fw-bold">₹ {format(totalAmount)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default LandingPage;