from typing import List, Optional
import functools

class PhrasingService:
    
    @functools.lru_cache(maxsize=128)
    def compile_guidelines(
        self,
        language: str,
        accessibility_needs: tuple,
        minutes_to_kickoff: Optional[int],
        is_crowded: bool
    ) -> str:
        
        rules = []
        
        # 1. Language constraint
        rules.append(f"The user has selected language: {language}. You must respond strictly in this language.")
        
        # 2. Wheelchair & Visual needs rules
        if "wheelchair" in accessibility_needs or "visual" in accessibility_needs:
            rules.append("ACCESSIBILITY MANDATE (Visual/Physical): Focus on step-free route elements. Provide clear, landmark-based descriptions (e.g., 'past the Red Merch stand on your left', 'next to the First Aid Station') instead of complex relative directions. Use audio-friendly, descriptive phrasing.")
            
        # 3. Hearing needs rules
        if "hearing" in accessibility_needs:
            rules.append("ACCESSIBILITY MANDATE (Hearing): Focus directions around visible icons, color-coded signs, and digital screens (e.g., 'follow the blue illuminated panels'). Remind them that the West Concourse features a Sensory Quiet Room if they need a low-stimulus space.")
            
        # 4. Kickoff Urgency Warnings
        if minutes_to_kickoff is not None and minutes_to_kickoff < 15:
            rules.append(f"URGENCY PROTOCOL: There are only {minutes_to_kickoff} minutes remaining until kickoff! Keep all directions brief, emphasize speed, and warn them to proceed directly to their seats or gates to avoid missing the start.")
            
        # 5. Congested Facility Alerts
        if is_crowded:
            rules.append("CONGESTION AVOIDANCE: The requested facility or gate is currently highly congested. You must proactively recommend the nearest quieter equivalent or suggest alternative concourses.")
            
        return "\n".join(rules)

phrasing_service = PhrasingService()
