import React from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
const NavList = () => {
    <Button style={{marginTop:'80px',marginLeft:'50px'}}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{
            borderRadius: '4px', // Rounded corners
            padding: '10px 20px', // Padding for a larger button
            fontWeight: 'bold', // Bold text
            textTransform: 'none', // Prevent uppercase text transformation
            '&:hover': {
                backgroundColor: '#0056b3', // Darker shade on hover
            },
        }}
    >
    </Button>
}
export default NavList;
