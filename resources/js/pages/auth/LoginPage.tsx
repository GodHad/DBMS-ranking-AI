import React from 'react';
import { useState } from "react";
import { Container, Avatar, Paper, Box, FormControlLabel, Checkbox, Button, Grid, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Key from '@mui/icons-material/Key';
import Stack from "@mui/material/Stack";
import MailIcon from '@mui/icons-material/Mail';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(''); // Error state for failed login attempts
    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    });
    const [value, setValue] = useState('');  // Add state for the password field
    const minLength = 8; // Minimum length for password strength

    // Handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent page reload on submit
        console.log('email:', formValues.email);
        console.log('Password:', value);
        setError(''); // Reset error before making the API call

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email: formValues.email,
                password: value
            });

            if (response.status === 200 && response.data.token) {
                // Store token in localStorage and navigate to dashboard
                localStorage.setItem('token', response.data.token);
                navigate('/'); // Redirect after login success
            } else {
                // If there's no token or the response isn't valid, set an error
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.'); // Set error if login fails
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 25, padding: 2 }}>
                <Avatar sx={{ mx: 'auto', bgcolor: 'secondary.main', textAlign: 'center', mb: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" sx={{ textAlign: 'center' }}>
                    Sign In
                </Typography>

                {/* Display alert when there's an error */}
                {error && (
                    <Alert
                        color="danger" // Alert color
                        endDecorator={
                            <IconButton size="sm" color="neutral" onClick={() => setError('')}>
                                <CloseRoundedIcon />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate sx={{ mt: 1 }}
                >
                    <Input
                        startDecorator={<MailIcon />}
                        name="email"
                        type='email'
                        placeholder="Enter email"
                        fullWidth
                        required
                        autoFocus
                        value={formValues.email}
                        onChange={handleInputChange}
                        style={{ marginBottom: '10px' }}
                    />

                    <Stack spacing={0.5} sx={{ '--hue': Math.min(value.length * 10, 120) }}>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            startDecorator={<Key />}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                    </Stack>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                        Sign In
                    </Button>
                </Box>
                <Grid container justifyContent='space-between' sx={{ mt: 1 }}>
                    <Grid item>
                        <Link component={RouterLink} to="/forgot">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link component={RouterLink} to="/register">
                            Sign Up
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default LoginPage;
