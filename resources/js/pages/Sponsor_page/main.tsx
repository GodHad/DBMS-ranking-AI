import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Main = () => {
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false); // For the create/update sponsor dialog
    const [isEdit, setIsEdit] = useState<boolean>(false); // To toggle between create and edit
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        link: '',
        banner_file: null,
        logo_file: null,
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const [openDelete, setOpenDelete] = useState<boolean>(false); // For the delete confirmation dialog
    const [sponsorToDelete, setSponsorToDelete] = useState<any>(null); // The sponsor to be deleted

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await axios.get(`/api/get-sponsors`);
                if (response.data.success) {
                    setSponsors(response.data.sponsors);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'banner_file' || name === 'logo_file') {
            setFormData({ ...formData, [name]: files ? files[0] : null });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setFormErrors({}); // Clear any previous errors

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('link', formData.link);
        if (formData.banner_file) formDataToSend.append('banner_file', formData.banner_file as File);
        if (formData.logo_file) formDataToSend.append('logo_file', formData.logo_file as File);

        try {
            if (isEdit) {
                // Update existing sponsor
                const response = await axios.post(`/api/update-sponsor/?id=${formData.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    const response = await axios.get(`/api/get-sponsors`);
                    if (response.data.success) {
                        setSponsors(response.data.sponsors);
                    } else {
                        setError(response.data.error);
                    }
                }
            } else {
                // Create new sponsor
                const response = await axios.post('/api/create-sponsor', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    const response = await axios.get(`/api/get-sponsors`);
                    if (response.data.success) {
                        setSponsors(response.data.sponsors);
                    } else {
                        setError(response.data.error);
                    }
                }
            }
            setOpen(false); // Close the dialog
        } catch (error) {
            setFormErrors({ general: 'Failed to submit sponsor' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClickOpen = () => {
        setIsEdit(false);
        setFormData({ id: '', name: '', link: '', banner_file: null, logo_file: null });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleEdit = (sponsor: any) => {
        setIsEdit(true);
        setFormData({
            id: sponsor.id,
            name: sponsor.name,
            link: sponsor.link,
            banner_file: null,
            logo_file: null,
        });
        setOpen(true);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/delete-sponsor/?id=${sponsorToDelete.id}`);
            if (response.data.success) {
                setSponsors(sponsors.filter((sponsor) => sponsor.id !== sponsorToDelete.id));
                setOpenDelete(false);
            }
        } catch (error) {
            console.error('Failed to delete sponsor');
        }
    };

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
            {/* Sponsor Page Title and Create Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            color: '#1976d2',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}
                    >
                        Sponsor Page
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
                        Discover our valuable sponsors and partners
                    </Typography>
                </Box>
                {/* Create Sponsor Button */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                    sx={{
                        borderRadius: '4px',
                        backgroundColor: '#007bff',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                        },
                    }}
                >
                    Create Sponsor
                </Button>
            </Box>

            {/* Sponsor Cards */}
            {sponsors.length > 0 ? (
                <Grid container spacing={4}>
                    {sponsors.map((sponsor) => (
                        <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={`/storage/${sponsor.banner}`}
                                    alt={`${sponsor.name} banner`}
                                />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`/storage/${sponsor.logo_url}`}
                                                alt={`${sponsor.name} logo`}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{sponsor.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                Link: <a href={sponsor.link} target="_blank" rel="noopener noreferrer">{sponsor.link}</a>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                Created at: {new Date(sponsor.created_at).toLocaleDateString()}
                                            </Typography>
                                            {/* Update and Delete Buttons */}
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => handleEdit(sponsor)}
                                                sx={{ mt: 2 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                onClick={() => {
                                                    setSponsorToDelete(sponsor);
                                                    setOpenDelete(true);
                                                }}
                                                color="error"
                                                sx={{ mt: 2 }}
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>No sponsor data available</Typography>
            )}

            {/* Create/Update Sponsor Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>{isEdit ? 'Update Sponsor' : 'Create Sponsor'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Sponsor Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    <TextField
                        margin="dense"
                        label="Website Link"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!formErrors.link}
                        helperText={formErrors.link}
                    />
                    <TextField
                        margin="dense"
                        type="file"
                        value={formData.banner}
                        label="Banner File"
                        name="banner_file"
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        type="file"
                        value={formData.logo_url}
                        label="Logo File"
                        name="logo_file"
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth>
                <DialogTitle>Delete Sponsor</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {sponsorToDelete?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Main;
