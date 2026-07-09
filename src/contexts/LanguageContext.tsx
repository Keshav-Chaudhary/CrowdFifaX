"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "EN" | "PT" | "ES";

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
    upcoming_match: "France vs Germany",
    venue_time: "Estádio José Alvalade • 20:00",

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
    ticket_match_name: "Portugal vs Spain",
    ticket_match_venue: "Estádio da Luz, Lisbon",
    ticket_label_gate: "Gate",
    ticket_label_block: "Block",
    ticket_label_seat: "Seat",
    ticket_verified: "Verified Ticket",
    ticket_find_seat: "Find My Seat",
  },
  PT: {
    // Navigation
    nav_dashboard: "Painel",
    nav_ticket: "Meu Ingresso",
    nav_wayfinding: "Direções",
    nav_transit: "Transporte",
    nav_assistant: "Assistente de Fã",
    nav_alerts: "Alertas do Sistema",
    nav_settings: "Configurações",
    nav_dispatch: "Despacho Ops",
    nav_heatmaps: "Mapas de Calor",
    nav_organizer: "Visualização do Organizador",
    nav_fan: "Visualização do Fã",
    nav_volunteer: "Visualização do Voluntário",

    // Profile Header
    welcome: "Bem-vindo, Alex",
    vip_badge: "VIP do Dia do Jogo",
    seat_info: "Assento 44B • Camada Inferior",
    routing_to: "Direcionando Para:",

    // Wayfinding
    live_wayfinding: "Direções ao Vivo",
    wayfinding_subtitle: "Navegue pelo estádio perfeitamente.",
    estimated_time: "Tempo Estimado",
    route_direct: "Rota A (Direta)",
    route_elevators: "Rota B (Apenas Elevadores)",
    step1_walk: "Siga para o Norte no Nível 1",
    step1_walk_desc: "Caminhe 50 metros após o Corredor B.",
    step1_elevator: "Pegue o Elevador para o Nível 1",
    step1_elevator_desc: "Use o Banco de Elevadores C perto do Portão 4.",
    step2: "Vire à Direita na Loja",
    step2_desc: "Siga a sinalização azul em direção à Ala Leste.",
    step3_dest: "Seu destino está à direita.",
    nearest_exit: "Saída mais Próxima",
    evac_eta: "ETA de Evacuação",
    evac_follow: "Siga os Sinais Luminosos",
    ai_reroute: "Redirecionamento IA",
    ai_reroute_desc: "Rota atualizada dinamicamente para evitar um gargalo de 300 pessoas no Portão 6.",
    ai_reroute_emerg: "Saída principal bloqueada pela multidão. A IA gerou dinamicamente uma rota alternativa para a Saída 2.",

    // General Banners
    sim_mode: "Modo Simulação",
    simulating: "Simulando:",
    up_next: "Próximo Jogo",
    upcoming_match: "França vs Alemanha",
    venue_time: "Estádio José Alvalade • 20:00",

    // Dashboard Proactive Feed
    feed_alert_title: "Alerta de Emergência",
    feed_suggestion_title: "Sugestão da IA",
    feed_alert_desc_rain: "Atenção: Chuva forte ativa. Verifique salões internos ou zonas cobertas.",
    feed_alert_desc_power: "Atenção: Falha de energia. Sistemas de segurança nos geradores. Mantenha a calma.",
    feed_alert_desc_metro: "Atenção: Atraso no metrô. Tempo de espera na estação é de 45+ minutos.",
    feed_alert_desc_fire: "Atenção: Alerta de incêndio no Setor B. Rota de evacuação gerada dinamicamente.",
    feed_alert_desc_medical: "Atenção: Incidente médico no Portão 4. Mantenha os caminhos livres para os socorristas.",
    feed_sugg_desc: "A fila do Corredor C está aumentando. Sugerimos pegar seu Merch Oficial agora. Tempo de espera inferior a 3 min.",

    // Route Card
    route_live_map: "Mapa ao Vivo",
    route_route_a: "Rota A",
    route_evacuation: "Rota de Evacuação",
    route_required: "Obrigatório",
    route_fastest: "Mais Rápida",
    route_via_exit: "Via Saída mais Próxima",
    route_via_promenade: "Via Calçadão Exterior",
    route_to_safety: "Para Zona de Segurança",
    route_to_seat: "Para Assento 44B",
    route_accessible: "Acessível",
    route_saved_co2: "72g CO2 Economizados",
    route_avoid_elevating: "Evite elevadores",
    route_alternative: "Rota B (19m)",

    // Wallet Card
    wallet_title: "Carteira de Fã",
    wallet_ticket: "Ingresso da Partida",
    wallet_ticket_valid: "Entrada Portão 2 Válida",
    wallet_vouchers: "Vales de A&B",
    wallet_vouchers_left: "2 restantes",
    wallet_carbon_saved: "Carbono Economizado",

    // Timeline Card
    timeline_title: "Cronograma do Jogo",
    timeline_kickoff: "Pontapé Inicial",
    timeline_half_rush: "Corrida do Intervalo",
    timeline_half_rush_desc: "Corredores ocupados. Evite a Zona B.",
    timeline_metro_surge: "Aumento de Metrô",
    timeline_metro_surge_desc: "Saia às 16:55 para evitar filas.",

    // Incident Card
    incident_title: "Relatar Problema",
    incident_assessor: "Assessor GenAI",
    incident_desc: "Viu um vazamento ou gargalo? Alerte as operações de solo instantaneamente usando linguagem natural.",
    incident_placeholder: "ex. O banheiro no Corredor C está transbordando...",
    incident_success: "Relatório Enviado",
    incident_success_ops: "Operações de Solo Alertadas",
    incident_loading: "Analisando Prioridade...",

    // Status
    live_status: "Status ao Vivo",
    inside_venue: "No Local",

    // Ticket
    ticket_scan_desc: "Escaneie este código QR no Portão 6 para entrar.",
    ticket_match_name: "Portugal vs Espanha",
    ticket_match_venue: "Estádio da Luz, Lisboa",
    ticket_label_gate: "Portão",
    ticket_label_block: "Bloco",
    ticket_label_seat: "Assento",
    ticket_verified: "Ingresso Verificado",
    ticket_find_seat: "Encontrar Meu Assento",
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
    upcoming_match: "Francia vs Alemania",
    venue_time: "Estadio José Alvalade • 20:00",

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
    ticket_match_name: "Portugal vs España",
    ticket_match_venue: "Estadio de la Luz, Lisboa",
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
