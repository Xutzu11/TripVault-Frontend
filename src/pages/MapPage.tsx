'use client';

import {ArrowBack, LocationOn} from '@mui/icons-material';
import {Button} from '@mui/material';
import {useLoadScript} from '@react-google-maps/api';
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AttractionInfoWindow from '../components/AttractionInfoWindow';
import Directions from '../components/Directions';
import LoadingScreen from '../components/LoadingScreen';
import MapFiltersPanel from '../components/MapFiltersPanel';
import Markers from '../components/Markers';
import PlacesAutocompleteBox from '../components/PlacesAutocompleteBox';
import RouteInfoCard from '../components/RouteInfoCard';
import UserMarker from '../components/UserMarker';
import UserPromptInput from '../components/UserPrompInput';
import {Attraction, MapPosition} from '../types';

const MapPage = () => {
    // Check user has access
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/access/user`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    },
                );
            } catch (error) {
                nav('/');
            }
        };
        fetchData();
    }, []);

    const [showFilters, setShowFilters] = useState(false);

    // Load Google Maps API
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });

    const [centerPosition, setCenterPosition] = useState<MapPosition>({
        lat: 46.770439,
        lng: 23.591423,
    });
    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [userPosition, setUserPosition] = useState<MapPosition | null>(null);
    const [selectedPosition, setSelectedPosition] =
        useState<MapPosition | null>(null);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, _] = useState(0);
    const [legIndex, setLegIndex] = useState(0);
    const [directions, setDirections] =
        useState<google.maps.DirectionsResult | null>(null);
    const selectedRoute = routes[routeIndex];
    const [closeAttractions, setCloseAttractions] = useState<Attraction[]>([]);
    const [minRating, setMinRating] = useState(0);
    const [maxAttractions, setMaxAttractions] = useState(9);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [maxDistance, setMaxDistance] = useState(20);
    const [refetchRoute, setRefetchRoute] = useState(false);
    const [transportMode, setTransportMode] = useState<google.maps.TravelMode>(
        () => {
            return (
                window.google?.maps?.TravelMode ?? {
                    WALKING: 'WALKING',
                    DRIVING: 'DRIVING',
                    TRANSIT: 'TRANSIT',
                }
            ).WALKING;
        },
    );
    const nav = useNavigate();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/api/attractions/`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log('Fetched attractions:', response.data);
                setAttractions(
                    response.data.map(
                        (attraction: any) => new Attraction(attraction),
                    ),
                );
            })
            .catch(() => {
                console.error('Error fetching attractions');
                nav('/');
            });
    }, []);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setUserPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log('Geolocation is not available in your browser.');
        }
    }, []);

    const handleNextLeg = () => {
        setLegIndex((prevIndex) =>
            prevIndex < selectedRoute.legs.length - 1 ? prevIndex + 1 : 0,
        );
    };

    const handleSearchRoute = () => {
        setRefetchRoute(true);
    };

    const handleResetFilters = () => {
        setMinRating(0);
        setMaxAttractions(20);
        setMaxPrice(200);
        setMaxDistance(50);
        setRefetchRoute(true);
    };

    const handleCurrentLocation = () => {
        setSelectedPosition(null);
    };

    return isLoaded ? (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                    position: 'relative',
                }}
            >
                <Button
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 'calc(50% + 110px + 16px)', // Adjust position relative to the centered box
                        height: '56px', // Adjust height to match the input box
                        width: '56px', // Adjust width to match the input box
                        zIndex: 10,
                    }}
                    variant='contained'
                    color='primary'
                    onClick={handleCurrentLocation}
                >
                    <LocationOn />
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        position: 'fixed',
                        bottom: 3,
                        left: 4,
                        zIndex: 10,
                    }}
                    onClick={() => nav(-1)}
                >
                    <ArrowBack />
                </Button>
                <Map
                    fullscreenControl={false}
                    mapId={import.meta.env.VITE_MAP_ID}
                    defaultZoom={11}
                    defaultCenter={userPosition ? userPosition : centerPosition}
                    mapTypeControl={false}
                    streetViewControl={false}
                    minZoom={3}
                >
                    <Markers
                        attractions={attractions}
                        setAttraction={setAttraction}
                        setCenterPosition={setCenterPosition}
                    />
                    <Directions
                        selectedPosition={selectedPosition || userPosition}
                        setRoutes={setRoutes}
                        setLegIndex={setLegIndex}
                        legIndex={legIndex}
                        setDirections={setDirections}
                        directions={directions}
                        closeAttractions={closeAttractions}
                        setCloseAttractions={setCloseAttractions}
                        maxDistance={maxDistance}
                        maxPrice={maxPrice}
                        minRating={minRating}
                        nrAttractions={maxAttractions}
                        refetchRoute={refetchRoute}
                        setRefetchRoute={setRefetchRoute}
                        transportMode={transportMode}
                    />
                    {userPosition && <UserMarker userPosition={userPosition} />}
                    <AttractionInfoWindow
                        attraction={attraction}
                        centerPosition={centerPosition}
                        onClose={() => {
                            setAttraction(null);
                        }}
                    />
                </Map>
                <PlacesAutocompleteBox
                    setSelectedPosition={setSelectedPosition}
                />
                {selectedPosition && (
                    <AdvancedMarker position={selectedPosition}>
                        <Pin
                            background={'#ad9267'}
                            borderColor={'black'}
                            glyphColor={'white'}
                        />
                    </AdvancedMarker>
                )}
                {routes.length > 0 && (
                    <RouteInfoCard
                        directions={directions}
                        closeAttractions={closeAttractions}
                        selectedRoute={selectedRoute}
                        legIndex={legIndex}
                        onNextLeg={handleNextLeg}
                    />
                )}
                <Button
                    onClick={() => setShowFilters(true)}
                    sx={{
                        position: 'absolute',
                        bottom: 45,
                        left: 4,
                        display: {xs: 'block', md: 'none'},
                        backgroundColor: '#ad9267',
                        color: 'white',
                    }}
                >
                    Filters
                </Button>

                <MapFiltersPanel
                    minRating={minRating}
                    setMinRating={setMinRating}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    maxAttractions={maxAttractions}
                    setMaxAttractions={setMaxAttractions}
                    transportMode={transportMode}
                    setTransportMode={setTransportMode}
                    onSearchRoute={handleSearchRoute}
                    onResetFilters={handleResetFilters}
                    open={showFilters}
                    onClose={() => setShowFilters(false)}
                />
            </div>
            <UserPromptInput
                setSelectedPosition={setSelectedPosition}
                setMinRating={setMinRating}
                setMaxAttractions={setMaxAttractions}
                setMaxDistance={setMaxDistance}
                setMaxPrice={setMaxPrice}
                onSearchRoute={handleSearchRoute}
                setTransportMode={setTransportMode}
            />
        </APIProvider>
    ) : (
        <LoadingScreen />
    );
};

export default MapPage;
