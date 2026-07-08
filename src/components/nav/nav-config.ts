import {
  LayoutDashboard,
  Map,
  Users,
  AlertTriangle,
  MessageSquare,
  Settings,
  Zap,
  User,
  Navigation,
  Globe,
  Briefcase,
  Ticket,
  Train,
  type LucideIcon,
} from "lucide-react";
import type { Persona } from "@/contexts/PersonaContext";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  group?: string;
}

const ORGANIZER_NAV: NavItem[] = [
  {
    href: "/app",
    label: "Command Center",
    icon: LayoutDashboard,
    description: "Global operations overview",
    group: "OVERVIEW",
  },
  {
    href: "/app/heatmaps",
    label: "Live Heatmaps",
    icon: Map,
    description: "Monitor sector density",
    group: "OVERVIEW",
  },
  {
    href: "/app/dispatch",
    label: "Volunteer Dispatch",
    icon: Users,
    description: "Manage ground teams",
    group: "OPERATIONS",
  },
  {
    href: "/app/alerts",
    label: "Sector Alerts",
    icon: AlertTriangle,
    description: "Monitor Fan incidents",
    group: "OPERATIONS",
  },
  {
    href: "/app/assistant/operations",
    label: "Operations AI",
    icon: MessageSquare,
    description: "Ask the venue assistant",
    group: "INTELLIGENCE",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    description: "App preferences",
    group: "SYSTEM",
  },
];

const FAN_NAV: NavItem[] = [
  {
    href: "/app",
    label: "My Journey",
    icon: LayoutDashboard,
    description: "Matchday schedule",
    group: "MATCHDAY",
  },
  {
    href: "/app/ticket",
    label: "My Ticket",
    icon: Ticket,
    description: "Digital Match Ticket",
    group: "MATCHDAY",
  },
  {
    href: "/app/wayfinding",
    label: "Wayfinding",
    icon: Navigation,
    description: "Find your seat",
    group: "MATCHDAY",
  },
  {
    href: "/app/transit",
    label: "Transportation",
    icon: Train,
    description: "Metro & Parking",
    group: "MATCHDAY",
  },
  {
    href: "/app/assistant/fan",
    label: "Fan Copilot",
    icon: MessageSquare,
    description: "Ask for help in your language",
    group: "SUPPORT",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    description: "App preferences",
    group: "SYSTEM",
  },
];

const VOLUNTEER_NAV: NavItem[] = [
  {
    href: "/app",
    label: "My Tasks",
    icon: Briefcase,
    description: "Current assignments",
    group: "GROUND OPS",
  },
  {
    href: "/app/alerts",
    label: "Sector Alerts",
    icon: AlertTriangle,
    description: "Active incidents",
    group: "GROUND OPS",
  },
  {
    href: "/app/assistant/volunteer",
    label: "Translation AI",
    icon: Globe,
    description: "Live multilingual help",
    group: "SUPPORT",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    description: "App preferences",
    group: "SYSTEM",
  },
];

export function getAppNav(persona: Persona): NavItem[] {
  switch (persona) {
    case "organizer":
      return ORGANIZER_NAV;
    case "fan":
      return FAN_NAV;
    case "volunteer":
      return VOLUNTEER_NAV;
    default:
      return ORGANIZER_NAV;
  }
}

/** Secondary links shown in headers/footers. */
export const INFO_NAV = [
  { href: "/how-it-works", label: "How it Works", icon: Zap },
  { href: "/developer", label: "Developer", icon: User },
];
