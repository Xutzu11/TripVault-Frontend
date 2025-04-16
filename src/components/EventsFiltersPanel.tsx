import {
    Box,
    Button,
    Card,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography,
} from '@mui/material';
import {City, State} from '../types';

interface EventFilters {
    name: string;
    price: number;
    state: number;
    city: number;
}

interface EventsFiltersPanelProps {
    filters: EventFilters;
    onFilterChange: (filterName: string, value: any) => void;
    onApply: () => void;
    onReset: () => void;
    sortingOption: string;
    onSortChange: (event: any) => void;
    states: State[];
    cities: City[];
}

const EventsFiltersPanel = ({
    filters,
    onFilterChange,
    onApply,
    onReset,
    sortingOption,
    onSortChange,
    states,
    cities,
}: EventsFiltersPanelProps) => {
    return (
        <Card sx={{padding: 2}}>
            <Typography variant='h6'>Filters</Typography>
            <Box sx={{marginTop: 2}}>
                <TextField
                    label='Name'
                    type='text'
                    value={filters.name}
                    onChange={(e) => onFilterChange('name', e.target.value)}
                    fullWidth
                    sx={{marginBottom: 2}}
                />
                <Typography variant='body1'>Maximum Price ($)</Typography>
                <Slider
                    value={filters.price}
                    onChange={(_, value) => onFilterChange('price', value)}
                    valueLabelDisplay='auto'
                    min={0}
                    max={100}
                    step={1}
                    sx={{marginBottom: 2}}
                />
                <Typography variant='body1'>State</Typography>
                <Select
                    fullWidth
                    value={filters.state}
                    onChange={(e) => onFilterChange('state', e.target.value)}
                    sx={{marginBottom: 2}}
                >
                    {states.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                            {state.name}
                        </MenuItem>
                    ))}
                </Select>
                {filters.state !== 0 && (
                    <>
                        <Typography variant='body1'>City</Typography>
                        <Select
                            fullWidth
                            value={filters.city}
                            onChange={(e) =>
                                onFilterChange('city', e.target.value)
                            }
                            sx={{marginBottom: 2}}
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                )}
                <Typography variant='body1'>Sort by</Typography>
                <Select
                    fullWidth
                    value={sortingOption}
                    onChange={onSortChange}
                    sx={{marginBottom: 2}}
                >
                    <MenuItem value='id'>-</MenuItem>
                    <MenuItem value='name'>Name</MenuItem>
                    <MenuItem value='price'>Price</MenuItem>
                </Select>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        marginTop: 2,
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={onApply}
                    >
                        Apply
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default EventsFiltersPanel;
