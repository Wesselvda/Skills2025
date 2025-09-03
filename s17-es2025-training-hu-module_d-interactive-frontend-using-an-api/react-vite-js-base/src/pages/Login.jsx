import React, { useState } from 'react';
import { authApi } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await authApi.login(form);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='container auth-container'>
            <h1>Welcome back</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='input-wrapper'>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id='email'
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                        required
                    />
                </div>
                <div className='input-wrapper'>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id='password'
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder='Enter your password'
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="bottom-text">
                Registration is free! <Link to='/register'>CREATE AN ACCOUNT</Link>
            </div>
        </div>
    );
}

export default Login;
