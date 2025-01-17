
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar, CalendarDayView, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView } from "../calendar/full-calendar";
import { getEvents } from "@/actions/events";
import { ErrorDiv } from "@/components/ErrorDiv"

const StudentDashboard = async() => {

    const eventsResult = await getEvents();

    if(!eventsResult.success) return <ErrorDiv message={eventsResult.error.message}/>

    const {data: events} = await eventsResult;

    return (
        <div className="p-4 shadow-custom rounded-lg">
            <Calendar
                events={ events.map((event)=>{
                        return  {
                            id: event.id,
                            start: event.registrationDeadline,
                            end: event.projectSubmissionDeadline,
                            title: event.name,
                            color: 'pink',
                        }
                    })
                }
            >
                <div className="h-dvh py-6 flex flex-col">
                    <div className="flex px-6 items-center gap-2 mb-6">
                        <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
                            Day
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="week"
                            className="aria-[current=true]:bg-accent"
                        >
                            Week
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="month"
                            className="aria-[current=true]:bg-accent"
                        >
                            Month
                        </CalendarViewTrigger>
                        <CalendarViewTrigger
                            view="year"
                            className="aria-[current=true]:bg-accent"
                        >
                            Year
                        </CalendarViewTrigger>
                        <CalendarPrevTrigger>
                            <ChevronLeft size={20} />
                            <span className="sr-only">Previous</span>
                        </CalendarPrevTrigger>

                        <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                        <CalendarNextTrigger>
                            <ChevronRight size={20} />
                            <span className="sr-only">Next</span>
                        </CalendarNextTrigger>
                    </div>

                    <div className="flex-1 overflow-auto px-6 relative">
                        <CalendarDayView />
                        <CalendarWeekView />
                        <CalendarMonthView />
                        <CalendarYearView />
                    </div>
                </div>
            </Calendar>
        </div>
    );
}

export default StudentDashboard;