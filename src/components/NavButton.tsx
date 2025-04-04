import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface NavButtonProps {
    label: string;
    navigation: string;
}

const NavButton = ({label, navigation}: NavButtonProps) => {
    const nav = useNavigate();

    return (
        <Button
            variant='contained'
            color='primary'
            onClick={() => nav(navigation)}
        >
            {label}
        </Button>
    );
};

export default NavButton;
