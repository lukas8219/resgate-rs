'use client'
import { Rescue, useRescueAppContext } from "@/app/context/app.context";
import { useListPersons } from "@/hooks/persons/persons.hook";
import { Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import { MutableRefObject, useEffect } from "react";

export interface PersonPopoverProps {
    onCentralize: (location: google.maps.LatLngLiteral) => void
}

function PersonPopover(props: Rescue & PersonPopoverProps & { index: number }) {
    return (
        <Popover
        placement="top"
        >
            <PopoverTrigger>
                <Button className="min-w-[15ch] max-w-[25ch] w-fit whitespace-nowrap">
                    <div className="text-small font-bold truncate">#{props.index} {props.name}</div>
                    <div className="text-tiny">{props.distanceFromMe}m</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2 flex flex-col gap-1 min-w-[15ch] max-w-[25ch] w-fit">
                    <div className="text-small font-bold truncate">{props.name}</div>
                    <div className="text-tiny justify-end">à {props.distanceFromMe}m</div>
                    <Button onClick={() => props.onCentralize(props.location)} className="w-full">Centralizar</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export interface PeopleCardSection {
    mapRef: MutableRefObject<google.maps.Map | undefined>
}

export default function PeopleCardsSection({ mapRef }: PeopleCardSection) {
    const { userLocation, currentRangeInMeters } = useRescueAppContext()
    const { data, refetch } = useListPersons();

    useEffect(refetch, [userLocation, currentRangeInMeters]);

    function onCentralize(location: google.maps.LatLngLiteral){
        mapRef.current?.setCenter(location);
    }

    return (
        <section className="gap-1 flex flex-row justify-start overflow-x-auto">
            {...(data.response || []).map((props, _index) => <PersonPopover onCentralize={onCentralize} key={`person-card-${_index}`} {...props} index={_index} />)}
        </section>
    )
}