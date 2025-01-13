import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Select, MenuItem, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';

const PetitionList = ({ token }) => {
    const [petitions, setPetitions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        // Fetch petitions with filters
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
                        Authorization: token, // Ensure the user is authenticated
                    },
                }
            );
            // Optionally, refetch the petitions to update the signature count
            const updatedPetitions = petitions.map((petition) =>
                petition.petition_id === id ? { ...petition, signatures: petition.signatures + 1 } : petition
            );
            setPetitions(updatedPetitions);
        } catch (error) {
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div>
            <TextField
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                displayEmpty
                style={{ marginRight: '10px' }}
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
            </Select>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {petitions.map((petition) => (
                    <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                        <Card style={{ backgroundColor: petition.status === 'open' ? '#e8f5e9' : '#fce4ec' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{petition.title}</Typography>
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
        </div>
    );
};

export default PetitionList;
