"use client";

import { useEffect, useRef, useState } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    useMap,
    useMapsLibrary
} from '@vis.gl/react-google-maps';
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import config from './config.json';
import axios from 'axios';
import {useLoadScript} from '@react-google-maps/api';
import { Box, Card, CardContent, Typography, TextField, Autocomplete, CircularProgress, Button, ThemeProvider, Slider } from '@mui/material';
import theme from './theme';
import { LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    nav('/');
                    return;
                }

                await axios.get(`${config.SERVER_URL}/api/access/user`, {
                    headers: {
                        Authorization: token
                    }
                });

            } catch (error) {
                nav('/');
            }
        };
        fetchData();
    }, []);

    const {isLoaded}  = useLoadScript({
        googleMapsApiKey: config.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    const [centerPosition, setCenterPosition] = useState<{ lat: number, lng: number }>({ lat: 46.770439, lng: 23.591423 });
    const [open, setOpen] = useState('');
    const [photo, setPhoto] = useState('');
    const [museums, setMuseums] = useState<[{ mid: number, name: string, lat: number, lng: number, photo_path: string }]>([{ mid: 0, name: '', lat: 0, lng: 0, photo_path: '' }]);
    const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [myOpen, setMyOpen] = useState(false);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [legIndex, setLegIndex] = useState(0);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const selectedRoute = routes[routeIndex];
    const [closeMuseums, setCloseMuseums] = useState<{ mid: number, name: string, lat: number, lng: number }[]>([{ mid: 0, name: '', lat: 0, lng: 0 }]);
    const [minRating, setMinRating] = useState(0);
    const [maxMuseums, setMaxMuseums] = useState(9);
    const [maxDistance, setMaxDistance] = useState(20);
    const [refetchRoute, setRefetchRoute] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        axios.get(`${config.SERVER_URL}/api/museums/`, {
            headers: 
            {
                Authorization: localStorage.getItem('token'),
            },
        }
        )
            .then(response => {
                console.log("Fetched museums:", response.data);
                setMuseums(response.data);
            })
            .catch(() => {
                const syncMuseums = localStorage.getItem("museums") || "[]";
                const parsedSyncMuseums = JSON.parse(syncMuseums);
                setMuseums(parsedSyncMuseums);
            });
    }, []);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setUserPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }, []);

    const handleNextLeg = () => {
        setLegIndex((prevIndex) => (prevIndex < selectedRoute.legs.length - 1) ? prevIndex + 1 : 0);
    };

    const formatDistance = (distance: number) => {
        if (distance < 1000) return `${distance} meters`;
        return `${(distance / 1000).toFixed(2)} km`;
    };
      
      const formatDuration = (duration: number) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        if (hours > 0) return `${hours} hrs ${minutes} mins`;
        return `${minutes} mins`;
    };

    const handleSearchRoute = () => {
        setRefetchRoute(true);
    };

    const handleResetFilters = () => {
        setMinRating(0);
        setMaxMuseums(9);
        setMaxDistance(20);
        setRefetchRoute(true);
    };

    const handleCurrentLocation = () => {
        setSelectedPosition(null);
    }

    const toMain = () => {
        nav('/museums');
    }

    return (
        (isLoaded) ? (
        <ThemeProvider theme={theme}>
        <APIProvider apiKey={config.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div style={{ height: "100vh", width: "100vw", position: 'relative' }}>
                <Button
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 'calc(50% + 110px + 16px)', // Adjust position relative to the centered box
                        height: '56px', // Adjust height to match the input box
                        width: '56px', // Adjust width to match the input box
                        zIndex: 10,
                    }}
                    variant="contained"
                    color="primary"
                    onClick={handleCurrentLocation}
                >
                    <LocationOn />
                </Button>
                <Button
                    sx={{
                        position: 'fixed',
                        bottom: 3,
                        left: 4,
                        zIndex: 10,
                    }}
                    variant="contained"
                    color="primary"
                    onClick={toMain}
                >
                    Main page
                </Button>
                <Map fullscreenControl={false} mapId={config.NEXT_PUBLIC_MAP_ID}
                    defaultZoom={11} defaultCenter={userPosition ? userPosition : centerPosition}
                    mapTypeControl={false} streetViewControl={false} minZoom={3}>
                    <Markers museums={museums} setOpen={setOpen} setPhoto={setPhoto} setCenterPosition={setCenterPosition} />
                    <Directions selectedPosition={selectedPosition || userPosition} setRoutes={setRoutes} setLegIndex={setLegIndex} legIndex={legIndex} 
                                setDirections={setDirections} directions={directions} closeMuseums={closeMuseums} setCloseMuseums={setCloseMuseums}
                                maxDistance={maxDistance} minRating={minRating} nrMuseums={maxMuseums}
                                refetchRoute={refetchRoute} setRefetchRoute={setRefetchRoute}/>
                    {userPosition && (
                        <AdvancedMarker position={userPosition} onClick={() => setMyOpen(true)}>
                            <svg
                                height="48"
                                width="48"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polygon
                                    fill="#ad9267"
                                    stroke="black"
                                    strokeWidth="1"
                                    points="12,20 6,10 10,10 10,4 14,4 14,10 18,10"
                                />
                                <polygon
                                    fill="white"
                                    points="12,19 6.5,10.5 17.5,10.5"
                                />
                            </svg>
                        </AdvancedMarker>
                    )}
                    {myOpen && (
                        <InfoWindow position={userPosition} onCloseClick={() => setMyOpen(false)}>
                            <p>You are here!</p>
                        </InfoWindow>
                    )}
                    {open !== '' && (
                        <InfoWindow position={centerPosition} onCloseClick={() => { setOpen(''); setPhoto(''); }}>
                        <p style={{ color: '#171717',fontWeight: 'bold', fontSize: '1.2em', margin: '0.5em 0' }}>{open}</p>
                        {photo !== '' && <img src={photo} alt="info" style={{ width: '300px', height: 'auto' }} />}
                        </InfoWindow>
                    )}
                </Map>
                <PlacesAutoComplete setSelectedPosition={setSelectedPosition}/>
                {selectedPosition && 
                    <AdvancedMarker position={selectedPosition}>
                        <Pin background={"#ad9267"} borderColor={"black"} glyphColor={"white"} />
                    </AdvancedMarker>
                }
                {routes.length > 0 && (
                    <Box sx={{ position: 'absolute', top: 16, right: 16, width: 300, zIndex: 10 }}>
                        <Card>
                        <CardContent>
                            {directions && closeMuseums.length > 0 ? (
                            <>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total distance: {formatDistance(selectedRoute?.legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0))}
                                    </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total duration: {formatDuration(selectedRoute?.legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0))}
                                    </Typography>
                                <Typography sx={{ marginTop: 1 }} variant="subtitle1">
                                {legIndex < selectedRoute?.legs.length - 1 ? 
                                    `Museum ${legIndex + 1}/${selectedRoute?.legs.length - 1}` : 
                                    'Back to Home'}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    From: {legIndex == 0 ? 'Home' : (closeMuseums[selectedRoute?.waypoint_order[legIndex - 1]].name)}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    To: {legIndex >= selectedRoute?.legs.length-1 ? 'Home' : (closeMuseums[selectedRoute?.waypoint_order[legIndex]].name)}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    Distance: {selectedRoute?.legs[legIndex].distance?.text}
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    Duration: {selectedRoute?.legs[legIndex].duration?.text}
                                </Typography>
                                <Button sx={{ marginTop: 1 }} onClick={handleNextLeg}>Next Museum</Button>
                            </>
                            ) : (
                            <Typography variant="body2" color="textPrimary">No route available.</Typography>
                            )}
                        </CardContent>
                        </Card>
                    </Box>
                )}
                <Box sx={{ position: 'absolute', top: 16, left: 16, width: 300, zIndex: 10 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Filters</Typography>
                            <Typography sx={{marginTop: 2}} variant="subtitle2" color="textPrimary">Minimum rating</Typography>
                            <Slider
                                value={minRating}
                                onChange={(e, value) => setMinRating(value as number)}
                                min={0}
                                max={5}
                                step={0.1}
                                valueLabelDisplay="auto"
                            />
                            <Typography sx={{marginTop: 1}} variant="subtitle2" color="textPrimary">Maximum number of museums</Typography>
                            <TextField
                                type="number"
                                value={maxMuseums}
                                onChange={(e) => setMaxMuseums(Math.min(Math.max(parseInt(e.target.value), 1), 9))}
                                inputProps={{ min: 1, max: 9 }}
                                fullWidth
                            />
                            <Typography sx={{marginTop: 1}} variant="subtitle2" color="textPrimary">Maximum distance (km)</Typography>
                            <Slider
                                value={maxDistance}
                                onChange={(e, value) => setMaxDistance(value as number)}
                                min={0}
                                max={20}
                                step={0.5}
                                valueLabelDisplay="auto"
                            />
                            <Button sx={{ marginTop: 1, marginRight: 3}} variant="contained" onClick={handleSearchRoute}>Search route</Button>
                            <Button sx={{ marginTop: 1 }} variant="contained" onClick={handleResetFilters}>Reset filters</Button>
                        </CardContent>
                    </Card>
                </Box>
            </div>
        </APIProvider>
        </ThemeProvider>)
        : <div>Loading... Please wait.</div>
    );
};

const createCustomRenderer = () => {
    return {
        render({ count, position }: { count: number, position: google.maps.LatLngLiteral }) {
            const svg = window.btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <rect x="5" y="15" width="30" height="20" fill="white" stroke="black" stroke-width="1"/>
                    <polygon points="5,15 20,5 35,15" fill="#ad9267" stroke="black" stroke-width="1"/>
                    <text x="50%" y="65%" text-anchor="middle" fill="#ad9267" font-size="20" font-family="Roboto" dy=".3em">${count}</text>
                </svg>
            `);

            const markerIcon = {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new window.google.maps.Size(40, 40),
            };
            return new window.google.maps.Marker({
                position,
                icon: markerIcon,
            });
        },
    };
};

const Markers = ({ museums, setOpen, setPhoto, setCenterPosition }: { museums: { mid: number; name: string; lat: number; lng: number; photo_path: string; }[], setOpen: (open: string) => void, setPhoto: (photo: string) => void, setCenterPosition: (centerPosition: { lat: number, lng: number }) => void}) => {
    const [markers, setMarkers] = useState<{ [mid: number]: Marker }>({});
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (map && !clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
            clusterer.current.setValues({ renderer: createCustomRenderer() })
        }
    }, [map]);

    useEffect(() => {
        if (clusterer.current) {
            clusterer.current.clearMarkers();
            clusterer.current.addMarkers(Object.values(markers));
        }
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, mid: number) => {
        if ((marker && markers[mid]) || (!marker && !markers[mid])) return;
        setMarkers(prev => {
            if (marker) {
                return { ...prev, [mid]: marker };
            } else {
                const { [mid]: _, ...newMarkers } = prev;
                return newMarkers;
            }
        });
    };

    return (
        <>
            {museums.map((museum) => (
                <AdvancedMarker
                    ref={(marker) => setMarkerRef(marker, museum.mid)}
                    key={museum.mid}
                    position={{ lat: museum.lat, lng: museum.lng }}
                    onClick={() => {
                        setOpen(museum.name);
                        setPhoto(museum.photo_path);
                        setCenterPosition({ lat: museum.lat, lng: museum.lng });
                    }}
                >
                    <Pin background={"white"} borderColor={"black"} glyphColor={"#ad9267"} />
                </AdvancedMarker>
            ))}
        </>
    );
}

function Directions({ selectedPosition, setRoutes, setLegIndex, legIndex, setDirections, directions, closeMuseums, setCloseMuseums, maxDistance, minRating, nrMuseums, refetchRoute, setRefetchRoute}: { selectedPosition: { lat: number, lng: number } | null, setRoutes: (routes: google.maps.DirectionsRoute[]) => void, setLegIndex: (legIndex: number) => void,legIndex: number, 
                    setDirections: (directions: google.maps.DirectionsResult | null) => void, directions: google.maps.DirectionsResult | null, closeMuseums: { mid: number, name: string, lat: number, lng: number }[], setCloseMuseums: (closeMuseums: { mid: number, name: string, lat: number, lng: number }[]) => void,
                    maxDistance: number, minRating: number, nrMuseums: number, refetchRoute: boolean, setRefetchRoute: (refetchRoute: boolean) => void} ) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [resetRenderer, setResetRenderer] = useState(false);

    useEffect(() => {
        if (!directionsRenderer) return;
        const direction = JSON.stringify(directions) ? JSON.parse(JSON.stringify(directions)) : null;
        direction?.routes[0].legs.splice(0, legIndex);
        direction?.routes[0].legs.splice(1, direction.routes[0].legs.length - 1);
        directionsRenderer.setDirections(direction);
        directionsRenderer.setRouteIndex(0);
        setResetRenderer(false);
    }, [legIndex, resetRenderer]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: {
            strokeColor: '#ad8252',
            strokeOpacity: 0.6,
            strokeWeight: 6
        }}));
    }, [map, routesLibrary])

    useEffect(() => {
        if (!selectedPosition) return;
        axios.get(`${config.SERVER_URL}/api/museums/closest`, {
            params: {
                lat: selectedPosition.lat,
                lng: selectedPosition.lng,
                maxdist: maxDistance,
                minrat: minRating,
                nrmus: nrMuseums,
            },
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
            .then(response => {
                setCloseMuseums(response.data);
            })
            .catch(() => {
            });
        map?.setCenter(selectedPosition);
        setRefetchRoute(false);
    }, [selectedPosition, refetchRoute]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;
        console.log(closeMuseums.length);
        if (!selectedPosition || closeMuseums.length == 0) {
            setDirections(null);
            return;
        }
        const waypoints = closeMuseums.map((museum) => ({ location: { lat: museum.lat, lng: museum.lng }, stopover: true }));
        directionsService.route({
            origin: selectedPosition,
            destination: selectedPosition,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
            transitOptions: {}
        }).then((response) => {
            setDirections(response);
            setLegIndex(0);
            setResetRenderer(true);
            setRoutes(response.routes);
        }).catch((error) => {
            setDirections(null);
            setLegIndex(0);
            setResetRenderer(true);
            setRoutes([]);
        });
    }, [directionsService, directionsRenderer, closeMuseums, setRoutes])

    return null;
}

const PlacesAutoComplete = ({ setSelectedPosition } : {setSelectedPosition : (selectedPosition: {lat: number, lng: number} | null) => void}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelect = async (event: any, newValue: any) => {
        if (newValue) {
            setValue(newValue, false);
            clearSuggestions();
            const result = await getGeocode({ address: newValue });
            const { lat, lng } = await getLatLng(result[0]);
            setSelectedPosition({ lat, lng });
        }
        else {
            setSelectedPosition(null);
        }
    };

    return (
        <Box sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-62%)', zIndex: 10, width: 300 }}>
            <Autocomplete
                freeSolo
                disableClearable
                options={status === 'OK' ? data.map(option => option.description) : []}
                inputValue={value}
                onInputChange={(event, newInputValue) => setValue(newInputValue)}
                onChange={handleSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Choose a starting point..."
                        disabled={!ready}
                        sx={{ bgcolor: '#171717', borderRadius: 1 }}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            endAdornment: (
                                <>
                                    {!ready ? <CircularProgress color="inherit" size={20} /> : null}
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

export default MapPage;
