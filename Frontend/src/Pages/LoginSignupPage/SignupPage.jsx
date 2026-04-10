import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setServerError("");
    };

    const validate = () => {
        let newErrors = {};

        if (!form.username) newErrors.username = "Username is required";

        if (!form.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Invalid email";

        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 5)
            newErrors.password = "Password must be at least 5 characters";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const res = await signup(form);

        if (!res.success) {
            setServerError(res.message);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-lg border-0 p-4">

                        <div className="text-center mb-4">
                            <h2 className="fw-bold" style={{ color: "#002B49" }}>Create Account</h2>
                            <p className="text-muted">Join LoanLens to start tracking your loans</p>
                        </div>

                        {serverError && (
                            <div className="alert alert-danger py-2 small text-center">{serverError}</div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted">@</span>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="yourhandle"
                                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback d-block">{errors.username}</div>
                                    )}
                                </div>
                            </div>


                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback d-block">{errors.email}</div>
                                )}
                            </div>


                            <div className="mb-4">
                                <label className="form-label small fw-bold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 fw-bold py-2"
                            >
                                Signup
                            </button>

                        </form>

                        <div className="text-center mt-4">
                            <p className="small text-muted mb-0">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;