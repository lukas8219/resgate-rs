'use client'
import { Circle, GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useListPersons } from '@/hooks/persons/persons.hook';
import { Button, Slider, Switch } from '@nextui-org/react';
import { useRescueAppContext } from '@/app/context/app.context';
import { Subject, throttleTime } from 'rxjs';
import PeopleCardsSection from './PeopleCardsSection';

const MapComponent: NextPage = () => {
    const { data: { response }, refetch } = useListPersons();
    const { currentRangeInMeters, setMaxDistance, isUsingCurrentLocation, setUsingCurrentLocation, setUserLocaion, userLocation, setNewRescueOpen } = useRescueAppContext();
    const [watch, setWatch] = useState<number | null>();
    const mapRef = useRef<google.maps.Map | undefined>();
    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, [])

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
        if (isUsingCurrentLocation) {
            const watchId = window.navigator.geolocation.watchPosition((position) => {
                setUserLocaion(() => ({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }))
                if (!isUsingCurrentLocation) {
                    setUsingCurrentLocation(true);
                }
            }, (err) => {
                if (err) {
                    console.error(err);
                }
                setUsingCurrentLocation(false);
            })
            setWatch(watchId);
        }
        if (!isUsingCurrentLocation) {
            window.navigator.geolocation.clearWatch(watch as number);
            return setUsingCurrentLocation(false);
        }
    }, [isUsingCurrentLocation]);

    useEffect(refetch, [userLocation, currentRangeInMeters]);


    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div className='w-screen h-screen'>
            <GoogleMap
                id="main-map-places"
                options={mapOptions}
                zoom={12}
                center={mapCenter}
                onLoad={onMapLoad}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onClick={(e) => {
                    if (isUsingCurrentLocation) {
                        return;
                    }
                    setUserLocaion(e.latLng?.toJSON() || null);
                }}
            >
                {userLocation ?
                    <>
                        <MarkerF label='Eu' icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png' position={userLocation} />
                        <Circle
                            center={userLocation}
                            radius={currentRangeInMeters}
                            options={{fillOpacity: 0.15, strokeOpacity: 0.15}}
                        />
                    </>
                    : null}
                {nearbyPeople.map((config, index) => <MarkerF label={`#${index}`} key={index} position={config.location} />)}
            </GoogleMap>
            <section
                className='p-4 pt-0 fixed bottom-0 left-0 z-50 w-full h-1/8 bg-white border-t border-gray-200 dark:bg-white-700 dark:border-gray-600 shadow-md flex flex-col gap-2 justify-center'
            >
                <PeopleCardsSection mapRef={mapRef} />
                <button
                    onClick={() => setNewRescueOpen!(() => true)}
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Preciso de um Resgate
                </button>
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
                    {!isUsingCurrentLocation ? <p className="text-small text-default-500 relative top-100">Clique no mapa para procurar</p> : null}
                </Switch>
                <a className='small-text'><b>Contato:</b> lucas.polesello@lwpsoftwares.com <b>Instagram:</b> @luucaspole</a>
            </section>

        </div>
    );
};

export default MapComponent;