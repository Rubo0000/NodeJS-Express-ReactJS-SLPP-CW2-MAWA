
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const Login = ({ setToken, setUser }) => { // Ahora usamos setUser directamente desde App
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/slpp/login', formData);
            console.log(response.data);
            alert(response.data.message);
            setToken(response.data.token); // Guardar el token
            setUser(response.data.user); // Guardar el usuario completo (email y rol)
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
        
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <Typography variant="h4">Login</Typography>
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
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;
