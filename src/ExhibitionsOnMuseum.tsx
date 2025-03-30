import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { debounce } from 'lodash';
import config from './config.json';
import { ThemeProvider, CssBaseline, Grid, Card, CardContent, CardActions, Typography, Button, Box, IconButton } from '@mui/material';
import theme from './theme';
import { AddShoppingCart } from '@mui/icons-material';

function ExhibitionsOnMuseum() {
    const nav = useNavigate();
    const { museumID } = useParams();

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

            } catch (error) {
                nav('/');
            }
        };

        fetchData();
    }, [nav]);

    const [access, setAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });
                setAccess(true);

            } catch (error) {
                return;
            }
        };

        fetchData();
    }, []);

    const [currentP, setCurrentP] = useState(1);
    const PAGE_EXH = 10;
    const [exhibitions, setExhibitions] = useState([]);
    const [totalExhibitions, setTotalExhibitions] = useState(0);
    
    const fetchMore = () => {
        setCurrentP(prevCurrentP => prevCurrentP + 1);
    };

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const response = await axios.get(`${config.SERVER_URL}/api/exhibitions-museum/${museumID}/from/${(currentP-1)*PAGE_EXH+1}/to/${currentP*PAGE_EXH}`,{
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
                setExhibitions(response.data);
            } catch (error) {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                setExhibitions(parsedSyncExhibitions.filter((exhibition) => exhibition.mid === parseInt(museumID)));
            }
        };

        const fetchTotalExhibitions = async () => {
            try {
                const response = await axios.get(`${config.SERVER_URL}/api/exhibitions-museum/count/${museumID}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setTotalExhibitions(response.data);
            } catch (error) {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                setTotalExhibitions(parsedSyncExhibitions.filter((exhibition) => exhibition.mid === parseInt(museumID)).length);
            }
        };
        fetchExhibitions();
        fetchTotalExhibitions();
    }, [currentP, museumID]);

    const handleDeleteExhibitionItem = (exhibitionID) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete.');
            return;
        }
        const confirmDelete = window.confirm('Are you sure you want to delete this exhibition?');
        if (!confirmDelete) return;
        axios.delete(`${config.SERVER_URL}/api/exhibition/delete/${exhibitionID}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        })
            .then(response => {
                console.log(response);
                setExhibitions(prevExhibitions => prevExhibitions.filter(exhibition => exhibition.id !== exhibitionID));
            }).catch(() => {
                const syncExhibitions = localStorage.getItem("exhibitions") || "[]";
                const parsedSyncExhibitions = JSON.parse(syncExhibitions);
                localStorage.setItem("exhibitions", JSON.stringify(parsedSyncExhibitions.filter((exhibition) => exhibition.id !== exhibitionID)));
                window.alert("Exhibition deleted.");
        });
    };

    const toEdit = (exhibitionID) => {
        nav(`/exhibitions/` + String(exhibitionID));
    };

    const toMuseums = () => {
        nav(`/museums`);
    };

    useEffect(() => {
        setExhibitions([]);
    }, [museumID]);

    const addToCart = (exhibition) => {
        const cart = JSON.parse(localStorage.getItem('exhibitionsCart') || '[]');
        const index = cart.findIndex(item => item.exhibition.id === exhibition.id);
    
        if (index === -1) {
            cart.push({ quantity: 1, exhibition });
        } else {
            cart[index].quantity += 1;
        }
    
        localStorage.setItem('exhibitionsCart', JSON.stringify(cart));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
            <Box sx={{ padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Button variant="contained" color="primary" onClick={toMuseums}>Museums</Button>
                </Box>
                <Typography variant="h4" align="center" gutterBottom>Exhibitions</Typography>
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
                                    <Typography variant="body2" color="textSecondary">
                                        Start Date: {new Date(exhibition.start_date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        End Date: {new Date(exhibition.end_date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => toEdit(exhibition.id)}>Edit</Button>
                                    <Button size="small" color="secondary" onClick={() => handleDeleteExhibitionItem(exhibition.id)}>Delete</Button>
                                    <IconButton size="small" color="primary" onClick={() => addToCart(exhibition)}>
                                        <AddShoppingCart />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    {currentP * PAGE_EXH < totalExhibitions && (
                        <Button variant="contained" color="primary" onClick={fetchMore}>Load More</Button>
                    )}
                </Box>
            </Box>
            </Box>
        </ThemeProvider>
    );
}

export default ExhibitionsOnMuseum;
