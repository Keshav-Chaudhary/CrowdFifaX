"use client";

import { useSimulation } from "@/contexts/SimulationContext";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Navigation, Coffee, MapPin, Leaf, Ticket, MessageSquare, Send, CheckCircle2, ShieldAlert, Sparkles, Globe, Eye } from "lucide-react";
import { useAlerts } from "@/contexts/AlertsContext";
import { useState, useEffect } from "react";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTranslation } from "@/contexts/LanguageContext";

export function FanDashboard() {
  const { mode } = useSimulation();
  const { reportIncident } = useAlerts();
  const { highContrast, setHighContrast } = useAccessibility();
  const { language, setLanguage, t } = useTranslation();
  const isEmergency = mode !== "normal";

  const [reportText, setReportText] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    if (!reportText.trim()) return;
    setIsReporting(true);
    // Simulate AI processing the report
    setTimeout(() => {
      reportIncident(reportText, "Concourse C"); // Hardcode sector for demo or extract it
      setIsReporting(false);
      setReported(true);
      setReportText("");
      setTimeout(() => setReported(false), 3000);
    }, 1500);
  };

  const getEmergencyAlertDesc = () => {
    if (mode === "rain") return t.feed_alert_desc_rain;
    if (mode === "power") return t.feed_alert_desc_power;
    if (mode === "metro") return t.feed_alert_desc_metro;
    if (mode === "fire") return t.feed_alert_desc_fire;
    if (mode === "medical") return t.feed_alert_desc_medical;
    return `Attention: ${mode.toUpperCase()} protocol active. Please follow exit signs.`;
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-3xl mx-auto">
      
      {/* Premium Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-[var(--border-strong)] bg-surface shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1 flex items-center gap-1.5">
             <Sparkles className="size-3" /> {t.vip_badge}
          </span>
          <h1 className="text-4xl font-black tracking-tight text-fg">{t.welcome}</h1>
          <p className="text-sm text-fg-muted mt-1 font-medium">{t.seat_info}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10 pt-2 sm:pt-0">
          {/* Accessibility Settings */}
          <div className="flex gap-2">
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`size-10 rounded-full flex items-center justify-center border transition-colors ${highContrast ? "bg-[var(--accent)] text-white border-[var(--accent-line)]" : "bg-surface-2/80 backdrop-blur-md border-[var(--border-faint)] text-fg hover:bg-surface-3"}`}
              title="High Contrast Mode"
            >
              <Eye className="size-4" />
            </button>
            <button 
              onClick={() => setLanguage(language === "EN" ? "PT" : language === "PT" ? "ES" : "EN")}
              className="px-3 h-10 rounded-full flex items-center gap-2 bg-surface-2/80 backdrop-blur-md border border-[var(--border-faint)] text-fg hover:bg-surface-3 transition-colors font-bold text-xs"
              title="Toggle Language"
            >
              <Globe className="size-4 text-[var(--accent)]" /> {language}
            </button>
          </div>
          
          <div className="flex items-center gap-4 bg-surface-2/80 backdrop-blur-md p-2 pl-4 rounded-full border border-[var(--border-faint)]">
            <div className="flex flex-col items-end pr-2">
               <span className="text-[9px] text-fg-muted font-bold uppercase tracking-widest">{t.live_status}</span>
               <span className="text-xs font-bold text-[var(--positive)] flex items-center gap-1.5 mt-0.5">
                 <span className="size-2 rounded-full bg-[var(--positive)] animate-pulse shadow-[0_0_8px_var(--positive)]" /> {t.inside_venue}
               </span>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-blue-400 p-[2px] shadow-lg cursor-pointer hover:scale-105 transition-transform shrink-0">
               <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                  <span className="font-black text-sm text-fg">AC</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Proactive Feed */}
      <ScrollReveal delayMs={100}>
        <div className={`rounded-3xl border ${isEmergency ? "border-red-500/50 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]" : "border-[var(--accent)]/30 bg-[var(--accent-subtle)] shadow-[0_0_40px_var(--accent-subtle)]"} p-6 sm:p-8 relative overflow-hidden group transition-all`}>
           <div className={`absolute -right-20 -top-20 size-64 rounded-full blur-3xl opacity-20 transition-all group-hover:scale-150 ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"}`} />
           
           <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
             <h2 className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isEmergency ? "text-red-500" : "text-[var(--accent)]"}`}>
               {isEmergency ? <><ShieldAlert className="size-4" /> {t.feed_alert_title}</> : <><Sparkles className="size-4" /> {t.feed_suggestion_title}</>}
             </h2>
             {!isEmergency && (
               <ExplainAIButton 
                 explanation={{
                   title: "AI Suggestion Logic",
                   dataInputs: ["Current Location", "Concourse Traffic", "Purchase History"],
                   prediction: "You have 14 mins before kickoff, and your preferred merch stand has 0 wait time.",
                   confidence: 94,
                   reasoning: "Diverting fans to empty zones optimizes stadium flow while improving user experience."
                 }}
               />
             )}
           </div>
           
           <p className={`text-xl sm:text-2xl font-bold leading-tight relative z-10 ${isEmergency ? "text-red-500" : "text-fg"}`}>
             {isEmergency ? getEmergencyAlertDesc() : t.feed_sugg_desc}
           </p>
        </div>
      </ScrollReveal>

      {/* Smart Route & Wallet Split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Smart Route */}
        <ScrollReveal delayMs={200} className="md:col-span-3 rounded-3xl border border-[var(--border-strong)] bg-surface p-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 z-10">
            <span className="px-3 py-1 rounded-full bg-surface-2/80 backdrop-blur text-[10px] font-bold text-fg-muted uppercase tracking-widest border border-[var(--border-faint)]">
              {t.route_live_map}
            </span>
          </div>

        <div className={`flex-1 rounded-[22px] p-6 relative overflow-hidden flex flex-col justify-end min-h-[280px] ${isEmergency ? "bg-red-500/10 border border-red-500/30" : "bg-surface-2"}`}>
          {/* Map background simulation */}
          <div className="absolute inset-0 opacity-10 pointer-events-none text-fg">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className={`relative z-10 backdrop-blur-xl border rounded-2xl p-4 shadow-xl ${isEmergency ? "bg-red-500/20 border-red-500/50" : "bg-surface/80 border-[var(--border-strong)]"}`}>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--border-faint)]">
               <div>
                 <h3 className={`text-lg font-black flex items-center gap-2 ${isEmergency ? "text-red-500" : "text-fg"}`}>
                   {isEmergency ? t.route_evacuation : t.route_route_a} <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isEmergency ? "bg-red-500/20 text-red-500 border-red-500/30" : "bg-[var(--positive)]/20 text-[var(--positive)] border-[var(--positive)]/30"}`}>{isEmergency ? t.route_required : t.route_fastest}</span>
                 </h3>
                 <p className="text-xs text-fg-muted mt-1">{isEmergency ? t.route_via_exit : t.route_via_promenade}</p>
               </div>
               <div className="text-right">
                 <div className={`text-2xl font-black ${isEmergency ? "text-red-500 animate-pulse" : "text-[var(--accent)]"}`}>{isEmergency ? "2 min" : "7 min"}</div>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">{isEmergency ? t.route_to_safety : t.route_to_seat}</div>
               </div>
             </div>
             <div className="flex items-center justify-between text-xs font-bold text-fg-subtle">
               <span className={`flex items-center gap-1.5 ${isEmergency ? "text-red-500" : ""}`}><Navigation className={`size-3 ${isEmergency ? "text-red-500" : "text-[var(--accent)]"}`} /> {isEmergency ? t.evac_follow : t.route_accessible}</span>
               {!isEmergency && <span className="flex items-center gap-1.5"><Leaf className="size-3 text-[var(--positive)]" /> {t.route_saved_co2}</span>}
               <span className="flex items-center gap-1.5 opacity-50"><MapPin className="size-3" /> {isEmergency ? t.route_avoid_elevating : t.route_alternative}</span>
             </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Fan Wallet */}
        <ScrollReveal delayMs={300} className="md:col-span-2 rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 size-40 bg-[var(--positive)]/5 rounded-full blur-2xl transition-all group-hover:bg-[var(--positive)]/10" />
          
          <h2 className="text-xl font-bold text-fg mb-6 flex items-center gap-2">
            {t.wallet_title}
          </h2>
          
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-[var(--border-faint)]">
              <div className="size-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Ticket className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-fg">{t.wallet_ticket}</h3>
                <p className="text-xs text-fg-muted">{t.wallet_ticket_valid}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-[var(--border-faint)]">
              <div className="size-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Coffee className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-fg">{t.wallet_vouchers}</h3>
                <p className="text-xs text-fg-muted">{t.wallet_vouchers_left}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-strong)]">
            <div className="flex items-center justify-between">
               <span className="text-sm font-bold text-fg-subtle flex items-center gap-1.5"><Leaf className="size-4 text-[var(--positive)]" /> {t.wallet_carbon_saved}</span>
               <span className="text-xl font-black text-[var(--positive)]">12.4 kg <span className="text-xs text-fg-muted font-bold">CO₂</span></span>
            </div>
            <div className="w-full bg-surface-2 rounded-full h-1.5 mt-3 overflow-hidden">
               <div className="bg-[var(--positive)] h-full w-[85%] rounded-full relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 w-[200%] animate-[slide_2s_linear_infinite]" />
               </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Match Timeline */}
        <ScrollReveal delayMs={350} className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm">
          <h2 className="text-xl font-bold text-fg mb-6">{t.timeline_title}</h2>
          <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-surface-3">
            
            <div className="relative flex items-start pl-8">
              <div className="absolute left-[7px] top-1.5 size-[10px] rounded-full bg-[var(--border-strong)] border-[2px] border-surface z-10" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-fg-muted uppercase tracking-widest mb-1">15:00</span>
                <span className="text-sm font-bold text-fg">{t.timeline_kickoff}</span>
              </div>
            </div>
            
            <div className="relative flex items-start pl-8">
              <div className="absolute left-[3px] top-1.5 size-[18px] rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)] border-[4px] border-surface z-10 flex items-center justify-center">
                <div className="size-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-1">15:45</span>
                <span className="text-sm font-bold text-fg">{t.timeline_half_rush}</span>
                <span className="text-xs text-fg-muted mt-1">{t.timeline_half_rush_desc}</span>
              </div>
            </div>
            
            <div className="relative flex items-start pl-8 opacity-50">
              <div className="absolute left-[7px] top-1.5 size-[10px] rounded-full bg-[var(--border-strong)] border-[2px] border-surface z-10" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-fg-muted uppercase tracking-widest mb-1">17:05</span>
                <span className="text-sm font-bold text-fg">{t.timeline_metro_surge}</span>
                <span className="text-xs text-fg-muted mt-1">{t.timeline_metro_surge_desc}</span>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* AI Incident Reporter */}
        <ScrollReveal delayMs={400} className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                <MessageSquare className="size-5 text-[var(--accent)]" /> {t.incident_title}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted border border-[var(--border-faint)] bg-surface-2 px-2 py-0.5 rounded-full">{t.incident_assessor}</span>
            </div>
            <p className="text-sm text-fg-muted mb-6">{t.incident_desc}</p>
          </div>
          
          {reported ? (
            <div className="rounded-2xl border border-[var(--positive)]/30 bg-[var(--positive)]/10 p-6 flex flex-col items-center justify-center text-center transition-all animate-in zoom-in-95 h-32">
              <CheckCircle2 className="size-8 text-[var(--positive)] mb-2" />
              <p className="text-sm font-bold text-fg">{t.incident_success}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--positive)] mt-1">{t.incident_success_ops}</p>
            </div>
          ) : (
            <div className="relative">
              <textarea 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder={t.incident_placeholder}
                className="w-full bg-surface-2 border border-[var(--border-strong)] rounded-2xl p-4 pr-14 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all min-h-[120px] resize-none"
                disabled={isReporting}
              />
              <button 
                onClick={handleReport}
                disabled={isReporting || !reportText.trim()}
                aria-label="Submit incident report"
                className={`absolute bottom-3 right-3 size-10 rounded-xl flex items-center justify-center transition-all ${isReporting || !reportText.trim() ? "bg-surface-3 text-fg-muted cursor-not-allowed border border-[var(--border-faint)]" : "bg-[var(--accent)] text-white shadow-[0_4px_15px_var(--accent-subtle)] hover:scale-105 active:scale-95"}`}
              >
                {isReporting ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="size-4 -ml-0.5" />}
              </button>
              {isReporting && (
                <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm rounded-2xl flex flex-col gap-2 items-center justify-center">
                  <div className="size-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] animate-pulse bg-surface-2 px-3 py-1 rounded-full border border-[var(--accent-line)] shadow-lg">{t.incident_loading}</span>
                </div>
              )}
            </div>
          )}
        </ScrollReveal>

      </div>

    </div>
  );
}
