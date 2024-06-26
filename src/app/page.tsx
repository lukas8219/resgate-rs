'use client'
import { RescueAppContext, useRescueAppContext } from "./context/app.context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/hooks/persons/contexts";
import MapComponent from "@/components/Map";
import PeoplePopup from "@/components/PeoplePopup";

export default function Home() {
  const context = useRescueAppContext()
  return (
    <QueryClientProvider client={queryClient}>
        <RescueAppContext.Provider value={context}>
            <main style={{ display: 'flex', flexDirection: 'row' }}>
                <MapComponent />
                <PeoplePopup />
            </main>
        </RescueAppContext.Provider>
    </QueryClientProvider>
  )
}
