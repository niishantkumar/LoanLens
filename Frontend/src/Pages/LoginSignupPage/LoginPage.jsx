import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
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
        if (!form.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const res = await login(form);
        if (!res.success) {
            setServerError(res.message);
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center mt-5"
        >
            <div className="col-md-4">
                <div className="card shadow-lg border-0 p-4" style={{ borderRadius: "15px" }}>

                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: "#002B49" }}>Welcome Back</h2>
                        <p className="text-muted">Enter your handle and password to log in</p>
                    </div>

                    {serverError && (
                        <div className="alert alert-danger py-2 small text-center">{serverError}</div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">
                            <label className="form-label small fw-bold">Username</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-muted" id="basic-addon1">@</span>
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


                        <div className="mb-4">
                            <label className="form-label small fw-bold">Password</label>
                            <div className="input-group">
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
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-bold py-2 shadow-sm mt-2"
                            style={{ borderRadius: "8px" }}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="small text-muted mb-0">
                            New to LoanLens?{" "}
                            <Link to="/signup" className="text-primary fw-bold text-decoration-none">Create Account</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;