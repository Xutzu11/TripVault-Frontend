import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from './config.json';
import { ThemeProvider, CssBaseline, Box, Grid, Card, CardContent, CardActions, Typography, Button, Select, MenuItem, Container, Pagination, Toolbar, IconButton, AppBar, Tooltip, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import theme from './theme';
import { error } from 'console';

const settings = ['Profile', 'Logout'];

function ExhibitionsPage() {
    const getOnLineStatus = () =>
        typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
            ? navigator.onLine
            : true;

    const useNavigatorOnLine = () => {
        const [status, setStatus] = useState(getOnLineStatus());
    
        const setOnline = () => setStatus(true);
        const setOffline = () => setStatus(false);
    
        useEffect(() => {
            window.addEventListener('online', setOnline);
            window.addEventListener('offline', setOffline);
    
            return () => {
                window.removeEventListener('online', setOnline);
                window.removeEventListener('offline', setOffline);
            };
        }, []);
    
        return status;
    };

    const isOnline = useNavigatorOnLine();

    const [status, setStatus] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const nav = useNavigate();

    const [sortOpt, setSortOpt] = useState('');
    const [access, setAccess] = useState(false);
    const [currentP, setCurrentP] = useState(1);
    const PAGE_EXH = 10;
    const [exhibitions, setExhibitions] = useState([]);
    const [totalExhibitions, setTotalExhibitions] = useState(0);

    const fetchExhibitions = async (page = 1) => {
        try {
            const response = await axios.get(`${config.SERVER_URL}/api/exhibitions/from/${(page - 1) * PAGE_EXH + 1}/to/${page * PAGE_EXH}`, {
                params: {
                    sortopt: sortOpt
                },
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setExhibitions(response.data);
            const countResponse = await axios.get(`${config.SERVER_URL}/api/exhibitions/count`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setTotalExhibitions(countResponse.data);
        } catch (error) {
            const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
            const parsedSyncExhibitions = JSON.parse(syncExhibitions);
            setExhibitions(parsedSyncExhibitions);
            setTotalExhibitions(parsedSyncExhibitions.length);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });

                setAccess(true);
            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, [nav]);

    useEffect(() => {
        fetchExhibitions(currentP);
        setRefetch(false);
    }, [currentP, refetch, sortOpt]);

    useEffect(() => {
        if (status && isOnline) {
            const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
            const parsedSyncExhibitions = JSON.parse(syncExhibitions);
            parsedSyncExhibitions.forEach((exhibition) => {
                axios.post(`${config.SERVER_URL}/api/exhibition/add/${exhibition.name}&${exhibition.description}&${exhibition.price}&${exhibition.mid}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                    .then(() => {
                })
                    .catch(() => {});
            });
            localStorage.setItem("exhibitions", JSON.stringify([]));
        }
        setCurrentP(1);
        setRefetch(true);
    }, [status, isOnline]);

    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                await axios.get(`${config.SERVER_URL}/api/status`);
                setStatus(true);
            } catch (error) {
                setStatus(false);
            }
        };
        checkServerStatus();
        const interval = setInterval(checkServerStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteExhibitionItem = (exhibitionID) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete.');
            return;
        }
        const confirmDelete = window.confirm('Are you sure you want to delete this exhibition?');
        if (!confirmDelete) return;
        axios.delete(`${config.SERVER_URL}/api/exhibition/delete/${exhibitionID}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response);
                setExhibitions(prevExhibitions => prevExhibitions.filter(exhibition => exhibition.id !== exhibitionID));
                window.alert("Exhibition deleted.");
            }).catch((error) => {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                localStorage.setItem("exhibitions", JSON.stringify(parsedSyncExhibitions.filter((exhibition) => exhibition.id !== exhibitionID)));
                window.alert("Delete failed: " + error.response.data);
            });
    };

    const toAdd = () => {
        nav(`/exhibitions/add`);
    };

    const toEdit = (exhibitionID) => {
        nav(`/exhibitions/` + String(exhibitionID));
    };

    const toMuseums = () => {
        nav(`/museums`);
    };

    const toSort = (event) => {
        setSortOpt(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentP(value);
    };

    useEffect(() => {
        setExhibitions([]);
    }, []);

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky">
                <Container maxWidth={false}>
                    <Toolbar disableGutters>
                        <Box
                            component="img"
                            sx={{ 
                                mr: 2, 
                                display: { xs: 'none', md: 'flex' },
                                height: 50
                            }}
                            alt="Logo"
                            src="https://i.ibb.co/1f1WgXs/logo.png"
                        />

                        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary" onClick={toAdd} >Add exhibition</Button>
                            <Button variant="contained" color="primary" onClick={toMuseums}>Museums</Button>
                            
                        </Box>

                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Select
                                value={sortOpt}
                                onChange={toSort}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Sort by' }}
                                sx={{ height: "40px", minWidth: 'auto', padding: '6px 8px'}}
                            >
                                <MenuItem value="" disabled>Sort by</MenuItem>
                                <MenuItem value='id'>ID</MenuItem>
                                <MenuItem value='name'>Name</MenuItem>
                                <MenuItem value='description'>Description</MenuItem>
                                <MenuItem value='price'>Price</MenuItem>
                            </Select>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <MoreVertIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{
                background: 'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Container>
                <Box sx={{ padding: 3}}>
                    <Typography variant="h4" align="center" gutterBottom>Exhibitions</Typography>
                    <Typography variant="subtitle1" align="center" color="error">{status ? '' : 'Server is offline.'}</Typography>
                    <Typography variant="subtitle1" align="center" color="error">{isOnline ? '' : 'Network is unavailable.'}</Typography>
                    <Grid container spacing={3}>
                        {exhibitions.map((exhibition) => (
                            <Grid item xs={12} key={exhibition.id}>
                                <Card sx={{transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.02)',
                                                boxShadow:
                                                    '0 8px 16px rgba(0, 0, 0, 0.2)',
                                            },
                                        }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {exhibition.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {exhibition.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Price: ${parseFloat(exhibition.price).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => toEdit(exhibition.id)}>Edit</Button>
                                        <Button size="small" color="secondary" onClick={() => handleDeleteExhibitionItem(exhibition.id)}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <Pagination
                            count={Math.ceil(totalExhibitions / PAGE_EXH)}
                            page={currentP}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </Box>
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default ExhibitionsPage;
