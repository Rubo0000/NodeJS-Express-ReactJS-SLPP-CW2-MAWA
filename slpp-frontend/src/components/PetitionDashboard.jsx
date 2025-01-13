import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    MenuItem,
    Select,
    Paper,
    Box,
} from '@mui/material';

const PetitionDashboard = ({ token }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const [petitions, setPetitions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const fetchPetitions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/slpp/petitions', {
                    params: { q: searchQuery, status: filterStatus },
                });
                setPetitions(response.data);
            } catch (error) {
                console.error('Error fetching petitions:', error.response?.data || error.message);
            }
        };

        fetchPetitions();
    }, [searchQuery, filterStatus]);

    const handleSign = async (id) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/slpp/petitions/${id}/sign`,
                {},
                {
                    headers: {
                        Authorization: token, 
                    },
                }
            );
            const updatedPetitions = petitions.map((petition) =>
                petition.petition_id === id ? { ...petition, signatures: petition.signatures + 1 } : petition
            );
            setPetitions(updatedPetitions);
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/slpp/petitions',
                formData,
                {
                    headers: {
                        Authorization: token 
                    }
                }
            );
            setFormData({ title: '', content: '' });
            setPetitions([...petitions, response.data.petition]); 
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <Box
            sx={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    marginTop: '30px',
                    padding: '30px',
                    width: '90%',
                    maxWidth: '1200px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '95vh',
                }}
            >
                <Box sx={{ marginBottom: '30px', flexShrink: 0 }}>
                    <Typography variant="h4" color="black" gutterBottom align="center">
                        Create Petition
                    </Typography>
                    <form onSubmit={handleCreate}>
                        <TextField
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            fullWidth
                            required
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            name="content"
                            label="Content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            fullWidth
                            required
                            multiline
                            minRows={3}
                            sx={{ marginBottom: '20px' }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ fontWeight: 'bold', padding: '10px 0' }}
                        >
                            Create Petition
                        </Button>
                    </form>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto', 
                        marginTop: '20px',
                    }}
                >
                    <Box sx={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <TextField
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                    </Box>
                    <Grid container spacing={2}>
                        {petitions.map((petition) => (
                            <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                                <Card
                                    style={{
                                        backgroundColor: petition.status === 'open' ? '#e8f5e9' : '#fce4ec',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {petition.title}
                                        </Typography>
                                        <Typography variant="body2" style={{ marginBottom: '10px' }}>
                                            {petition.content}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Status: {petition.status}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Signatures: {petition.signatures}
                                        </Typography>
                                        <Box sx={{ marginTop: '10px' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleSign(petition.petition_id)}
                                                disabled={petition.status === 'closed'}
                                                fullWidth
                                            >
                                                Sign Petition
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default PetitionDashboard;
