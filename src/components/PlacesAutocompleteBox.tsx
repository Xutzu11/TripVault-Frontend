// src/components/PlacesAutocompleteBox.tsx
import {Autocomplete, Box, CircularProgress, TextField} from '@mui/material';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';

interface PlacesAutocompleteBoxProps {
    setSelectedPosition: (
        selectedPosition: {lat: number; lng: number} | null,
    ) => void;
}

const PlacesAutocompleteBox = ({
    setSelectedPosition,
}: PlacesAutocompleteBoxProps) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (_: any, newValue: any) => {
        if (newValue) {
            setValue(newValue, false);
            clearSuggestions();
            const result = await getGeocode({address: newValue});
            const {lat, lng} = await getLatLng(result[0]);
            setSelectedPosition({lat, lng});
        } else {
            setSelectedPosition(null);
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                left: '50%',
                transform: 'translateX(-62%)',
                zIndex: 10,
                width: 300,
            }}
        >
            <Autocomplete
                freeSolo
                disableClearable
                options={
                    status === 'OK'
                        ? data.map((option) => option.description)
                        : []
                }
                inputValue={value}
                onInputChange={(_, newInputValue) => setValue(newInputValue)}
                onChange={handleSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Choose a starting point...'
                        disabled={!ready}
                        sx={{bgcolor: '#171717', borderRadius: 1}}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            endAdornment: (
                                <>
                                    {!ready ? (
                                        <CircularProgress
                                            color='inherit'
                                            size={20}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default PlacesAutocompleteBox;
