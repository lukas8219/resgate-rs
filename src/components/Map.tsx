'use client'
import { GoogleMap, MarkerF, useLoadScript} from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo } from 'react';
import { useRescueAppContext } from '@/app/context/app.context';

const MapComponent: NextPage = () => {
    const {
        nearbyPeople,
     } = useRescueAppContext();

    const mapCenter = useMemo(
        () => ({ lat: -30.00803257303225, lng: -51.19590017596934 }),
        [nearbyPeople]
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false,
            clickableIcons: false,
            scrollwheel: true,
        }),
        [nearbyPeople]
    );

    const libraries = useMemo(() => ['maps', 'geocoding'] as const, [nearbyPeople]);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string, libraries: libraries as any });

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ width: '75vw', height: '100vh'}}>
            <GoogleMap
                id="main-map-places"
                options={mapOptions}
                zoom={12}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
            >
                {nearbyPeople.map((config, index) => <MarkerF key={index} position={config.location} />)}
            </GoogleMap>
        </div>
    );
};

export default MapComponent;