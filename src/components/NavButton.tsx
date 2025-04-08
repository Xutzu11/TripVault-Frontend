import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface NavButtonProps {
    label: string;
    navigation: string;
    sx?: any;
}

const NavButton = ({label, navigation, sx}: NavButtonProps) => {
    const nav = useNavigate();

    return (
        <Button
            variant='contained'
            color='primary'
            sx={sx}
            onClick={() => nav(navigation)}
        >
            {label}
        </Button>
    );
};

export default NavButton;
