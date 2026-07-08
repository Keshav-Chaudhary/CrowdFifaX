export const LOG_ACTIVITY_RE = /\[LOG_ACTIVITY:\s*({[^\]]+})\s*\]/g;

export function extractLogMarkers(text: string): { clean: string; payloads: string[] } {
  const payloads: string[] = [];
  const clean = text.replace(LOG_ACTIVITY_RE, (_, json: string) => {
    payloads.push(json);
    return "";
  }).trim();
  return { clean, payloads };
}
