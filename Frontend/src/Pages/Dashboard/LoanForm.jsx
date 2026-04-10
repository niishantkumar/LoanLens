import React, { useState } from 'react';
import client from '../../utils/api.js';

function LoanForm({ onLoanAdded }) {


    const [form, setForm] = useState({
        loanName: '',
        category: 'Personal',
        amount: '',
        rate: '',
        months: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        let newErrors = {};
        if (!form.loanName) newErrors.loanName = "Name is required";
        if (!form.amount || form.amount <= 0) newErrors.amount = "Enter valid amount";
        if (!form.rate || form.rate <= 0) newErrors.rate = "Enter valid rate";
        if (!form.months || form.months <= 0) newErrors.months = "Enter duration";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

        try {
            const res = await client.post("/user/loan/add", form);
            if (res.data.success) {
                onLoanAdded();
                setForm({ loanName: '', category: 'Personal', amount: '', rate: '', months: '' });
            }
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Add New Loan</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small fw-bold">Loan Nickname</label>
                    <input
                        name="loanName"
                        className={`form-control ${errors.loanName ? 'is-invalid' : ''}`}
                        value={form.loanName}
                        onChange={handleChange}
                        placeholder="e.g. SBI Home Loan"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">Category</label>
                    <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                        <option value="Personal">Personal</option>
                        <option value="Home">Home</option>
                        <option value="Car">Car</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option> {/* ✅ Added Other option */}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label small fw-bold">Amount</label>

                        <div className="input-group">
                            <span className="input-group-text">₹</span>
                            <input
                                name="amount"
                                type="number"
                                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                value={form.amount}
                                onChange={handleChange}
                            />
                            {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label small fw-bold">Rate (%)</label>
                        <div className="input-group">
                            <input
                                name="rate"
                                type="number"
                                step="0.1"
                                className={`form-control ${errors.rate ? 'is-invalid' : ''}`}
                                value={form.rate}
                                onChange={handleChange}
                            />
                            <span className="input-group-text">%</span>
                            {errors.rate && <div className="invalid-feedback d-block">{errors.rate}</div>}
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">Tenure (Months)</label>
                    <input
                        name="months"
                        type="number"
                        className={`form-control ${errors.months ? 'is-invalid' : ''}`}
                        value={form.months}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Create Loan</button>
            </form>
        </div>
    );
}

export default LoanForm;