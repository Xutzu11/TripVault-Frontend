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

const FiltersPanel = ({
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
                    onChange={(e, value) => onFilterChange('rating', value)}
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
                <Button
                    variant='contained'
                    color='primary'
                    onClick={onApply}
                    sx={{marginTop: 2, marginRight: 2}}
                >
                    Apply Filters
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={onReset}
                    sx={{marginTop: 2}}
                >
                    Reset Filters
                </Button>
            </Box>
        </Card>
    );
};

export default FiltersPanel;
