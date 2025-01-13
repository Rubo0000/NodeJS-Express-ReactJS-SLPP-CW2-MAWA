import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Paper,
} from '@mui/material';

const CommitteeDashboard = ({ token }) => {
    const [petitions, setPetitions] = useState([]);
    const [threshold, setThreshold] = useState('');
    const [responses, setResponses] = useState({});
    const [openCount, setOpenCount] = useState(0);
    const [closedCount, setClosedCount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/slpp/petitions?status=open', { headers: { Authorization: token } })
            .then((res) => setOpenCount(res.data.length))
            .catch((err) => console.error(err));

        axios.get('http://localhost:5000/slpp/petitions?status=closed', { headers: { Authorization: token } })
            .then((res) => setClosedCount(res.data.length))
            .catch((err) => console.error(err));

        axios.get('http://localhost:5000/slpp/admin/petitions', { headers: { Authorization: token } })
            .then((res) => setPetitions(res.data))
            .catch((err) => console.error(err));

        axios.get('http://localhost:5000/slpp/threshold', { headers: { Authorization: token } })
            .then((res) => setThreshold(res.data.threshold))
            .catch((err) => console.error(err));
    }, [token]);

    const updateThreshold = () => {
        axios.post(
            'http://localhost:5000/slpp/threshold',
            { threshold },
            { headers: { Authorization: token } }
        )
            .then((res) => alert(res.data.message))
            .catch((err) => alert(err.response?.data?.error || 'Something went wrong'));
    };

    const closePetition = (id) => {
        const response = responses[id] || 'Default response';
 // Get the response for this petition
        axios.post(
            `http://localhost:5000/slpp/petitions/${id}/close`,
            { response },
            { headers: { Authorization: token } }
        )
            .then((res) => {
                alert(res.data.message);
                setPetitions(petitions.map((p) =>
                    p.petition_id === id ? { ...p, status: 'closed', response } : p
                ));
            })
            .catch((err) => alert(err.response?.data?.error || 'Something went wrong'));
    };

    const deletePetition = (id) => {
        axios.delete(`http://localhost:5000/slpp/petitions/${id}`, { headers: { Authorization: token } })
            .then((res) => {
                alert(res.data.message);
                setPetitions(petitions.filter((p) => p.petition_id !== id));
            })
            .catch((err) => alert(err.response?.data?.error || 'Something went wrong'));
    };

    const handleResponseChange = (id, value) => {
        setResponses({ ...responses, [id]: value });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                padding: '20px',
                marginTop: '50px',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    padding: '30px',
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '95vh',
                }}
            >
                {/* Header Section */}
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#333' }}
                >
                    Petitions Committee Dashboard
                </Typography>

                {/* Update Threshold Section */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#444' }}>
                        Open Petitions: {openCount} | Closed Petitions: {closedCount}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <TextField
                            label="Signature Threshold"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            variant="outlined"
                            sx={{ width: '200px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={updateThreshold}
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#2575fc',
                                '&:hover': { backgroundColor: '#6a11cb' },
                            }}
                        >
                            Update Threshold
                        </Button>
                    </Box>
                </Box>

                {/* Petition List Section */}
                <Box sx={{ flex: 1, overflowY: 'auto', marginTop: '20px' }}>
                    <Grid container spacing={2}>
                        {petitions.map((petition) => (
                            <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                                <Card
                                    sx={{
                                        backgroundColor:
                                            petition.status === 'closed' ? '#f8d7da' : '#d1ecf1',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.03)' },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {petition.title}
                                        </Typography>
                                        <Typography>Status: {petition.status}</Typography>
                                        <Typography>Signatures: {petition.signatures}</Typography>
                                        {petition.response && (
                                            <Typography>Response: {petition.response}</Typography>
                                        )}
                                        {petition.status === 'open' && (
                                            <Box sx={{ marginTop: '10px' }}>
                                                <TextField
                                                    label="Response"
                                                    value={responses[petition.petition_id] || ''}
                                                    onChange={(e) =>
                                                        handleResponseChange(petition.petition_id, e.target.value)
                                                    }
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    sx={{ marginBottom: '10px' }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    fullWidth
                                                    sx={{ marginBottom: '10px' }}
                                                    onClick={() => closePetition(petition.petition_id)}
                                                >
                                                    Close Petition
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    fullWidth
                                                    onClick={() => deletePetition(petition.petition_id)}
                                                >
                                                    Delete Petition
                                                </Button>
                                            </Box>
                                        )}
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

export default CommitteeDashboard;
