'use client'
import { useDisclosure } from '@nextui-org/react';
import { createContext, useContext, useState } from 'react';

export type Rescue = { _id?: string, name: string, type?: string, situation: string, location: google.maps.LatLngLiteral, distanceFromMe?: number };

export interface RescueAppContext {
}

export const RescueAppContext = createContext<RescueAppContext>({});

export function useRescueAppContext(){
    const context = useContext(RescueAppContext);
    const { isOpen, onOpenChange, onOpen} = useDisclosure();
    const [maxDistance, setMaxDistance]=useState<number>(500);
    const [isUsingCurrentLocation, setUsingCurrentLocation]=useState<boolean>(true);
    const [userLocation, setUserLocaion]=useState<google.maps.LatLngLiteral | null>(null);

    return {
        isNewRescueOpen: isOpen,
        setNewRescueOpen: function(value: boolean){
            if(value){
                return onOpen();
            }
            if(!value && isOpen){
                return onOpenChange();
            }
        },
        currentRangeInMeters: maxDistance,
        setMaxDistance,
        isUsingCurrentLocation,
        setUsingCurrentLocation,
        userLocation,
        setUserLocaion,
        ...context,
    };
}