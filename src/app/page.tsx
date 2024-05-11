import Image from "next/image";
import MapComponent from "../components/Map";

type CardProps = {
  name: string,
  distanceFromMe?: number,
  location?: google.maps.LatLngLiteral,
}

function Card(props: CardProps) {
  return (<div className="bg-white shadow-md rounded-lg p-4">
    <p>{props.name}</p>
    <p>à {props.distanceFromMe}km</p>
  </div>)
}

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'row' }}>
      <MapComponent />
      <section className="flex flex-col w-[25vw]">
        <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Preciso de um Resgate</button>
        <section className="m-1 gap-1 grid grid-cols-2 justify-between">
          <Card name="something" distanceFromMe={5} />
          <Card name="something other" distanceFromMe={10} />
        </section>
      </section>
    </main>
  )
}
