import {createTheme, Theme} from '@mui/material/styles';

const theme: Theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',
        button: {
            textTransform: 'none', // Prevents the text inside buttons from being transformed to uppercase
        },
    },
    palette: {
        mode: 'dark',
        background: {
            default: '#171717', // Dark background color
            paper: '#393939', // Darker background for cards
        },
        primary: {
            main: '#ad9267', // Primary color
        },
        secondary: {
            main: '#D22B2B', // Dark red color for delete buttons
        },
        text: {
            primary: '#ffffff', // Primary text color
            secondary: '#d4b699', // Secondary text color
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#393939', // Card background
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-containedPrimary': {
                        backgroundColor: '#ad9267',
                        color: '#393939',
                        '&:hover': {
                            backgroundColor: '#d4b699', // Adjusted hover color to avoid yellowish gold
                            color: 'white',
                        },
                    },
                    '&.MuiButton-outlinedPrimary': {
                        color: '#ad9267',
                        borderColor: '#ad9267',
                        '&:hover': {
                            borderColor: '#d4b699', // Adjusted hover color to avoid yellowish gold
                            color: 'white', // Adjusted hover text color to match
                        },
                    },
                    '&.MuiButton-containedSecondary': {
                        backgroundColor: '#880808', // Dark red color
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#d22b2b', // Hover color for secondary buttons
                            color: 'white',
                        },
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {color: '#ad9267'},
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {borderColor: '#ad9267'},
                        '&:hover fieldset': {borderColor: '#d4b699'},
                        '&.Mui-focused fieldset': {borderColor: '#d4b699'},
                        '& input': {color: '#d4b699'},
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ad9267',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d4b699',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d4b699',
                    },
                    '& .MuiSelect-icon': {color: '#ad9267'},
                    '& .MuiSelect-select': {color: '#d4b699'},
                },
            },
        },
    },
});

export default theme;
