'use client'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Rescue, useRescueAppContext } from '@/app/context/app.context';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner } from '@nextui-org/react';
import { Subject, debounce, filter, interval } from 'rxjs';
import { useCreatePerson } from '@/hooks/persons/persons.hook';
import * as Yup from 'yup';
import _ from 'lodash';

const RescueSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Muito Curto')
        .required('Por favor, preencha o nome!'),
    type: Yup.string().oneOf(['adult', 'child', 'animal']).required('Escolha entre adulto, criança ou animal'),
    situation: Yup.string().oneOf(['waiting-rescue', 'waiting-rescue-severe']).required('Escolha entre grave ou normal'),
    extraInfo: Yup.string().min(0).max(500)
});

type PeoplePopupProps = {};

export default function PeoplePopup({ }: PeoplePopupProps) {
    const { isNewRescueOpen, setNewRescueOpen } = useRescueAppContext()
    const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>();
    const [placesService, setPlacesService] = useState<google.maps.Geocoder>();
    const [foundLocations, setSearchedLocations] = useState<any[]>([]);
    const mutatePersons = useCreatePerson();

    const [isLocationLoading, setLocationLoading]=useState<boolean>(false);

    const [step, setStep] = useState<number>(0);

    const observable = useMemo(() => new Subject<string>(), []);

    useEffect(() => {
        observable.pipe(
            filter(Boolean),
            debounce(() => interval(500)),
        ).subscribe(async (query: string) => {
            setLocationLoading(() => true);
            const results = await placesService?.geocode({
                address: query
            })
            const formattedResults = results?.results.map((r) => {
                return {
                    placeId: r.place_id,
                    location: r.geometry.location,
                    address: r.formatted_address,
                }
            })
            setSearchedLocations(() => formattedResults || []);
            setLocationLoading(() => false);
        })
    }, [])

    const mapCenter = useMemo(
        () => ({ lat: -30.00803257303225, lng: -51.19590017596934 }),
        [selectedLocation, isNewRescueOpen]
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false,
            clickableIcons: false,
            scrollwheel: true,
        }),
        [selectedLocation, isNewRescueOpen]
    );

    const libraries = useMemo(() => ['maps', 'geocoding'], [selectedLocation, isNewRescueOpen]);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string, libraries: libraries as any });

    function closePopup() {
        setNewRescueOpen!(false);
        formik.resetForm();
        setSelectedLocation(undefined);
        setStep(0);
    }

    async function handleSubmit(data: Rescue) {
        await mutatePersons.mutateAsync(data);
        formik.resetForm();
        setSearchedLocations([]);
        setSelectedLocation(undefined);
        setNewRescueOpen!(false);
        setStep(0);
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'adult',
            situation: 'waiting-rescue',
            extraInfo: '',
        },
        validationSchema: RescueSchema,
        onSubmit: values => {
            formik.resetForm({ values: { name: '', type: 'adult', extraInfo: '', situation: 'waiting-rescue' } });
            if (selectedLocation) {
                const location = selectedLocation.toJSON();
                handleSubmit({
                    ...values,
                    location,
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
    }, [isNewRescueOpen]);

    const onLoad = useCallback((ref: google.maps.Map) => {
        const service = new google.maps.Geocoder();
        setPlacesService(() => service);
    }, [selectedLocation, isNewRescueOpen])

    const isReady = useMemo<boolean>(() => formik.isValid && !!selectedLocation, [formik.isValid, selectedLocation]);

    if (!isLoaded) {
        return <p>Loading...</p>
    }

    console.log(step);

    return (
        <Modal onClose={closePopup} placement='center' isOpen={isNewRescueOpen}>
            <ModalContent>
                <ModalHeader>Novo Resgate</ModalHeader>
                <ModalBody>
                    <div>
                        {step === 0 ?
                            <>
                                <Autocomplete
                                    variant='bordered'
                                    label='Endereço'
                                    placeholder='Mais completo que der'
                                    onInputChange={(input) => observable.next(input)}
                                    onSelectionChange={(key) => {
                                        const current = foundLocations?.find((item) => item.placeId === key);
                                        if (!current) {
                                            return;
                                        }
                                        setSelectedLocation(current.location);
                                    }}
                                    items={foundLocations}
                                    endContent={isLocationLoading ? <Spinner /> : null}
                                >
                                    {(location) => <AutocompleteItem key={location.placeId} value={location.address}>{location.address}</AutocompleteItem>}
                                </Autocomplete>
                                <div className='w-100 h-[50vh] p-1'>
                                    <GoogleMap
                                        options={mapOptions}
                                        zoom={12}
                                        center={selectedLocation || mapCenter}
                                        mapTypeId={google.maps.MapTypeId.ROADMAP}
                                        onLoad={onLoad}
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        onClick={async (clickEvent) => {
                                            const position = clickEvent.latLng;
                                            setSelectedLocation(() => position);
                                        }}
                                    >
                                        {selectedLocation ? <MarkerF position={selectedLocation} /> : null}
                                    </GoogleMap>
                                </div>
                            </>
                            : null}
                        {step === 1 ?
                            <>
                                <form className='flex flex-col gap-y-2' onSubmit={formik.handleSubmit}>
                                    <Input
                                        isInvalid={!!formik.errors.name}
                                        errorMessage={formik.errors.name}
                                        required
                                        label="Nome"
                                        placeholder="Quem precisa de resgate?"
                                        variant="bordered" name='name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        id="nome"
                                        type="text" />
                                    <Select
                                        label="Quem"
                                        variant='bordered'
                                        name='type'
                                        placeholder='Adulto/Criança/Animal'
                                        selectedKeys={[formik.values.type]}
                                        selectionMode='single'
                                        onChange={formik.handleChange}
                                        required
                                        isInvalid={!!formik.errors.type}
                                        errorMessage={formik.errors.type}
                                    >
                                        <SelectItem key='adult' value='adult'>
                                            Adulto
                                        </SelectItem>
                                        <SelectItem key='child' value='child'>
                                            Criança
                                        </SelectItem>
                                        <SelectItem key='animal' value='animal'>
                                            Animal
                                        </SelectItem>
                                    </Select>
                                    <Input
                                        isInvalid={!!formik.errors.extraInfo}
                                        errorMessage={formik.errors.extraInfo}
                                        label="Informação Adicional"
                                        placeholder="Informação Adicional ou N/A"
                                        variant="bordered"
                                        name='extraInfo'
                                        value={formik.values.extraInfo}
                                        onChange={formik.handleChange}
                                        id="extraInfo"
                                        type="text" />
                                    <Select
                                        label="Situação"
                                        variant='bordered'
                                        name='situation'
                                        placeholder='Esperando Resgate - Normal/Grave'
                                        selectedKeys={[formik.values.situation]}
                                        selectionMode='single'
                                        onChange={formik.handleChange}
                                        required
                                        isInvalid={!!formik.errors.situation}
                                        errorMessage={formik.errors.situation}
                                    >
                                        <SelectItem key='waiting-rescue' value='waiting-rescue'>
                                            Normal
                                        </SelectItem>
                                        <SelectItem key='waiting-rescue-severe' value='waiting-rescue-severe'>
                                            Grave
                                        </SelectItem>
                                    </Select>
                                </form>
                            </> : null}
                    </div>
                </ModalBody>
                <ModalFooter>
                    {step !== 0 ?
                        <>
                            <Button value='Anterior' type='button' variant='bordered' color='primary'  onClick={() => setStep((value) => --value)}>Anterior</Button>
                        </> : null}
                    {step === 0 ? <>
                        <Button disabled={!!!selectedLocation} color={!!selectedLocation ? 'primary' : 'default'} type="submit" onClick={() => setStep((value) => ++value)}>
                            {selectedLocation ? 'Próximo' : 'Aponte a localização!'}
                        </Button>
                    </> : null}
                    {step === 1 ? <>
                        <Button disabled={!isReady} color={isReady ? 'primary' : 'default'} type="submit" onClick={formik.submitForm}>
                            Enviar
                        </Button>
                    </> : null}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}