'use client'
import { createContext, useContext, useState } from 'react';

export type Rescue = { name: string, type?: string, location: google.maps.LatLngLiteral, distanceFromMe: number };

export interface RescueAppContext {
}

export const RescueAppContext = createContext<RescueAppContext>({});

export function useRescueAppContext(){
    const context = useContext(RescueAppContext);
    const [isNewRescueOpen, setNewRescueOpen]=useState<boolean>(false);

    return {
        isNewRescueOpen,
        setNewRescueOpen,
        currentRangeInMeters: 0,
        ...context,
    };
}