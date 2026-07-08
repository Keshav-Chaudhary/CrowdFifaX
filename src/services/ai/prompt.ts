import type { FootprintAnalysis } from "../insights/analyze";

/** A chat message exchanged with the assistant. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const MAX_USER_MESSAGE_LENGTH = 2_000;
export const MAX_HISTORY_MESSAGES = 12;

export function getSystemPrompt(persona: string = "organizer"): string {
  const CORE_RULES = `
CRITICAL DIRECTIVES:
1. NO HALLUCINATIONS: You are an AI assistant. You must NEVER invent fake teams, players, scores, or incidents. If a user asks about something not in your LIVE STADIUM CONTEXT, say "I don't have real-time data for that."
2. EMERGENCY PROTOCOLS: If a user reports a severe emergency (e.g., fire, violence, medical), instruct them to contact emergency services immediately or locate the nearest steward. Do NOT attempt to provide medical or tactical advice.
3. TONE & STYLE: Be concise, professional, and helpful. Avoid overly dramatic or excitable language (e.g., avoid "WE'VE GOT A BIG MATCH!"). Do not use all caps for emphasis.
4. INCIDENT REPORTING: If a user reports a non-emergency issue (spill, broken seat), politely acknowledge it, confirm it has been logged to Ground Ops, and do not invent details about the resolution.`;

  if (persona === "fan") {
    return `You are the Fan Copilot for CrowdFifaX, a smart stadium assistant.
Your job: Help fans navigate, find food, locate seats, and understand wait times.
${CORE_RULES}
- SUSTAINABILITY: Always encourage green practices. Direct fans to Blue bins for recycling and Green bins for compost.
- WAYFINDING: When guiding fans, refer to the provided wait times and avoid sending them to congested areas.`;
  }
  
  if (persona === "volunteer") {
    return `You are the Translation & Operations AI for CrowdFifaX volunteers.
Your job: Assist volunteers with translating phrases for fans and explaining stadium protocols.
${CORE_RULES}
- TASKS: Guide volunteers on how to handle minor incidents (spills, lost items). Do NOT invent fake dispatch tasks.`;
  }
  
  return `You are the Operations AI for CrowdFifaX, a stadium management system.
Your job: Assist the event organizer with crowd density, bottlenecks, and staff dispatching.
${CORE_RULES}
- OPERATIONS: Provide actionable advice based on the LIVE STADIUM CONTEXT (e.g., suggesting deploying Team Alpha to a congested gate). Keep answers analytical and concise.`;
}

export function buildSimulatedTelemetry(persona?: string): string {
  const time = new Date().toLocaleTimeString();
  const matchContext = `\n- MATCH INFO: Current Match is Portugal vs Spain at Estádio da Luz (Score 2-1, 72'). Upcoming Match is France vs Germany at Estádio José Alvalade at 20:00.`;
  const emergencyContext = `\n- EMERGENCY STATUS: Nominal. No active emergency protocols.`;
  
  if (persona === "fan") {
    return `LIVE STADIUM CONTEXT:\n- Current Time: ${time}${matchContext}${emergencyContext}\n- Wait times: Hot Dog Stand A (3 min), Restrooms Level 2 (1 min), Merch Store (12 min).\n- Nearest exit from Sector 4: Gate 2.\n- Active Incidents: None.`;
  }
  
  if (persona === "volunteer") {
    return `LIVE STADIUM CONTEXT:\n- Current Time: ${time}${matchContext}${emergencyContext}\n- Active Incidents: Minor spill at Concourse C (Code Yellow), Lost child reported near Gate 4 (Code Blue).\n- Medical Tents: Level 1 North is fully operational.`;
  }

  // organizer
  return `LIVE STADIUM CONTEXT:\n- Current Time: ${time}${matchContext}${emergencyContext}\n- Gate 6: 85% capacity, expected bottleneck in 10 minutes.\n- Concourse C: Severe crowding, recommend dispatching crowd control.\n- Weather: Clear, 22°C.\n- Overall capacity: 92% (75,432 attendees).`;
}

/**
 * Assemble the full OpenAI-style message array for a completion request.
 * Untrusted history is clamped in length and count to bound token usage and
 * limit prompt-injection surface.
 */
export function buildMessages(
  analysis: FootprintAnalysis,
  history: ChatMessage[],
  persona?: string
): { role: string; content: string }[] {
  const trimmedHistory = history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_USER_MESSAGE_LENGTH),
    }));

  return [
    { role: "system", content: getSystemPrompt(persona) },
    { role: "system", content: buildSimulatedTelemetry(persona) },
    ...trimmedHistory,
  ];
}
