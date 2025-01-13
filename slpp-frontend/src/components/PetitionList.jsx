import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const PetitionList = ({ token }) => {
    const [petitions, setPetitions] = useState([]);

    useEffect(() => {
        // Fetch all petitions from the backend
        axios.get('http://localhost:5000/slpp/petitions')
            .then((response) => {
                setPetitions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching petitions:', error.response ? error.response.data : error.message);
            });
    }, []);

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
            alert(response.data.message);
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
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
            {petitions.map((petition) => (
                <Grid item xs={12} sm={6} md={4} key={petition.petition_id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{petition.title}</Typography>
                            <Typography variant="body2">{petition.content}</Typography>
                            <Typography variant="caption">Status: {petition.status}</Typography>
                            <Typography variant="caption"> | Signatures: {petition.signatures}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '10px' }}
                                onClick={() => handleSign(petition.petition_id)}
                                disabled={petition.status === 'closed'}
                            >
                                Sign Petition
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PetitionList;
