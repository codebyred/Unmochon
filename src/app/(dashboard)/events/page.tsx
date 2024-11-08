import Add from "@/components/Add";
import { getEvents } from "@/actions/events";
import ItemCard from "@/components/ItemCard"
import { Event } from "@/lib/types";
import { MouseEvent } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddItemCard from "@/components/AddItemCard";

const Events = async () => {

    const events: Event[] = await getEvents();

    return (

        events.length === 0
            ?
            <div className="flex items-center justify-center grow">
                <Add path="/events/add" />
            </div>
            :
            <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {
                    events.map((item, index) => (
                        <ItemCard
                            key={item.id}
                            title={item.eventName}
                        />
                    ))
                }

                <AddItemCard href="/events/add"/>
                    
            </div>

    );
}

export default Events