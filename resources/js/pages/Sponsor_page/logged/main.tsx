import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, CircularProgress, Grid, Alert } from '@mui/material';
import axios from 'axios';

const Main = () => {
    const [sponsors, setSponsors] = useState<any[]>([]); // Store multiple sponsors
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await axios.get(`http://localhost/api/get-sponsors`);
                if (response.data.success) {
                    setSponsors(response.data.sponsors); // Expecting an array of sponsors
                } else {
                    setError(response.data.error);
                }
            } catch (err) {
                setError('Failed to fetch sponsors. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', marginTop: 5 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: 2 }}>Loading sponsors information...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ marginTop: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ marginTop: 5 }}>
            {sponsors.length > 0 ? (
                <Grid container spacing={4}>
                    {sponsors.map((sponsor) => (
                        <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={sponsor.banner}
                                    alt={`${sponsor.name} banner`}
                                />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={sponsor.logo_url}
                                                alt={`${sponsor.name} logo`}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5">{sponsor.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                Link: <a href={sponsor.link} target="_blank" rel="noopener noreferrer">{sponsor.link}</a>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                Created at: {new Date(sponsor.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6">No sponsor data available</Typography>
            )}
        </Container>
    );
};

export default Main;
