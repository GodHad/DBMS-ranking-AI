import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LoginIcon from '@mui/icons-material/Login';
import { colors } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import logoFile from '../../../../img/1.png';
import LogoutIcon from '@mui/icons-material/Logout';


const pages = ['Home', 'DB-Engines Ranking', 'Blog','Sponsors'];

const HomePage= () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor:'#3c3c3c',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <AppBar position="static" style={{backgroundColor:'#242526'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Box component="img" sx={{ height: 70,width:150}} alt="Logo" src={logoFile} />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <RouterLink to="/home" style={{ textDecoration: 'none' }}>
                    <Typography
                    noWrap
                    sx={{backgroundColor:"#242526",fontWeight:'bold', color:'black',fontSize:'15px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Home
                    </Typography>
                </RouterLink>
                <RouterLink to="/rankin_gpage" style={{ textDecoration: 'none' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'black',fontSize:'15px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        DB_engines Lanking
                    </Typography>
                </RouterLink>
                <RouterLink to="/blog_page" style={{ textDecoration: 'none' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'black',fontSize:'15px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Blog
                    </Typography>
                </RouterLink>
                <RouterLink to="/sponsor_page" style={{ textDecoration: 'none' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'black',fontSize:'15px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Sponsors
                    </Typography>
                </RouterLink>
            </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
            }}
            >
            LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <RouterLink to="/v_sponsor_page" style={{ textDecoration: 'none',paddingLeft:'50px' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'white',fontSize:'20px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Home
                    </Typography>
                </RouterLink>
                <RouterLink to="/db_ranking" style={{ textDecoration: 'none',paddingLeft:'50px' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'white',fontSize:'20px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        DB-Engines Ranking
                    </Typography>
                </RouterLink>
                <RouterLink to="/blog_page" style={{ textDecoration: 'none',paddingLeft:'50px' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'white',fontSize:'20px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Blog
                    </Typography>
                </RouterLink>
                <RouterLink to="/v_sponsor_page" style={{ textDecoration: 'none',paddingLeft:'50px' }}>
                    <Typography
                    noWrap
                    sx={{fontWeight:'bold', color:'white',fontSize:'20px',fontFamily:'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol'}}
                    >
                        Sponsors
                    </Typography>
                </RouterLink>
            </Box>
            <RouterLink to="/logout">
                <Button color="primary" variant="text" sx={{ color: 'white' }}>
                <LogoutIcon />
                </Button>
            </RouterLink>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HomePage;
