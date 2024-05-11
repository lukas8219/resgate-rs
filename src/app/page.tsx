'use client'
import { Rescue, RescueAppContext, useRescueAppContext } from "./context/app.context";
import MapComponent from "../components/Map";

function PersonCard(props: Rescue) {
  return (<div className="bg-white shadow-md rounded-lg p-4">
    <p>{props.name}</p>
    <p>à {props.distanceFromMe}km</p>
  </div>)
}

export default function Home() {
  const context = useRescueAppContext();
  return (
    <RescueAppContext.Provider value={context}>
      <main style={{ display: 'flex', flexDirection: 'row' }}>
        <MapComponent />
        <section className="flex flex-col w-[25vw]">
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Preciso de um Resgate</button>
          <section className="m-1 gap-1 grid grid-cols-2 justify-between">
            {...context.nearbyPeople.map((props) => <PersonCard {...props} />)}
          </section>
        </section>
      </main>
    </RescueAppContext.Provider>
  )
}
