import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from './config.json';
import {
    ThemeProvider,
    CssBaseline,
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import theme from './theme';
import { error } from 'console';

const EditUser = () => {
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

    const nav = useNavigate();
    const { userID } = useParams();
    const [access, setAccess] = useState(false);
    const [username, setUsername] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/admin`, {
                    headers: {
                        Authorization: token
                    }
                });
                setAccess(true);
            } catch (error) {
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!userID) return;

        axios.get(`${config.SERVER_URL}/api/user/${userID}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response);
                setUsername(response.data.username);
                setFname(response.data.fname);
                setLname(response.data.lname);
                setEmail(response.data.email);
                setRole(response.data.role);
            })
            .catch(() => {
            });
    }, [userID]);

    const saveUser = () => {
        axios.put(`${config.SERVER_URL}/api/user/edit/${userID}`, {
            username, fname, lname, email, role,
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response);
                window.alert("User edited.");
            })
            .catch((error) => {
                const syncUsers = localStorage.getItem("users") || "[]";
                const parsedSyncUsers = JSON.parse(syncUsers);
                localStorage.setItem("users", JSON.stringify(parsedSyncUsers.map(
                    (user) =>
                        (user.id == userID) ?
                            { id: userID, username, fname, lname, email, role } :
                            user
                )));
                console.log(localStorage.getItem("users"));
                window.alert("Edit failed: " + error.response.data);
            });
    };

    const goToMain = () => {
        nav('/users');
    };

    const handleInputChange = (setter) => (event) => {
        setter(event.target.value);
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        bgcolor: 'background.default',
                        color: 'text.primary'
                    }}
                >
                    <CircularProgress />
                </Box>
            </ThemeProvider>
        );
    }

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
            <Container>
                {access ? (
                    <Card sx={{ marginTop: 5, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Edit User
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                ID: {userID}
                            </Typography>
                            <Box component="form" noValidate autoComplete="off">
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Username"
                                    type="text"
                                    value={username}
                                    onChange={handleInputChange(setUsername)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="First Name"
                                    type="text"
                                    value={fname}
                                    onChange={handleInputChange(setFname)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Last Name"
                                    type="text"
                                    value={lname}
                                    onChange={handleInputChange(setLname)}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        value={role}
                                        onChange={handleInputChange(setRole)}
                                        label="Role"
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="moderator">Moderator</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Button variant="contained" color="primary" onClick={saveUser}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" onClick={goToMain} sx={{ marginLeft: 2 }}>
                                Main Page
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Typography variant="h6" color="error" align="center">
                        You must have admin rights in order to edit.
                    </Typography>
                )}
            </Container>
            </Box>
        </ThemeProvider>
    );
}

export default EditUser;
