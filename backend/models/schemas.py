from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$", description="Either 'user' or 'assistant'")
    content: str = Field(..., max_length=4000, description="The message content text, strictly limited in length")

class UserContext(BaseModel):
    persona: str = Field("fan", description="Target persona: fan, organizer, volunteer")
    language: str = Field("EN", description="Preferred language: EN, ES, FR")
    accessibility_needs: List[str] = Field(default_factory=list, description="List of physical needs: wheelchair, visual, hearing")
    ticket_section: Optional[str] = Field(None, description="Ticket seat block or section")
    minutes_to_kickoff: Optional[int] = Field(None, description="Minutes remaining until kickoff")
    current_location: Optional[str] = Field(None, description="Simulated stadium zone or coordinate")

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[UserContext] = Field(default_factory=UserContext)

class WayfindingRequest(BaseModel):
    origin: str = Field(..., description="Starting gate or sector")
    destination: str = Field(..., description="Target seat, concession, restroom, or facility")
    accessibility_needs: List[str] = Field(default_factory=list, description="List of physical needs: wheelchair, visual, hearing")

class WayfindingResponse(BaseModel):
    route_id: str
    path: List[str]
    estimated_time_mins: int
    accessibility_mode: bool
    congestion_score: float = Field(..., ge=0.0, le=1.0, description="Crowd congestion risk factor")
    safety_score: int = Field(..., ge=0, le=100, description="Overall safety index of the route")
    estimated_delay_saved: int = Field(..., description="Minutes saved by avoiding bottlenecks")
    reasoning_steps: List[str] = Field(..., description="Step-by-step trace explaining the chosen route")

class SimulationScenario(BaseModel):
    scenario_type: str = Field(..., description="concourse_overflow, gate_closure, weather_delay, evacuation")
    target_zone: Optional[str] = Field(None, description="The specific zone affected")
    severity: str = Field("medium", description="Severity level: low, medium, high")

class SimulationResponse(BaseModel):
    success: bool
    active_incidents: List[str]
    system_status: str
