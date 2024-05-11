import { Rescue, useRescueAppContext } from "@/app/context/app.context";

function PersonCard(props: Rescue) {
    return (<div className="bg-white shadow-md rounded-lg p-4">
        <p>{props.name}</p>
        <p>à {props.distanceFromMe}km</p>
    </div>)
}


export default function PeopleCardsSection() {
    const { nearbyPeople } = useRescueAppContext()
    return (
        <section className="m-1 gap-1 grid grid-cols-2 justify-between">
            {...(nearbyPeople || []).map((props, _index) => <PersonCard key={`person-card-${_index}`} {...props} />)}
        </section>
    )
}