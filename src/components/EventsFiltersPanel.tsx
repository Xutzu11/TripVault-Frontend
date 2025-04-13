import {
    Box,
    Button,
    Card,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';

interface EventFilters {
    name: string;
    price: number;
}

interface EventsFiltersPanelProps {
    filters: EventFilters;
    onFilterChange: (filterName: string, value: any) => void;
    onApply: () => void;
    onReset: () => void;
    sortingOption: string;
    onSortChange: (event: any) => void;
}

const EventsFiltersPanel = ({
    filters,
    onFilterChange,
    onApply,
    onReset,
    sortingOption,
    onSortChange,
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
                <TextField
                    label='Minimum Price'
                    type='number'
                    value={filters.price}
                    onChange={(e) =>
                        onFilterChange('price', parseFloat(e.target.value))
                    }
                    fullWidth
                    sx={{marginBottom: 2}}
                />
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
                <Button
                    variant='contained'
                    color='primary'
                    onClick={onApply}
                    sx={{marginRight: 2}}
                >
                    Apply Filters
                </Button>
                <Button variant='contained' color='primary' onClick={onReset}>
                    Reset Filters
                </Button>
            </Box>
        </Card>
    );
};

export default EventsFiltersPanel;
