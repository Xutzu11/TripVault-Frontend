import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {AttractionWithPrice} from '../types';

function Directions({
    selectedPosition,
    setRoutes,
    setLegIndex,
    legIndex,
    setDirections,
    directions,
    closeAttractions,
    setCloseAttractions,
    maxDistance,
    maxPrice,
    minRating,
    nrAttractions,
    refetchRoute,
    setRefetchRoute,
    transportMode,
}: {
    selectedPosition: {lat: number; lng: number} | null;
    setRoutes: (routes: google.maps.DirectionsRoute[]) => void;
    setLegIndex: (legIndex: number) => void;
    legIndex: number;
    setDirections: (directions: google.maps.DirectionsResult | null) => void;
    directions: google.maps.DirectionsResult | null;
    closeAttractions: AttractionWithPrice[];
    setCloseAttractions: (closeAttractions: AttractionWithPrice[]) => void;
    maxDistance: number;
    maxPrice: number;
    minRating: number;
    nrAttractions: number;
    refetchRoute: boolean;
    setRefetchRoute: (refetchRoute: boolean) => void;
    transportMode: google.maps.TravelMode;
}) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] =
        useState<google.maps.DirectionsService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] =
        useState<google.maps.DirectionsRenderer | null>(null);
    const [resetRenderer, setResetRenderer] = useState(false);

    useEffect(() => {
        if (!directionsRenderer) return;
        const direction = JSON.stringify(directions)
            ? JSON.parse(JSON.stringify(directions))
            : null;
        direction?.routes[0].legs.splice(0, legIndex);
        direction?.routes[0].legs.splice(
            1,
            direction.routes[0].legs.length - 1,
        );
        directionsRenderer.setDirections(direction);
        directionsRenderer.setRouteIndex(0);
        setResetRenderer(false);
    }, [legIndex, resetRenderer]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(
            new routesLibrary.DirectionsRenderer({
                map,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#ad8252',
                    strokeOpacity: 0.6,
                    strokeWeight: 6,
                },
            }),
        );
    }, [map, routesLibrary]);

    useEffect(() => {
        if (!selectedPosition) return;
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/api/path/optimal`, {
                params: {
                    latitude: selectedPosition.lat,
                    longitude: selectedPosition.lng,
                    max_distance: maxDistance,
                    max_price: maxPrice,
                    min_rating: minRating,
                    nr_attractions: nrAttractions,
                },
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => {
                setCloseAttractions(response.data);
                console.log('Fetched close attractions:', response.data);
            })
            .catch(() => {});
        map?.setCenter(selectedPosition);
        setRefetchRoute(false);
    }, [selectedPosition, refetchRoute]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;
        console.log(closeAttractions.length);
        if (!selectedPosition || closeAttractions.length == 0) {
            setDirections(null);
            return;
        }
        const waypoints = closeAttractions.map((attraction) => ({
            location: {
                lat: Number(attraction.latitude),
                lng: Number(attraction.longitude),
            },
            stopover: true,
        }));
        console.log('Waypoints:', waypoints);
        directionsService
            .route({
                origin: selectedPosition,
                destination: selectedPosition,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: transportMode,
                provideRouteAlternatives: true,
                transitOptions: {},
            })
            .then((response) => {
                console.log('Directions response:', response);
                setDirections(response);
                setLegIndex(0);
                setResetRenderer(true);
                setRoutes(response.routes);
            })
            .catch((error) => {
                console.error('Error fetching directions:', error);
                setDirections(null);
                setLegIndex(0);
                setResetRenderer(true);
                setRoutes([]);
            });
    }, [directionsService, directionsRenderer, closeAttractions, setRoutes]);

    return null;
}

export default Directions;
