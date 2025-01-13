import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Card, CardContent, Grid, Box } from '@mui/material';

const CommitteeDashboard = ({ token }) => {
    const [petitions, setPetitions] = useState([]);
    const [threshold, setThreshold] = useState('');
    const [response, setResponse] = useState('');
    const [selectedPetition, setSelectedPetition] = useState(null);
    const [openCount, setOpenCount] = useState(0);
    const [closedCount, setClosedCount] = useState(0);


    useEffect(() => {
        axios.get('http://localhost:5000/slpp/petitions?status=open', {
            headers: { Authorization: token },
        })
            .then((res) => setOpenCount(res.data.length))
            .catch((err) => console.error(err));
    
        axios.get('http://localhost:5000/slpp/petitions?status=closed', {
            headers: { Authorization: token },
        })
            .then((res) => setClosedCount(res.data.length))
            .catch((err) => console.error(err));
    }, [token]);
    useEffect(() => {
        // Fetch all petitions for the admin
        axios.get('http://localhost:5000/slpp/admin/petitions', {
            headers: { Authorization: token },
        })
            .then((res) => setPetitions(res.data))
            .catch((err) => console.error(err));


        axios.get('http://localhost:5000/slpp/threshold', {
            headers: { Authorization: token },
        })
            .then((res) => setThreshold(res.data.threshold))
            .catch((err) => console.error(err));
            console.log(threshold)
    }, [token]);


    const updateThreshold = () => {
        axios.post(
            'http://localhost:5000/slpp/threshold',
            { threshold },
            { headers: { Authorization: token } }
        )
            .then((res) => alert(res.data.message))
            .catch((err) => alert(err.response?.data?.error || 'Something went wrong'));
            console.log(threshold)
    };
    const deletePetition = (id) => {
        axios.delete(`http://localhost:5000/slpp/petitions/${id}`, {
            headers: { Authorization: token },
        })
        .then((res) => {
            alert(res.data.message);
            setPetitions(petitions.filter((petition) => petition.petition_id !== id));
        })
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

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Petitions Committee Dashboard</Typography>

            {/* Update threshold */}
            <Box sx={{ marginBottom: '20px' }}>
                <TextField
                    label="Signature Threshold"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    variant="outlined"
                    sx={{ marginRight: '10px', width: '200px' }}
                />
                <Button variant="contained" color="primary" onClick={updateThreshold}>
                    Update Threshold
                </Button>
            </Box>

            <Typography variant="h6">Open Petitions: {openCount}</Typography>
            <Typography variant="h6">Closed Petitions: {closedCount}</Typography>
            {/* List all petitions */}
            <Grid container spacing={3}>
                {petitions.map((petition) => (
                    <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{petition.title}</Typography>
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
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ marginTop: '10px' }}
                                            onClick={() => closePetition(petition.petition_id)}
                                        >
                                            Close Petition
                                        </Button>
                                        <Button
    variant="contained"
    color="error"
    style={{ marginTop: '10px' }}
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
