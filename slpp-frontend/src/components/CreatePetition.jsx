import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const CreatePetition = ({ token }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/slpp/petitions',
                formData,
                {
                    headers: {
                        Authorization: token // Envía el token en los headers
                    }
                }
            );
        } catch (error) {
            alert(error.response.data.error || 'Something went wrong');
        }
    };

    return (
        <div>
            <Typography variant="h4">Create Petition</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="content"
                    label="Content"
                    value={formData.content}
                    onChange={handleChange}
                    fullWidth
                    required
                    style={{ marginTop: '10px', marginBottom: '20px' }}
                />
                <Button type="submit" variant="contained" color="primary"  style={{ marginTop: '20px', marginBottom: '20px' }}>
                    Create Petition
                </Button>
            </form>
        </div>
    );
};

export default CreatePetition;
