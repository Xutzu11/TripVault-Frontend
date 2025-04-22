import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';

interface RegisterFormProps {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    errorMessage: string;
    valid: string;
    onChange: (field: string, value: string) => void;
    onRegister: () => void;
    onNavigateToLogin: () => void;
}

const RegisterForm = ({
    username,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    errorMessage,
    valid,
    onChange,
    onRegister,
    onNavigateToLogin,
}: RegisterFormProps) => {
    return (
        <Card sx={{padding: 3, margin: 3, maxWidth: 400}}>
            <CardContent>
                <Typography variant='h4' gutterBottom>
                    Register
                </Typography>
                <Typography variant='body2' color={valid} gutterBottom>
                    {errorMessage}
                </Typography>
                <TextField
                    fullWidth
                    margin='normal'
                    label='Username'
                    value={username}
                    onChange={(e) => onChange('username', e.target.value)}
                />
                <TextField
                    fullWidth
                    margin='normal'
                    label='First Name'
                    value={firstName}
                    onChange={(e) => onChange('firstName', e.target.value)}
                />
                <TextField
                    fullWidth
                    margin='normal'
                    label='Last Name'
                    value={lastName}
                    onChange={(e) => onChange('lastName', e.target.value)}
                />
                <TextField
                    fullWidth
                    margin='normal'
                    label='Email'
                    type='email'
                    value={email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
                <TextField
                    fullWidth
                    margin='normal'
                    label='Password'
                    type='password'
                    value={password}
                    onChange={(e) => onChange('password', e.target.value)}
                />
                <TextField
                    fullWidth
                    margin='normal'
                    label='Confirm Password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) =>
                        onChange('confirmPassword', e.target.value)
                    }
                />
                <FormControl component='fieldset' sx={{mt: 2}}>
                    <FormLabel component='legend'>Role</FormLabel>
                    <RadioGroup
                        row
                        value={role}
                        onChange={(e) => onChange('role', e.target.value)}
                    >
                        <FormControlLabel
                            value='user'
                            control={<Radio />}
                            label='User'
                        />
                        <FormControlLabel
                            value='admin'
                            control={<Radio />}
                            label='Admin'
                        />
                    </RadioGroup>
                </FormControl>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 2,
                    }}
                >
                    <Button variant='contained' onClick={onRegister}>
                        Register
                    </Button>
                    <Button variant='text' onClick={onNavigateToLogin}>
                        Already have an account? Login here.
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RegisterForm;
