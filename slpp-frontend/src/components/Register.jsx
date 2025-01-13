import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        date_of_birth: '',
        password: '',
        bio_id: '',
    });

    const navigate = useNavigate(); // Hook para redirigir

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/slpp/register', formData);
            alert('Registration successful! Redirecting to login...');
            navigate('/login'); // Redirigir al login
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <Typography variant="h4" gutterBottom>Register</Typography>
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
                        name="full_name"
                        label="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        fullWidth
                        required
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        name="date_of_birth"
                        label="Date of Birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        fullWidth
                        required
                        style={{ marginTop: '10px' }}
                        InputLabelProps={{ shrink: true }}
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
                    <TextField
                        name="bio_id"
                        label="BioID"
                        value={formData.bio_id}
                        onChange={handleChange}
                        fullWidth
                        required
                        style={{ marginTop: '10px' }}
                    />
                    <Button type="submit" variant="contained" className="auth-button" fullWidth>
                        Register
                    </Button>
                </form>
                <Typography variant="body2" style={{ marginTop: '20px' }}>
                    Already have an account? <a href="/login">Login</a>
                </Typography>
            </div>
        </div>
    );
};

export default Register;
