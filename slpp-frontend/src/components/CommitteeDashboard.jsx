import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Card, CardContent, Grid, Box, Tooltip } from '@mui/material';

const CommitteeDashboard = ({ token }) => {
    const [petitions, setPetitions] = useState([]);
    const [threshold, setThreshold] = useState('');
    const [response, setResponse] = useState('');
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

    return (
        <Box sx={{ padding: '30px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                Petitions Committee Dashboard
            </Typography>

            {/* Update threshold */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    alignItems: 'center',
                    marginBottom: '30px',
                }}
            >
                <TextField
                    label="Signature Threshold"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    variant="outlined"
                    sx={{ width: '250px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={updateThreshold}
                    sx={{
                        backgroundColor: '#2575fc',
                        color: 'white',
                        '&:hover': { backgroundColor: '#6a11cb' },
                    }}
                >
                    Update Threshold
                </Button>
            </Box>

            <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>
                Open Petitions: {openCount} | Closed Petitions: {closedCount}
            </Typography>

            {/* List all petitions */}
            <Grid container spacing={3}>
                {petitions.map((petition) => (
                    <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                        <Card
                            sx={{
                                backgroundColor: petition.status === 'closed' ? '#f8d7da' : '#d1ecf1',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                                            value={response}
                                            onChange={(e) => setResponse(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            sx={{ marginBottom: '10px' }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ marginBottom: '10px' }}
                                            onClick={() => closePetition(petition.petition_id)}
                                        >
                                            Close Petition
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
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
    );
};

export default CommitteeDashboard;
