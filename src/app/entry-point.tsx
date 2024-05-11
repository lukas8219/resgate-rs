import MapComponent from "@/components/Map";
import { RescueAppContext, useRescueAppContext } from "./context/app.context";
import Sidebar from "@/components/Sidebar";
import PeoplePopup from "@/components/PeoplePopup";

export function EntryPoint() {
    return (
        <RescueAppContext.Provider value={{ nearbyPeople: []}}>
            <main style={{ display: 'flex', flexDirection: 'row' }}>
                <MapComponent />
                <Sidebar />
                <PeoplePopup />
            </main>
        </RescueAppContext.Provider>
    )
}