import { useRescueAppContext } from "@/app/context/app.context";
import PeopleCardsSection from "./PeopleCardsSection";

export default function Sidebar() {
    const context = useRescueAppContext();
    function openPopup(){
        console.log('opening popup', context.setNewRescueOpen);
        context.setNewRescueOpen!(true);
        console.log('sidebar', context.isNewRescueOpen);
    }
    return (
        <section className="flex flex-col w-[25vw]">
            <button onClick={openPopup} type="button" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Preciso de um Resgate</button>
            <PeopleCardsSection />
        </section>
    )
}