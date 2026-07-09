import json
import os
from typing import Dict, Any, List

class StadiumDataService:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
        self.stadium_cache = self._load_json("stadium.json")
        self.facilities_cache = self._load_json("facilities.json")
        
    def _load_json(self, filename: str) -> Any:
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            return {}
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    def get_stadium_info(self) -> Dict[str, Any]:
        return self.stadium_cache
        
    def get_facilities(self, filter_type: str = None) -> List[Dict[str, Any]]:
        if not filter_type:
            return self.facilities_cache
        return [f for f in self.facilities_cache if f.get("type") == filter_type]
        
    def get_facility_by_id(self, facility_id: str) -> Dict[str, Any]:
        for f in self.facilities_cache:
            if f.get("id") == facility_id:
                return f
        return {}

stadium_data_service = StadiumDataService()
