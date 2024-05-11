'use client'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { useListPersons } from '@/hooks/persons/persons.hook';
import { Slider, Switch } from '@nextui-org/react';
import { useRescueAppContext } from '@/app/context/app.context';
import { Subject, throttleTime } from 'rxjs';

const MapComponent: NextPage = () => {
    const { data: { response }, refetch } = useListPersons();
    const { currentRangeInMeters, setMaxDistance, isUsingCurrentLocation, setUsingCurrentLocation, setUserLocaion, userLocation,  } = useRescueAppContext();
    const [watch, setWatch]=useState<number | null>();

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

    useEffect(() => {
            if(isUsingCurrentLocation){
                const watchId = window.navigator.geolocation.watchPosition((position) => {
                    setUserLocaion(() => ({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }))
                    if(!isUsingCurrentLocation){
                        setUsingCurrentLocation(true);
                    }
                }, (err) => {
                    if(err){
                        console.error(err);
                    }
                    setUsingCurrentLocation(false);
                })
                setWatch(watchId);
            }
            if(!isUsingCurrentLocation){
                window.navigator.geolocation.clearWatch(watch as number);
                return setUsingCurrentLocation(false);
            }
    }, [isUsingCurrentLocation]);

    useEffect(refetch, [userLocation, currentRangeInMeters]);

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
                onClick={(e) => {
                    if(isUsingCurrentLocation){
                        return;
                    }
                    setUserLocaion(e.latLng?.toJSON() || null);
                }}
            >
                {userLocation ? <MarkerF position={userLocation} /> : null}
                {nearbyPeople.map((config, index) => <MarkerF key={index} position={config.location} />)}
            </GoogleMap>
            <section
                className='bg-white shadow-md w-[25%] rounded-lg p-4 flex flex-col gap-2 justify-center'
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
                    aria-label="distance"
                />
                <Switch
                    isSelected={isUsingCurrentLocation}
                    onValueChange={setUsingCurrentLocation}
                >
                    Usar minha localização
                    { !isUsingCurrentLocation ? <p className="text-small text-default-500 relative top-100">Clique no mapa para procurar</p> : null}
                </Switch>
                
            </section>

        </div>
    );
};

export default MapComponent;