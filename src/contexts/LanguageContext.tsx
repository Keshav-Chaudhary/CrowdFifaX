"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "EN" | "FR" | "ES";

export const translations = {
  EN: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_ticket: "My Ticket",
    nav_wayfinding: "Wayfinding",
    nav_transit: "Transportation",
    nav_assistant: "Fan Assistant",
    nav_alerts: "System Alerts",
    nav_settings: "Settings",
    nav_dispatch: "Dispatch Ops",
    nav_heatmaps: "Crowd Heatmaps",
    nav_organizer: "Organizer View",
    nav_fan: "Fan View",
    nav_volunteer: "Volunteer View",

    // Profile Header
    welcome: "Welcome, Alex",
    vip_badge: "Matchday VIP",
    seat_info: "Seat 44B • Lower Tier",
    routing_to: "Routing To:",

    // Wayfinding
    live_wayfinding: "Live Wayfinding",
    wayfinding_subtitle: "Navigate the stadium seamlessly.",
    estimated_time: "Estimated Time",
    route_direct: "Route A (Direct)",
    route_elevators: "Route B (Elevators Only)",
    step1_walk: "Head North on Level 1",
    step1_walk_desc: "Walk 50 meters past Concourse B.",
    step1_elevator: "Take Elevator to Level 1",
    step1_elevator_desc: "Use Elevator Bank C near Gate 4.",
    step2: "Turn Right at Merch Stand",
    step2_desc: "Follow the blue signage towards East Wing.",
    step3_dest: "Your destination is on the right.",
    nearest_exit: "Nearest Exit",
    evac_eta: "Evacuation ETA",
    evac_follow: "Follow Glowing Signs",
    ai_reroute: "AI Reroute",
    ai_reroute_desc: "Route dynamically updated to avoid a 300-person bottleneck at Gate 6.",
    ai_reroute_emerg: "Main exit blocked by crowd. AI has dynamically generated an alternate route to Exit 2.",

    // General Banners
    sim_mode: "Simulation Mode",
    simulating: "Simulating:",
    up_next: "Up Next",
    upcoming_match: "Canada vs France",
    venue_time: "BC Place, Vancouver • 20:00",

    // Dashboard Proactive Feed
    feed_alert_title: "Emergency Alert",
    feed_suggestion_title: "AI Suggestion",
    feed_alert_desc_rain: "Attention: Heavy Rain active. Please check indoor lounges or covered zones.",
    feed_alert_desc_power: "Attention: Power Failure. Safety systems on backup generators. Remain calm.",
    feed_alert_desc_metro: "Attention: Metro Delay. Expected wait times at subway station are 45+ minutes.",
    feed_alert_desc_fire: "Attention: Fire Alert in Sector B. Evacuation route generated dynamically.",
    feed_alert_desc_medical: "Attention: Medical incident at Gate 4. Keep paths clear for responders.",
    feed_sugg_desc: "Concourse C queue is increasing. We suggest grabbing your Official Merch now. Wait time is under 3 mins.",

    // Route Card
    route_live_map: "Live Map",
    route_route_a: "Route A",
    route_evacuation: "Evacuation Route",
    route_required: "Required",
    route_fastest: "Fastest",
    route_via_exit: "Via Nearest Exit",
    route_via_promenade: "Via Exterior Promenade",
    route_to_safety: "To Safety Zone",
    route_to_seat: "To Seat 44B",
    route_accessible: "Accessible",
    route_saved_co2: "72g CO2 Saved",
    route_avoid_elevating: "Avoid elevators",
    route_alternative: "Route B (19m)",

    // Wallet Card
    wallet_title: "Fan Wallet",
    wallet_ticket: "Match Ticket",
    wallet_ticket_valid: "Gate 2 Entry Valid",
    wallet_vouchers: "F&B Vouchers",
    wallet_vouchers_left: "2 remaining",
    wallet_carbon_saved: "Carbon Saved (Transit)",

    // Timeline Card
    timeline_title: "Match Timeline",
    timeline_kickoff: "Kickoff",
    timeline_half_rush: "Halftime Rush",
    timeline_half_rush_desc: "Concourses busy. Avoid Zone B.",
    timeline_metro_surge: "Metro Surge",
    timeline_metro_surge_desc: "Leave at 16:55 to avoid lines.",

    // Incident Card
    incident_title: "Report Issue",
    incident_assessor: "GenAI Assessor",
    incident_desc: "See a spill or bottleneck? Alert ground ops instantly using natural language.",
    incident_placeholder: "e.g. The bathroom in Concourse C is overflowing...",
    incident_success: "Report Submitted",
    incident_success_ops: "Ground Ops Alerted",
    incident_loading: "Analyzing Priority...",

    // Status
    live_status: "Live Status",
    inside_venue: "Inside Venue",

    // Ticket
    ticket_scan_desc: "Scan this QR code at Gate 6 for entry.",
    ticket_match_name: "USA vs Mexico",
    ticket_match_venue: "MetLife Stadium, East Rutherford",
    ticket_label_gate: "Gate",
    ticket_label_block: "Block",
    ticket_label_seat: "Seat",
    ticket_verified: "Verified Ticket",
    ticket_find_seat: "Find My Seat",
  },
  FR: {
    // Navigation
    nav_dashboard: "Tableau de Bord",
    nav_ticket: "Mon Billet",
    nav_wayfinding: "Itinéraire",
    nav_transit: "Transport",
    nav_assistant: "Assistant Fan",
    nav_alerts: "Alertes Système",
    nav_settings: "Paramètres",
    nav_dispatch: "Régulation Ops",
    nav_heatmaps: "Cartes de Chaleur",
    nav_organizer: "Vue Organisateur",
    nav_fan: "Vue Fan",
    nav_volunteer: "Vue Bénévole",

    // Profile Header
    welcome: "Bienvenue, Alex",
    vip_badge: "VIP Matchday",
    seat_info: "Siège 44B • Tribune Inférieure",
    routing_to: "Itinéraire Vers :",

    // Wayfinding
    live_wayfinding: "Itinéraire en Direct",
    wayfinding_subtitle: "Naviguez dans le stade en toute fluidité.",
    estimated_time: "Temps Estimé",
    route_direct: "Route A (Directe)",
    route_elevators: "Route B (Ascenseurs Uniquement)",
    step1_walk: "Dirigez-vous vers le Nord au Niveau 1",
    step1_walk_desc: "Marchez 50 mètres après le Hall B.",
    step1_elevator: "Prenez l'ascenseur pour le Niveau 1",
    step1_elevator_desc: "Utilisez la batterie d'ascenseurs C près de la Porte 4.",
    step2: "Tournez à droite au stand de souvenirs",
    step2_desc: "Suivez la signalisation bleue vers l'Aile Est.",
    step3_dest: "Votre destination est sur la droite.",
    nearest_exit: "Sortie la plus proche",
    evac_eta: "ETA d'évacuation",
    evac_follow: "Suivez les panneaux lumineux",
    ai_reroute: "Reroutage IA",
    ai_reroute_desc: "Route mise à jour dynamiquement pour éviter un goulot d'étranglement de 300 personnes à la Porte 6.",
    ai_reroute_emerg: "Sortie principale bloquée par la foule. L'IA a généré dynamiquement un itinéraire alternatif vers la Sortie 2.",

    // General Banners
    sim_mode: "Mode Simulation",
    simulating: "Simulation en cours :",
    up_next: "Prochain Match",
    upcoming_match: "Canada vs France",
    venue_time: "BC Place, Vancouver • 20:00",

    // Dashboard Proactive Feed
    feed_alert_title: "Alerte d'urgence",
    feed_suggestion_title: "Suggestion IA",
    feed_alert_desc_rain: "Attention: Forte pluie. Veuillez vérifier les salons intérieurs ou les zones couvertes.",
    feed_alert_desc_power: "Attention: Panne de courant. Systèmes de sécurité sur générateurs de secours. Restez calme.",
    feed_alert_desc_metro: "Attention: Retard de métro. Le temps d'attente à la station est de 45+ minutes.",
    feed_alert_desc_fire: "Attention: Alerte incendie dans le Secteur B. Itinéraire d'évacuation généré dynamiquement.",
    feed_alert_desc_medical: "Attention: Incident médical à la Porte 4. Laissez les voies libres pour les secouristes.",
    feed_sugg_desc: "La file d'attente au Hall C augmente. Nous vous suggérons d'acheter vos articles officiels maintenant. Temps d'attente inférieur à 3 min.",

    // Route Card
    route_live_map: "Carte en Direct",
    route_route_a: "Route A",
    route_evacuation: "Itinéraire d'Évacuation",
    route_required: "Requis",
    route_fastest: "Le plus rapide",
    route_via_exit: "Via la sortie la plus proche",
    route_via_promenade: "Via la promenade extérieure",
    route_to_safety: "Vers la zone de sécurité",
    route_to_seat: "Vers le siège 44B",
    route_accessible: "Accessible",
    route_saved_co2: "72g de CO2 Économisés",
    route_avoid_elevating: "Évitez les ascenseurs",
    route_alternative: "Route B (19m)",

    // Wallet Card
    wallet_title: "Portefeuille Fan",
    wallet_ticket: "Billet de Match",
    wallet_ticket_valid: "Entrée Porte 2 Valide",
    wallet_vouchers: "Bons Boisson & Repas",
    wallet_vouchers_left: "2 restants",
    wallet_carbon_saved: "Carbone Économisé",

    // Timeline Card
    timeline_title: "Chronologie du Match",
    timeline_kickoff: "Coup d'envoi",
    timeline_half_rush: "Affluence Mi-temps",
    timeline_half_rush_desc: "Halls encombrés. Évitez la Zone B.",
    timeline_metro_surge: "Affluence Métro",
    timeline_metro_surge_desc: "Partez à 16h55 pour éviter l'attente.",

    // Incident Card
    incident_title: "Signaler un Problème",
    incident_assessor: "Évaluateur GenAI",
    incident_desc: "Une fuite ou un encombrement ? Alertez la régulation au sol instantanément en langage naturel.",
    incident_placeholder: "ex. Les toilettes du Hall C débordent...",
    incident_success: "Signalement Envoyé",
    incident_success_ops: "Régulation au sol alertée",
    incident_loading: "Analyse de Priorité...",

    // Status
    live_status: "Statut en Direct",
    inside_venue: "Sur Place",

    // Ticket
    ticket_scan_desc: "Scannez ce code QR à la Porte 6 pour entrer.",
    ticket_match_name: "USA vs Mexique",
    ticket_match_venue: "MetLife Stadium, East Rutherford",
    ticket_label_gate: "Porte",
    ticket_label_block: "Bloc",
    ticket_label_seat: "Siège",
    ticket_verified: "Billet Vérifié",
    ticket_find_seat: "Trouver Mon Siège",
  },
  ES: {
    // Navigation
    nav_dashboard: "Tablero",
    nav_ticket: "Mi Boleto",
    nav_wayfinding: "Navegación",
    nav_transit: "Transporte",
    nav_assistant: "Asistente de Fan",
    nav_alerts: "Alertas de Sistema",
    nav_settings: "Ajustes",
    nav_dispatch: "Despacho Ops",
    nav_heatmaps: "Mapas de Calor",
    nav_organizer: "Vista del Organizador",
    nav_fan: "Vista del Fan",
    nav_volunteer: "Vista del Voluntario",

    // Profile Header
    welcome: "Bienvenido, Alex",
    vip_badge: "VIP del Partido",
    seat_info: "Asiento 44B • Nivel Inferior",
    routing_to: "Ruta Hacia:",

    // Wayfinding
    live_wayfinding: "Navegación en Vivo",
    wayfinding_subtitle: "Navegue por el estadio sin problemas.",
    estimated_time: "Tiempo Estimado",
    route_direct: "Ruta A (Directo)",
    route_elevators: "Ruta B (Solo Ascensores)",
    step1_walk: "Diríjase al Norte en el Nivel 1",
    step1_walk_desc: "Camine 50 metros pasando el Vestíbulo B.",
    step1_elevator: "Tome el Ascensor al Nivel 1",
    step1_elevator_desc: "Use el Banco de Ascensores C cerca de la Puerta 4.",
    step2: "Gire a la Derecha en la Tienda",
    step2_desc: "Siga la señalización azul hacia el Ala Este.",
    step3_dest: "Su destino está a la derecha.",
    nearest_exit: "Salida más Cercana",
    evac_eta: "ETA de Evacuación",
    evac_follow: "Siga las Señales Luminosas",
    ai_reroute: "Desvío por IA",
    ai_reroute_desc: "Ruta actualizada dinámicamente para evitar un cuello de botella de 300 personas en la Puerta 6.",
    ai_reroute_emerg: "Salida principal bloqueada por la multitud. La IA ha generado dinámicamente una ruta alternativa a la Salida 2.",

    // General Banners
    sim_mode: "Modo Simulación",
    simulating: "Simulando:",
    up_next: "Próximo Partido",
    upcoming_match: "Canadá vs Francia",
    venue_time: "BC Place, Vancouver • 20:00",

    // Dashboard Proactive Feed
    feed_alert_title: "Alerta de Emergencia",
    feed_suggestion_title: "Sugerencia de IA",
    feed_alert_desc_rain: "Atención: Lluvia intensa activa. Revise salones interiores o zonas cubiertas.",
    feed_alert_desc_power: "Atención: Fallo de energía. Sistemas de seguridad en generadores de respaldo. Mantenga la calma.",
    feed_alert_desc_metro: "Atención: Retraso del metro. Tiempo de espera en la estación de más de 45 minutos.",
    feed_alert_desc_fire: "Atención: Alerta de incendio en el Sector B. Ruta de evacuación generada dinámicamente.",
    feed_alert_desc_medical: "Atención: Incidente médico en la Puerta 4. Mantenga los caminos despejados para los socorristas.",
    feed_sugg_desc: "La fila del Vestíbulo C está aumentando. Sugerimos comprar su Merch Oficial ahora. Tiempo de espera inferior a 3 min.",

    // Route Card
    route_live_map: "Mapa en Vivo",
    route_route_a: "Ruta A",
    route_evacuation: "Ruta de Evacuación",
    route_required: "Requerido",
    route_fastest: "Más Rápido",
    route_via_exit: "Vía Salida más Cercana",
    route_via_promenade: "Vía Paseo Exterior",
    route_to_safety: "A Zona de Seguridad",
    route_to_seat: "Al Asiento 44B",
    route_accessible: "Accesible",
    route_saved_co2: "72g CO2 Ahorrados",
    route_avoid_elevating: "Evite ascensores",
    route_alternative: "Ruta B (19m)",

    // Wallet Card
    wallet_title: "Billetera del Fan",
    wallet_ticket: "Boleto de Partido",
    wallet_ticket_valid: "Entrada Puerta 2 Válida",
    wallet_vouchers: "Vales de Alimentos y Bebidas",
    wallet_vouchers_left: "2 restantes",
    wallet_carbon_saved: "Carbono Ahorrado",

    // Timeline Card
    timeline_title: "Cronograma del Partido",
    timeline_kickoff: "Comienzo del Partido",
    timeline_half_rush: "Prisa del Medio Tiempo",
    timeline_half_rush_desc: "Vestíbulos ocupados. Evite la Zona B.",
    timeline_metro_surge: "Pico en el Metro",
    timeline_metro_surge_desc: "Salga a las 16:55 para evitar colas.",

    // Incident Card
    incident_title: "Reportar Incidente",
    incident_assessor: "Asesor GenAI",
    incident_desc: "¿Vio un derrame o cuello de botella? Alerte a operaciones terrestres al instante usando lenguaje natural.",
    incident_placeholder: "ej. El baño en el Vestíbulo C se está desbordando...",
    incident_success: "Reporte Enviado",
    incident_success_ops: "Operaciones Terrestres Alertadas",
    incident_loading: "Analizando Prioridad...",

    // Status
    live_status: "Estado en Vivo",
    inside_venue: "En el Estadio",

    // Ticket
    ticket_scan_desc: "Escanee este código QR en la Puerta 6 para ingresar.",
    ticket_match_name: "EE. UU. vs México",
    ticket_match_venue: "MetLife Stadium, East Rutherford",
    ticket_label_gate: "Puerta",
    ticket_label_block: "Bloque",
    ticket_label_seat: "Asiento",
    ticket_verified: "Boleto Verificado",
    ticket_find_seat: "Encontrar Mi Asiento",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.EN;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  // Load language settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = (localStorage.getItem("crowdfifax_language") as Language) || "EN";
      setTimeout(() => {
        setLanguageState(savedLang);
      }, 0);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("crowdfifax_language", lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
