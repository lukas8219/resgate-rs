'use client'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo } from 'react';
import { useListPersons } from '@/hooks/persons/persons.hook';
import { Slider } from '@nextui-org/react';
import { useRescueAppContext } from '@/app/context/app.context';

const MapComponent: NextPage = () => {
    const { data: { response } } = useListPersons();
    const { currentRangeInMeters, setMaxDistance } = useRescueAppContext();

    const nearbyPeople = response;

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
        <div style={{ width: '75vw', height: '100vh' }}>
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
            <section
            className='bg-white shadow-md w-[25%] rounded-lg p-4'
            style={{
                    position: 'relative',
                    bottom: '10%',
                    left: '0px',
                    height: '10%'
            }}
            >
                <Slider
                    label="Distância"
                    key='slider'
                    radius='full'
                    step={0.01}
                    maxValue={10000}
                    minValue={500}
                    defaultValue={500}
                    onChange={(value) => setMaxDistance(Array.isArray(value) ? value[0] : value)}
                    value={currentRangeInMeters}
                    getValue={(value) => `${value}m`}
                    aria-label="Temperature"
                />
            </section>

        </div>
    );
};

export default MapComponent;