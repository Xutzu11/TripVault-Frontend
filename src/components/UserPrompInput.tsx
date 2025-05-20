import {Send} from '@mui/icons-material';
import {Box, IconButton, Paper, TextField} from '@mui/material';
import axios from 'axios';
import {useState} from 'react';
import config from '../config.json';

const UserPromptInput = () => {
    const [input, setInput] = useState('');

    const handleSubmit = async () => {
        console.log('User Prompt:', input);
        const response = await axios.get(
            `${config.SERVER_URL}/api/path/prompt`,
            {
                params: {prompt: input},
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
            },
        );
        if (response.status === 200) {
            console.log('Response:', response.data);
        } else {
            console.error('Error:', response.statusText);
        }
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 10, // above the bottom button
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70%',
                zIndex: 10,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingX: 2,
                    paddingY: 1,
                    bgcolor: '#2f2f2f',
                    border: '1px solid #ad9267',
                    borderRadius: '24px',
                }}
            >
                <TextField
                    placeholder='Describe your trip...'
                    fullWidth
                    multiline
                    maxRows={3}
                    variant='standard'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            color: '#d4b699',
                        },
                    }}
                    sx={{
                        marginRight: 1,
                    }}
                />
                <IconButton onClick={handleSubmit} color='primary'>
                    <Send />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default UserPromptInput;
