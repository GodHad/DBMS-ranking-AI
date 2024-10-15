import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Main = () => {
    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
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

    useEffect(() => {
        if (open) {
            axios.get('/api/get-categories')
                .then(response => {
                    if (response.data.success) {
                        setCategories(response.data.categories);
                    } else {
                        setError('Failed to get categories');
                    }
                })
                .catch(() => {
                    setError('Failed to get categories');
                });
        }
    }, [open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let response;
            if (formData.id) {
                response = await axios.put(`/api/update-vendor?id=${formData.id}`, formData);
            } else {
                response = await axios.post('/api/create-vendor', formData);
            }

            if (response.data.success) {
                setOpen(false);
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

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditClick = (vendor) => {
        setFormData({
            id: vendor.id,
            company_name: vendor.company_name,
            website_url: vendor.website_url,
            contact_info: vendor.contact_info,
            description: vendor.description,
            category_id: vendor.category_id,
            initial_release: vendor.initial_release,
            current_release: vendor.current_release,
        });
        setOpen(true);
    };

    const handleDeleteClick = async (vendorId) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                const response = await axios.delete(`/api/delete-vendor?id=${vendorId}`);
                if (response.data.success) {
                    setVendors(vendors.filter(vendor => vendor.id !== vendorId));
                } else {
                    setError('Failed to delete vendor');
                }
            } catch {
                setError('Failed to delete vendor');
            }
        }
    };

    // Handle the checkbox change for approval
    const handleApprovalChange = async (vendorId, approved) => {
        try {
            const response = await axios.put(`/api/update-vendor?id=${vendorId}`, { approved });
            if (response.data.success) {
                // Update the local state
                setVendors(prevVendors =>
                    prevVendors.map(vendor =>
                        vendor.id === vendorId ? { ...vendor, approved } : vendor
                    )
                );
            } else {
                setError('Failed to update approval status');
            }
        } catch {
            setError('Failed to update approval status');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Vendors List</Typography>
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
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, display: 'flex' }}>
                                    <strong>Category:</strong>
                                    <div>
                                    {vendor.category.title}
                                    </div>
                                </Typography>

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

                                <FormControlLabel
                                    style={{ float: 'right' }}
                                    sx={{ mt: 2 }}
                                    control={
                                        <Switch
                                            checked={vendor.approved === 1}
                                            onChange={(e) => handleApprovalChange(vendor.id, e.target.checked ? 1 : 0)}
                                            color="primary"
                                        />
                                    }
                                    label="Approve"
                                    labelPlacement="end"
                                />

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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

                    <FormControl fullWidth margin="dense" required error={!!formErrors.category_id}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                        >
                            {categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.category_id && <Typography color="error">{formErrors.category_id}</Typography>}
                    </FormControl>

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

export default Main;
