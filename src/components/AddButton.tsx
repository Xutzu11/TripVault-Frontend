import {Add} from '@mui/icons-material';
import {Fab, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface AddButtonProps {
    to: string;
    tooltip?: string;
}

const AddButton = ({to, tooltip = 'Add Item'}: AddButtonProps) => {
    const nav = useNavigate();

    return (
        <Tooltip title={tooltip}>
            <Fab
                color='primary'
                onClick={() => nav(to)}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 20,
                    bgcolor: '#ad9267',
                    color: '#393939',
                    '&:hover': {
                        bgcolor: '#d4b699',
                    },
                }}
            >
                <Add />
            </Fab>
        </Tooltip>
    );
};

export default AddButton;
