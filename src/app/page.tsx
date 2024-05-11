'use client'
import { RescueAppContext, useRescueAppContext } from "./context/app.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/hooks/persons/contexts";
import MapComponent from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import PeoplePopup from "@/components/PeoplePopup";
import { Slider } from "@nextui-org/react";

export default function Home() {
  const context = useRescueAppContext()
  return (
    <QueryClientProvider client={queryClient}>
        <RescueAppContext.Provider value={context}>
            <main style={{ display: 'flex', flexDirection: 'row' }}>
                <MapComponent />
                <Sidebar />
                <PeoplePopup />
            </main>
        </RescueAppContext.Provider>
    </QueryClientProvider>
  )
}
