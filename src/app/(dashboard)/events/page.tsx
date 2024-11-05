import Add from "@/components/Add";
import { IoMdAddCircleOutline } from "react-icons/io";


const events = []

const Events = () => {
    return (
        <div className="flex items-center justify-center grow">
            {
                events.length === 0 && <Add path="/events/add"/>
            }
        </div>
    );
}

export default Events