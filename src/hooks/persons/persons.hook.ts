import { Rescue, useRescueAppContext } from "@/app/context/app.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./contexts";
import { useEffect, useMemo } from "react";
import { Subject, debounceTime, takeLast, throttleTime } from "rxjs";

export type RescueApiData = Omit<Rescue, 'distanceFromMe' | 'location'> & {
    location: [number, number]
}

export interface ApiResponse<T> {
    response: T[]
}

export function useCreatePerson(){
    return useMutation({
        mutationFn: async (data: Rescue) => {
            const formatedData = {
                ...data,
                location: [data.location.lng, data.location.lat], //mongo spatial queries use longitude before latitude
            }
            return fetch('/api/persons', { method: 'POST', body: JSON.stringify(formatedData) }).then(() => queryClient.invalidateQueries({ queryKey: ['persons', '/']}));
        }
    })
}

function formatPersonsPayload(data: RescueApiData): Rescue{
    return {
        ...data,
        location: {
            lat: data.location[1], //mongo spatial queries use longitude before latitude
            lng: data.location[0],
        },
        distanceFromMe: 0,
    }
}

async function fetchPersons(lat: number | undefined, lng: number | undefined, maxDistance: number){
    if(!lat || !lng){
        console.log('lat lng is empty');
        return { response: [] };
    }
    const urlParams = new URLSearchParams({ lat: String(lat), lng: String(lng), maxDistance: String(maxDistance) }).toString();
    const response = await fetch(`/api/persons?${urlParams}`, { method: 'GET' });
    const payload = await response.json();
    return {
        ...payload,
        response: payload.response.map(formatPersonsPayload),
    };
}

export function useListPersons(){
    const { currentRangeInMeters, userLocation } = useRescueAppContext();

    const refetchObservable = useMemo(() => new Subject<void>(), []);

    const useResults = useQuery<ApiResponse<Rescue>>({
        initialData: { response: [] },
        queryFn: () => fetchPersons(userLocation?.lat, userLocation?.lng, currentRangeInMeters),
        queryKey: ['persons', '/']
    });

    useEffect(() => {
        refetchObservable.pipe(
            debounceTime(100),
        )
        .subscribe(() => {
            queryClient.invalidateQueries({ queryKey: ['persons', '/']});
            useResults.refetch();
        })
    }, [])

    return {
        ...useResults,
        refetch: () => {
            console.log('calling next');
            refetchObservable.next();
        },
    }
}