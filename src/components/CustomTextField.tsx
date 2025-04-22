import {TextField, TextFieldProps} from '@mui/material';

const CustomTextField = (props: TextFieldProps) => (
    <TextField
        {...props}
        fullWidth
        sx={{
            '& .MuiInputLabel-root': {color: '#ad9267'},
            '& .MuiOutlinedInput-root': {
                '& fieldset': {borderColor: '#ad9267'},
                '&:hover fieldset': {borderColor: '#d4b699'},
                '&.Mui-focused fieldset': {borderColor: '#d4b699'},
                '& input': {color: '#d4b699'},
            },
            ...props.sx,
        }}
    />
);

export default CustomTextField;
