import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        date_of_birth: '',
        password: '',
        bio_id: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/slpp/register', formData);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.error || 'Something went wrong');
        }
    };

    return (
        <div>
            <Typography variant="h4">Register</Typography>
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
                />
                <TextField
                    name="date_of_birth"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date_of_birth}
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
                />
                <TextField
                    name="bio_id"
                    label="BioID"
                    value={formData.bio_id}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
            </form>
        </div>
    );
};

export default Register;
