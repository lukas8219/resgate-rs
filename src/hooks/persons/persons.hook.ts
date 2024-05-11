import { Rescue } from "@/app/context/app.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./contexts";

export type RescueApiData = Omit<Rescue, 'distanceFromMe' | 'location'> & {
    location: [number, number]
}

export interface ApiResponse<T> {
    response: T[]
}

export function useCreatePerson(){
    return useMutation({
        mutationFn: async (data: RescueApiData) => {
            return fetch('/api/persons', { method: 'POST', body: JSON.stringify(data) }).then(() => queryClient.invalidateQueries({ queryKey: ['persons', '/']}));
        }
    })
}

function formatPersonsPayload(data: RescueApiData): Rescue{
    return {
        ...data,
        location: {
            lat: data.location[0],
            lng: data.location[1],
        },
        distanceFromMe: 0,
    }
}

async function fetchPersons(){
    const response = await fetch('/api/persons/', { method: 'GET' });
    const payload = await response.json();
    return {
        ...payload,
        response: payload.response.map(formatPersonsPayload),
    };
}

export function useListPersons(){
    return useQuery<ApiResponse<Rescue>>({
        initialData: { response: [] },
        queryFn: fetchPersons,
        queryKey: ['persons', '/']
    });
}