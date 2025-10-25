// pages/Dashboard/OrganiserDashboard.jsx
import React, { useEffect, useState } from "react";
import OrganiserWelcomeBanner from "../../components/dashboard/Organiser/OrganiserWelcomeBanner";
import OrganiserQuickActions from "../../components/dashboard/Organiser/OrganiserQuickActions";
import EventsManaged from "../../components/dashboard/Organiser/EventsManaged";
import RegistrationsOverview from "../../components/dashboard/Organiser/RegistrationsOverview";
import OrganiserAnalytics from "../../components/dashboard/Organiser/OrganiserAnalytics";
import SpeakerTeamManagement from "../../components/dashboard/Organiser/SpeakerTeamManagement";
import EventReports from "../../components/dashboard/Organiser/EventReports";
import OrganiserNotifications from "../../components/dashboard/Organiser/OrganiserNotifications";
import OrganiserProfileOverview from "../../components/dashboard/Organiser/OrganiserProfileOverview";
import CreateEventForm from "../../components/dashboard/Organiser/CreateEventForm";
import API_BASE_URL from '../../api/authApi';

export default function OrganiserDashboard() {
  const [organiser, setOrganiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch organiser profile
        const profileRes = await fetch(`${API_BASE_URL}/api/organiser/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch organiser profile");
        const profileJson = await profileRes.json();
        const organiserData = profileJson.data || {};
        console.log("🔍 Organiser profile:", organiserData);

        // Fetch events managed by this organiser
        const eventsRes = await fetch(
          `${API_BASE_URL}/api/events?organiserId=${organiserData._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const eventsJson = await eventsRes.json();
        console.log("📦 Events returned:", eventsJson?.data);

        organiserData.eventsOrganized = eventsJson?.data || [];
        setOrganiser(organiserData);
      } catch (err) {
        console.error("Error fetching organiser dashboard data:", err);
        setOrganiser({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEventCreated = (newEvent) => {
    setOrganiser((prev) => ({
      ...prev,
      eventsOrganized: [newEvent, ...(prev?.eventsOrganized || [])],
    }));
    setShowCreateEvent(false);
  };

  if (showCreateEvent) {
    return (
      <CreateEventForm
        onCancel={() => setShowCreateEvent(false)}
        onEventCreated={handleEventCreated}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-cyan-400 text-xl">
          Loading your organiser dashboard...
        </span>
      </div>
    );
  }

  if (!organiser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-red-400 text-xl">
          Unable to load organiser data. Please log in again.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <OrganiserWelcomeBanner organiser={organiser} />

        {/* Quick Actions */}
        <OrganiserQuickActions onCreateEvent={() => setShowCreateEvent(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <EventsManaged events={organiser.eventsOrganized || []} />
            <RegistrationsOverview registrations={organiser.registrations || []} />
            <OrganiserAnalytics analytics={organiser.analytics || {}} />
            <SpeakerTeamManagement
              team={organiser.team || []}
              events={organiser.eventsOrganized || []}
              pendingInvitations={organiser.pendingInvitations || []}
            />
            <EventReports reports={organiser.reports || []} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <OrganiserProfileOverview organiser={organiser} />
            <OrganiserNotifications notifications={organiser.notifications || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
