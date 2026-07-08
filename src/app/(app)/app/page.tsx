"use client";

import { usePersona } from "@/contexts/PersonaContext";
import { OrganizerDashboard } from "@/components/app/dashboard/OrganizerDashboard";
import { FanDashboard } from "@/components/app/dashboard/FanDashboard";
import { VolunteerDashboard } from "@/components/app/dashboard/VolunteerDashboard";

export default function AppPage() {
  const { persona } = usePersona();

  return (
    <div className="w-full h-full max-w-7xl mx-auto">
      {persona === "organizer" && <OrganizerDashboard />}
      {persona === "fan" && <FanDashboard />}
      {persona === "volunteer" && <VolunteerDashboard />}
    </div>
  );
}
