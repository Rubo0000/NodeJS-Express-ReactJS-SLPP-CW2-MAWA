import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const Login = ({ setToken, setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/slpp/login', formData);
            alert(response.data.message);
            setToken(response.data.token);
            setUser(response.data.user);
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                        style={{ marginTop: '10px' }}
                    />
                    <Button type="submit" variant="contained" color="primary" className="auth-button">
                        Login
                    </Button>
                </form>
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                    Don't have an account? <a href="/register" style={{ color: '#2575fc' }}>Register</a>
                </Typography>
            </div>
        </div>
    );
};

export default Login;
