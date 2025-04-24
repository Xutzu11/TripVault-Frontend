import {
    Box,
    Button,
    Container,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {useNavigate} from 'react-router-dom';

interface Props {
    formData: {
        name: string;
        description: string;
        price: number;
        startDate: dayjs.Dayjs;
        endDate: dayjs.Dayjs;
        attractionId: number;
    };
    setFormData: (data: {
        name: string;
        description: string;
        price: number;
        startDate: dayjs.Dayjs;
        endDate: dayjs.Dayjs;
        attractionId: number;
    }) => void;
    attractions: any[];
    handleSubmit: () => void;
    typeLabel: string;
}

const AttractionForm = ({
    formData,
    setFormData,
    attractions,
    handleSubmit,
    typeLabel,
}: Props) => {
    const nav = useNavigate();

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    return (
        <>
            <Container maxWidth='sm'>
                <Box
                    sx={{
                        backgroundColor: '#2f2f2f',
                        borderRadius: 2,
                        padding: 4,
                        boxShadow: 3,
                        mt: 4,
                    }}
                >
                    <Typography
                        variant='h4'
                        gutterBottom
                        sx={{color: '#d4b699'}}
                    >
                        {typeLabel} Event
                    </Typography>

                    <TextField
                        fullWidth
                        required
                        margin='normal'
                        label='Name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin='normal'
                        label='Description'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        required
                        margin='normal'
                        label='Price ($)'
                        name='price'
                        type='number'
                        value={formData.price}
                        onChange={handleChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label='Start Date'
                            value={formData.startDate}
                            onChange={(newVal) =>
                                setFormData({
                                    ...formData,
                                    startDate: newVal || dayjs(),
                                })
                            }
                            sx={{mt: 2, width: '100%'}}
                        />
                        <DatePicker
                            label='End Date'
                            value={formData.endDate}
                            onChange={(newVal) =>
                                setFormData({
                                    ...formData,
                                    endDate: newVal || dayjs(),
                                })
                            }
                            sx={{mt: 2, width: '100%'}}
                        />
                    </LocalizationProvider>

                    <TextField
                        select
                        required
                        label='Attraction'
                        name='attractionId'
                        value={formData.attractionId}
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            },
                        }}
                    >
                        {attractions.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction='row' spacing={2} mt={3}>
                        <Button
                            variant='contained'
                            sx={{
                                flex: 5,
                                backgroundColor: '#ad9267',
                                color: '#393939',
                                '&:hover': {backgroundColor: '#d4b699'},
                            }}
                            onClick={handleSubmit}
                        >
                            {typeLabel}
                        </Button>
                        <Button
                            variant='contained'
                            color='inherit'
                            sx={{
                                flex: 1,
                                backgroundColor: '#8B0000',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#a30000',
                                },
                            }}
                            onClick={() => nav('/')}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

export default AttractionForm;
