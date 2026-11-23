import { useState } from "react";
import { Calendar } from "./ui/calendar";

export function LoreweaverCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sample events for demonstration
  const events = [
    { date: new Date(2025, 10, 20), title: "New Book Release: Chronicles of the Void" },
    { date: new Date(2025, 10, 25), title: "Author Q&A Session" },
    { date: new Date(2025, 11, 1), title: "The Unescapist Podcast Episode 12" },
    { date: new Date(2025, 11, 10), title: "Short Story Competition Deadline" },
  ];

  const selectedDateEvents = events.filter(
    (event) => 
      date && 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Calendar Widget */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border border-gray-600 shadow"
        />
      </div>

      {/* Events Display */}
      <div>
        <h3 className="mb-4 text-white">
          {date ? `Events for ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Select a date'}
        </h3>
        
        {selectedDateEvents.length > 0 ? (
          <ul className="space-y-3">
            {selectedDateEvents.map((event, index) => (
              <li key={index} className="p-3 bg-[#4a4553] rounded-md border border-gray-500">
                <p className="text-gray-200">{event.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No events scheduled for this date.</p>
        )}

        {/* Upcoming Events */}
        <div className="mt-8">
          <h3 className="mb-4 text-white">Upcoming Events</h3>
          <ul className="space-y-3">
            {events.map((event, index) => (
              <li key={index} className="p-3 bg-[#4a4553] rounded-md border border-gray-500">
                <p className="text-sm text-gray-300">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-gray-200">{event.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}