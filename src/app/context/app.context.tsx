'use client'
import { useLoadScript } from '@react-google-maps/api';
import { createContext, useContext, useMemo, useState } from 'react';

export type Rescue = { name: string, type?: string, location: google.maps.LatLngLiteral, distanceFromMe: number };

export interface RescueAppContext {
    nearbyPeople: Rescue[],
    currentRangeInMeters?: number,
}

export const RescueAppContext = createContext<RescueAppContext>({ nearbyPeople: [
    {
        name: 'Lucas',
        distanceFromMe: 10,
        location: {
            lat: 1,
            lng: 1
        }
    }
] });

export function useRescueAppContext(){
    const context = useContext(RescueAppContext);
    const [isNewRescueOpen, setNewRescueOpen]=useState<boolean>(false);

    function addPeople(data: Rescue) {
        context.nearbyPeople = context.nearbyPeople.concat(data);
    }

    return {
        addPeople,
        isNewRescueOpen,
        setNewRescueOpen,
        ...context,
    };
}