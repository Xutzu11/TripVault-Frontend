import {AdvancedMarker, InfoWindow} from '@vis.gl/react-google-maps';
import {useState} from 'react';

interface UserMarkerProps {
    userPosition: {lat: number; lng: number};
}

const UserMarker = ({userPosition}: UserMarkerProps) => {
    const [myOpen, setMyOpen] = useState(false);

    return (
        <>
            <AdvancedMarker
                position={userPosition}
                onClick={() => setMyOpen(true)}
            >
                <svg
                    height='48'
                    width='48'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <polygon
                        fill='#ad9267'
                        stroke='black'
                        strokeWidth='1'
                        points='12,20 6,10 10,10 10,4 14,4 14,10 18,10'
                    />
                    <polygon fill='white' points='12,19 6.5,10.5 17.5,10.5' />
                </svg>
            </AdvancedMarker>

            {myOpen && (
                <InfoWindow
                    position={userPosition}
                    onCloseClick={() => setMyOpen(false)}
                >
                    <p>You are here!</p>
                </InfoWindow>
            )}
        </>
    );
};

export default UserMarker;
