import {InfoWindow} from '@vis.gl/react-google-maps';

interface AttractionInfoWindowProps {
    open: string;
    photo: string;
    centerPosition: {lat: number; lng: number};
    onClose: () => void;
}

const AttractionInfoWindow = ({
    open,
    photo,
    centerPosition,
    onClose,
}: AttractionInfoWindowProps) => {
    if (open === '') return null;

    return (
        <InfoWindow position={centerPosition} onCloseClick={onClose}>
            <div>
                <p
                    style={{
                        color: '#171717',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                        margin: '0.5em 0',
                    }}
                >
                    {open}
                </p>
                {photo !== '' && (
                    <img
                        src={photo}
                        alt='info'
                        style={{width: '300px', height: 'auto'}}
                    />
                )}
            </div>
        </InfoWindow>
    );
};

export default AttractionInfoWindow;
