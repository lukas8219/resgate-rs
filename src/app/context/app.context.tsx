'use client'
import { useListPersons } from '@/hooks/persons/persons.hook';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export type Rescue = { name: string, type?: string, location: google.maps.LatLngLiteral, distanceFromMe: number };

export interface RescueAppContext {
    nearbyPeople: Rescue[],
    currentRangeInMeters?: number,
    isNewRescueOpen?: boolean,
    setNewRescueOpen?: Dispatch<SetStateAction<boolean>>;
}

export const RescueAppContext = createContext<RescueAppContext>({ nearbyPeople: []});

export function useRescueAppContext(): RescueAppContext{
    const context = useContext(RescueAppContext);
    const [isNewRescueOpen, setNewRescueOpen]=useState<boolean>(false);
    const { data } = useListPersons();

    return {
        isNewRescueOpen,
        setNewRescueOpen,
        nearbyPeople: data.response || [],
        currentRangeInMeters: 0,
    };
}