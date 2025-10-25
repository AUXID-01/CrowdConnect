import React, { useEffect, useState } from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import QuickActions from "../../components/dashboard/QuickActions";
import Notifications from "../../components/dashboard/Notifications";
import Connections from "../../components/dashboard/Connections";
import ProfileOverview from "../../components/dashboard/ProfileOverview";
import UpcomingEvents from "../../components/dashboard/UpcomingEvents";
import EventRecommendations from "../../components/dashboard/EventRecommendations";
import PastEvents from "../../components/dashboard/PastEvents";
import MySchedule from "../../components/dashboard/MySchedule";
import API_BASE_URL from '../../api/authApi';

export default function AttendeeDashboard() {
  const [attendee, setAttendee] = useState(null);
  const [eventData, setEventData] = useState({
    upcoming: [],
    recommended: [],
    past: [],
    calendar: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch attendee profile
    async function fetchAttendee() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/attendee/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch attendee profile");

        const json = await res.json();
        if (json.success) {
          const attendeeData = json.data;
          const stats = {
            eventsRegistered: attendeeData.registeredEvents?.length || 0,
            connections: attendeeData.connections?.length || 0,
            profileComplete: attendeeData.profileComplete || 0,
          };
          setAttendee({ ...attendeeData, stats });
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Fetch events
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) throw new Error("Failed to fetch events");

        const json = await res.json();
        if (json.success) {
          setEventData({
            upcoming: json.data || [],
            recommended: [],
            past: [],
            calendar: [],
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    Promise.all([fetchAttendee(), fetchEvents()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-cyan-400 text-xl">Loading your dashboard…</span>
      </div>
    );
  }

  if (!attendee) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-red-400 text-xl">
          Unable to load attendee profile. Please log in again.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <WelcomeBanner user={attendee} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <UpcomingEvents events={eventData.upcoming || []} />
            <MySchedule calendarEvents={eventData.calendar || []} />
            <EventRecommendations events={eventData.recommended || []} />
            <PastEvents pastEvents={eventData.past || []} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ProfileOverview user={attendee || {}} />
            <Notifications notifications={attendee?.notifications || []} />
            <Connections connections={attendee?.connections || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
