import React, { useState } from 'react';
import { authApi } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authApi.register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className='container auth-container'>
            <h1>Create account</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='input-wrapper'>
                    <label htmlFor='name'>Full name</label>
                    <input
                        type="text"
                        name="name"
                        id='name'
                        value={form.name}
                        placeholder='Enter your full name'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='input-wrapper'>
                    <label htmlFor='name'>Email address</label>
                    <input
                        type="email"
                        name="email"
                        id='name'
                        value={form.email}
                        placeholder='Enter your email'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='input-wrapper'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type="password"
                        name="password"
                        id='password'
                        value={form.password}
                        placeholder='Enter your password'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='input-wrapper'>
                    <label htmlFor='password_confirmation'>Confirm password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        id='password_confirmation'
                        value={form.password}
                        placeholder='Confirm your password'
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create account</button>
            </form>
            <div className="bottom-text">
                Already have an account? <Link to='/login'>SIGN IN HERE</Link>
            </div>
        </div>
    );
}

export default Register;
