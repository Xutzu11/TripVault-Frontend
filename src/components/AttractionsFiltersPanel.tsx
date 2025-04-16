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

interface Filters {
    name: string;
    theme: string;
    state: number;
    city: number;
    rating: number;
}

interface FiltersPanelProps {
    filters: Filters;
    states: State[];
    cities: City[];
    onFilterChange: (filterName: string, value: any) => void;
    onApply: () => void;
    onReset: () => void;
    sortingOption: string;
    onSortChange: (event: any) => void;
}

const AttractionsFiltersPanel = ({
    filters,
    states,
    cities,
    onFilterChange,
    onApply,
    onReset,
    sortingOption,
    onSortChange,
}: FiltersPanelProps) => {
    return (
        <Card sx={{padding: 2}}>
            <Typography variant='h6'>Filters</Typography>
            <Box sx={{marginTop: 2}}>
                <TextField
                    sx={{marginTop: 2}}
                    label='Name'
                    type='text'
                    value={filters.name}
                    onChange={(e) => onFilterChange('name', e.target.value)}
                    fullWidth
                />
                <TextField
                    sx={{marginTop: 2}}
                    label='Theme'
                    type='text'
                    value={filters.theme}
                    onChange={(e) => onFilterChange('theme', e.target.value)}
                    fullWidth
                />
                <Typography variant='body1' sx={{marginTop: 2}}>
                    State
                </Typography>
                <Select
                    fullWidth
                    value={filters.state}
                    onChange={(e) => onFilterChange('state', e.target.value)}
                >
                    {states.map((state) => (
                        <MenuItem key={state.id} value={state.id}>
                            {state.name}
                        </MenuItem>
                    ))}
                </Select>
                {filters.state != 0 && (
                    <>
                        <Typography variant='body1' sx={{marginTop: 2}}>
                            City
                        </Typography>
                        <Select
                            fullWidth
                            value={filters.city}
                            onChange={(e) =>
                                onFilterChange('city', e.target.value)
                            }
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                )}
                <Typography variant='body1' sx={{marginTop: 2}}>
                    Minimum Rating
                </Typography>
                <Slider
                    value={filters.rating}
                    onChange={(_, value) => onFilterChange('rating', value)}
                    valueLabelDisplay='auto'
                    min={0}
                    max={5}
                    step={0.1}
                />
                <Typography variant='body1' sx={{marginTop: 2}}>
                    Sort by
                </Typography>
                <Select fullWidth value={sortingOption} onChange={onSortChange}>
                    <MenuItem value='id'>-</MenuItem>
                    <MenuItem value='name'>Name</MenuItem>
                    <MenuItem value='revenue'>Revenue</MenuItem>
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

export default AttractionsFiltersPanel;
