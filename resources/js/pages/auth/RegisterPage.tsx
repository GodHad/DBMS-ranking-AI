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

const RegisterPage = () => {
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
        console.log('Username:', formValues.username);
        console.log('email:', formValues.email);
        console.log('Password:', value);
        setError(''); // Reset error before making the API call

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name: formValues.username,
                email: formValues.email,
                password: value,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token); // Store token in localStorage
                navigate('/login'); // Redirect after login success
            }
        } catch (err) {
            setError('Password is incorrect. Please check your credentials and try again.'); // Set error if login fails
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={10} sx={{ marginTop: 25, padding: 2 }}>
                <Avatar sx={{ mx: 'auto', bgcolor: 'secondary.main', textAlign: 'center', mb: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" sx={{ textAlign: 'center' }}>
                    Sign Up
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
                        name="username"
                        placeholder="Enter username"
                        fullWidth
                        required
                        autoFocus
                        value={formValues.username}
                        onChange={handleInputChange}
                        style={{ marginBottom: '10px' }}
                    />
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
                        <LinearProgress
                            determinate
                            size="sm"
                            value={Math.min((value.length * 100) / minLength, 100)}
                            sx={{ bgcolor: 'background.level3', color: 'hsl(var(--hue) 80% 40%)' }}
                        />
                        <Typography level="body-xs" sx={{ alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)' }}>
                            {value.length < 3 && 'Very weak'}
                            {value.length >= 3 && value.length < 6 && 'Weak'}
                            {value.length >= 6 && value.length < 10 && 'Strong'}
                            {value.length >= 10 && 'Very strong'}
                        </Typography>
                    </Stack>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                        Sign Up
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;
