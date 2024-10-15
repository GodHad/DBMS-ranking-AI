import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        website_url: '',
        contact_info: '',
        description: '',
        category_id: '',
        initial_release: '',
        current_release: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch vendors from the API
    useEffect(() => {
        axios.get('/api/get-vendors')
            .then(response => {
                if (response.data.success) {
                    setVendors(response.data.vendors);
                } else {
                    setError('Failed to get vendors');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to get vendors');
                setLoading(false);
            });
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle edit button click
    const handleEditClick = (vendor) => {
        setFormData({
            ...vendor, // Populate form data with vendor's existing data
        });
        setOpen(true);  // Open the modal for editing
    };

    // Handle delete button click
    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                const response = await axios.delete(`/api/delete-vendor?id=${id}`);
                if (response.data.success) {
                    setVendors(vendors.filter(vendor => vendor.id !== id)); // Update vendor list
                } else {
                    alert('Failed to delete vendor');
                }
            } catch (error) {
                console.error('Error deleting vendor:', error);
            }
        }
    };

    // Handle form submission (for both create and edit)
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let response;
            if (formData.id) {
                // Edit existing vendor
                response = await axios.put(`/api/update-vendor?id=${formData.id}`, formData);
            } else {
                // Create new vendor
                response = await axios.post('/api/create-vendor', formData);
            }

            if (response.data.success) {
                setOpen(false);
                // Optionally refresh the vendor list
                axios.get('/api/get-vendors').then(response => {
                    if (response.data.success) {
                        setVendors(response.data.vendors);
                    }
                });
            } else {
                setFormErrors(response.data.errors || {});
            }
        } catch (error) {
            setFormErrors({ general: 'Failed to save vendor' });
        }
        setIsSubmitting(false);
    };

    // Open and close modal
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Render loading spinner
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Render error message
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {/* Header section with the title and Create Vendor button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Vendors List
                </Typography>
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
                    Create Vendor
                </Button>
            </Box>

            {/* Vendors List */}
            <Grid container spacing={3}>
                {vendors.map((vendor) => (
                    <Grid item xs={12} sm={6} md={4} key={vendor.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {vendor.company_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {vendor.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    <strong>Website:</strong> {vendor.website_url}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    <strong>Category:</strong> {vendor.category}
                                </Typography>

                                {/* Edit and Delete Buttons */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2, mr: 1 }}
                                    onClick={() => handleEditClick(vendor)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleDeleteClick(vendor.id)}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Vendor Modal for Create and Edit */}
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>{formData.id ? 'Edit Vendor' : 'Create Vendor'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Company Name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!formErrors.company_name}
                        helperText={formErrors.company_name}
                    />
                    <TextField
                        margin="dense"
                        label="Website URL"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!formErrors.website_url}
                        helperText={formErrors.website_url}
                    />
                    <TextField
                        margin="dense"
                        label="Contact Info"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!formErrors.contact_info}
                        helperText={formErrors.contact_info}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                    />
                    <TextField
                        margin="dense"
                        label="Category ID"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!formErrors.category_id}
                        helperText={formErrors.category_id}
                    />
                    <TextField
                        margin="dense"
                        label="Initial Release"
                        name="initial_release"
                        value={formData.initial_release}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Current Release"
                        name="current_release"
                        value={formData.current_release}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VendorsPage;
