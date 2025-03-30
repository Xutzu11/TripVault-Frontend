import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import config from './config.json';
import {
    ThemeProvider,
    CssBaseline,
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import theme from './theme';

function UsersPage() {
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
    }, []);

    const [access, setAccess] = useState(false);
    const [status, setStatus] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [users, setUsers] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/admin`, {
                    headers: { Authorization: token },
                });
                setAccess(true);
            } catch (error) {
                return;
            }
        };

        fetchAccess();
    }, []);

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

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.SERVER_URL}/api/users`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
                );
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUserItem = async (userID) => {
        if (!access) {
            window.alert('You must have admin rights in order to delete a user.');
            return;
        }
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${config.SERVER_URL}/api/user/delete/${userID}`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userID));
            window.alert('User deleted.');
        } catch (error) {
            const syncUsers = localStorage.getItem('users') || '[]';
            const parsedSyncUsers = JSON.parse(syncUsers);
            localStorage.setItem('users', JSON.stringify(parsedSyncUsers.filter((user) => user.id !== userID)));
            window.alert("Delete failed: " + error);
        }
    };

    const toEdit = (userID) => {
        nav(`/users/${userID}`);
    };

    const toMuseums = () => {
        nav('/museums');
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
            }}>
            <Container maxWidth="md">
                {access ? (
                    <>
                        {!status && <Alert severity="error">Server is offline.</Alert>}
                        {!isOnline && <Alert severity="error">Network is unavailable.</Alert>}
                        <Box my={4}>
                            <Typography variant="h4" gutterBottom>
                                User Management
                            </Typography>
                            <Card>
                                <CardContent>
                                    <List>
                                        {users.map((user) => (
                                            <ListItem key={user.id} divider>
                                                <ListItemText
                                                    primary={`${user.username}`}
                                                    secondary={`Name: ${user.fname} ${user.lname}, Email: ${user.email}, Role: ${user.role}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="edit" onClick={() => toEdit(user.id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUserItem(user.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" onClick={toMuseums}>
                                        Museums
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h5">You must have admin rights in order to see users.</Typography>
                )}
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default UsersPage;
