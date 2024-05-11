'use client'
import { useLoadScript, GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { PeoplePopup } from './PeoplePopup';
import { Rescue, useRescueAppContext } from '@/app/context/app.context';

const MapComponent: NextPage = () => {
    const {
        setNewRescuePopupData,
        nearbyPeople,
        addPeople
     } = useRescueAppContext();

    const libraries = useMemo(() => ['maps'], [nearbyPeople]);
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

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        libraries: libraries as any,
    });

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            const key = event.key; // const {key} = event; in ES6+
            if (key === "Escape") {
                setNewRescuePopupData(undefined);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        }
    }, []);

    const handlePopupSubmit = (data: Rescue) => {
        addPeople(data);
        setNewRescuePopupData(undefined);
    }

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ width: '75vw', height: '100vh'}}>
            <GoogleMap
                options={mapOptions}
                zoom={12}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onClick={(clickEvent) => {
                    const position = clickEvent.latLng?.toJSON();
                    console.log(position);
                    setNewRescuePopupData(position);
                }}
            >
                {nearbyPeople.map((config, index) => <MarkerF key={index} position={config.location} />)}
            </GoogleMap>
            <PeoplePopup closePopup={() => setNewRescuePopupData(undefined)} handleSubmit={handlePopupSubmit} />
        </div>
    );
};

export default MapComponent;