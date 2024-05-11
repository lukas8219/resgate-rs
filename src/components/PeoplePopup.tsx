'use client'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Rescue, useRescueAppContext } from '@/app/context/app.context';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Subject, debounce, filter, interval } from 'rxjs';

type PeoplePopupProps = {};

export default function PeoplePopup({ }: PeoplePopupProps) {
    const { isNewRescueOpen, setNewRescueOpen, nearbyPeople, addPeople } = useRescueAppContext()
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | undefined>();
    const [placesService, setPlacesService] = useState<google.maps.Geocoder>();
    const [foundLocations, setSearchedLocations] = useState<any[]>([]);

    const observable = useMemo(() => new Subject<string>(), [selectedLocation]);

    useEffect(() => {
        observable.pipe(
            filter(Boolean),
            debounce(() => interval(500)),
        ).subscribe(async (query: string) => {
            const results = await placesService?.geocode({
                address: query
            })
            const formattedResults = results?.results.map((r) => {
                return {
                    location: r.geometry.location,
                    address: r.formatted_address,
                }
            })
            setSearchedLocations(() => formattedResults || []);
        })
    })

    const mapCenter = useMemo(
        () => ({ lat: -30.00803257303225, lng: -51.19590017596934 }),
        [selectedLocation]
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false,
            clickableIcons: false,
            scrollwheel: true,
        }),
        [selectedLocation]
    );

    const libraries = useMemo(() => ['maps', 'geocoding'], [selectedLocation]);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string, libraries: libraries as any });

    function closePopup() {
        setNewRescueOpen(false);
        formik.resetForm();
        setSelectedLocation(undefined);
    }

    function handleSubmit(data: Rescue) {
        addPeople(data);
        formik.resetForm();
        setSearchedLocations([]);
        setSelectedLocation(undefined);
        setNewRescueOpen(false);
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'homem',
            situation: 'esperando resgate',
            extraInfo: ''
        },
        onSubmit: values => {
            formik.resetForm({ values: { name: '', type: 'homem', extraInfo: '', situation: 'esperando resgate' } });
            if (selectedLocation) {
                handleSubmit({
                    location: selectedLocation,
                    ...values,
                    distanceFromMe: 10,
                });
            }
        },
    })

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            const key = event.key; // const {key} = event; in ES6+
            if (key === "Escape") {
                closePopup()
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        }
    }, []);

    const onLoad = useCallback((ref: google.maps.Map) => {
        const service = new google.maps.Geocoder();
        setPlacesService(() => service);
    }, [selectedLocation])

    if (!isLoaded) {
        return <p>Loading...</p>
    }

    return (
        <div className={`z-[9999] ${!isNewRescueOpen ? 'hidden' : ''} fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome
                    </label>
                    <input name='name' value={formik.values.name} onChange={formik.handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="npme" type="text" placeholder="Nome" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tipo de Regaste
                    </label>
                    <select name='type' value={formik.values.type} onChange={formik.handleChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value='homem'>Homem</option>
                        <option value='mulher'>Mulher</option>
                        <option value='crianca'>Criança</option>
                        <option value='animal'>Animal</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Informação Adicional
                    </label>
                    <input name='extraInfo' value={formik.values.extraInfo} onChange={formik.handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="npme" type="text" placeholder="Nome" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Situação
                    </label>
                    <select name='situation' value={formik.values.situation} onChange={formik.handleChange} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value='esperando resgate'>Esperando Resgate</option>
                        <option value='esperando resgate - grave'>Esperando Resgate - Grave</option>
                        <option value='resgatado'>Resgatado</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Endereço - Ajuda se for c/ número!
                    </label>
                    <Autocomplete
                        onInputChange={(input) => observable.next(input)}
                        onSelectionChange={(key) => {
                            const current = foundLocations?.find((item) => item.address === key);
                            if (!current) {
                                return;
                            }
                            debugger;
                            console.log(current.location);
                            setSelectedLocation(current.location);
                        }}
                        items={foundLocations}
                    >
                        {(location) => <AutocompleteItem key={`${location.address}`} value={location.address}>{location.address}</AutocompleteItem>}
                    </Autocomplete>
                </div>
                <div className='w-[100vw] h-[50vh] p-1'>
                    <GoogleMap
                        options={mapOptions}
                        zoom={12}
                        center={selectedLocation || mapCenter}
                        mapTypeId={google.maps.MapTypeId.ROADMAP}
                        onLoad={onLoad}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        onClick={(clickEvent) => {
                            const position = clickEvent.latLng?.toJSON();
                            setSelectedLocation(() => position);
                        }}
                    >
                        {selectedLocation ? <MarkerF position={selectedLocation} /> : null}
                    </GoogleMap>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Enviar
                </button>
                <input value='Fechar' type='button' className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={closePopup} />
            </form>
        </div>
    )
}