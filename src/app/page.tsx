'use client'
import { RescueAppContext } from "./context/app.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/hooks/persons/contexts";
import MapComponent from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import PeoplePopup from "@/components/PeoplePopup";

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
        <RescueAppContext.Provider value={{ nearbyPeople: [] }}>
            <main style={{ display: 'flex', flexDirection: 'row' }}>
                <MapComponent />
                <Sidebar />
            </main>
            <PeoplePopup />
        </RescueAppContext.Provider>
    </QueryClientProvider>
  )
}
