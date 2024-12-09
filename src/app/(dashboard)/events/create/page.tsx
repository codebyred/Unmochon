import CreateEventForm from "@/components/form/CreateEventForm"

const CreateEvent = () => {

    return <div className="p-4 grow shadow-custom rounded-lg" data-cy="addEvent-page">
        <CreateEventForm/>
    </div>

}

export default CreateEvent;