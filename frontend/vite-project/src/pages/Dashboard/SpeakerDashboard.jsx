import React, { useEffect, useState } from "react";
import SpeakerWelcomeBanner from "../../components/dashboard/Speaker/SpeakerWelcomeBanner";
import SpeakerProfileOverview from "../../components/dashboard/Speaker/SpeakerProfileOverview";
import MySessions from "../../components/dashboard/Speaker/MySessions";
import EventInvites from "../../components/dashboard/Speaker/EventInvites";
import API_BASE_URL from '../../api/authApi';

const SpeakerDashboard = () => {
  const [speakerData, setSpeakerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeaker = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/speaker/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch speaker profile");

        const json = await res.json();
        setSpeakerData(json.data || {});
      } catch (err) {
        console.error("Error fetching speaker data:", err);
        setSpeakerData({});
      } finally {
        setLoading(false);
      }
    };

    fetchSpeaker();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-cyan-400 text-xl">Loading your speaker dashboard…</span>
      </div>
    );
  }

  if (!speakerData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <span className="text-red-400 text-xl">Unable to load speaker data. Please log in again.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <SpeakerWelcomeBanner 
          speaker={{ 
            name: speakerData?.userId?.username || "Speaker",
            sessions: speakerData?.sessions?.length ?? 0
          }} 
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column - Sessions & Invitations */}
          <div className="lg:col-span-2 space-y-6">
            <EventInvites invites={speakerData?.invites || []} />
            <MySessions sessions={speakerData?.sessions || []} />
          </div>

          {/* Left Column - Profile Sidebar */}
          <div>
            <SpeakerProfileOverview speaker={speakerData || {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
