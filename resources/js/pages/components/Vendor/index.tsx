import React from 'react';
import { Box, Button, AppBar, CssBaseline, Toolbar, Drawer } from '@mui/material';
import HeaderBar from '../Vendor/header';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 240; // Define the width of the drawer

const VendorPage = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: '100%',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <HeaderBar />
            </AppBar>
            {/* Drawer component for the NavList */}
            <Drawer
                variant="permanent"
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Button
                    style={{ marginTop: '100px' }}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{
                        borderRadius: '4px', // Rounded corners
                        backgroundColor: 'rgb(36, 37, 38)',
                        padding: '10px 20px', // Padding for a larger button
                        fontWeight: 'bold', // Bold text
                        textTransform: 'none', // Prevent uppercase text transformation
                        '&:hover': {
                            backgroundColor: '#0056b3', // Darker shade on hover
                        },
                    }}
                >
                    Add
                </Button>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`, // Subtract the drawer width from the total width
                }}
            >
                <Toolbar />
                {/* Main content goes here */}
                <div style={{marginLeft:'250px'}}>asd</div>
            </Box>
        </Box>
    );
};

export default VendorPage;
