from typing import Optional
from .graph import SessionLocal, GraphManager

class GraphProjector:
    def __init__(self, db_session):
        self.gm = GraphManager(db_session)
        self.db = db_session

    def project_ml_anomaly(self, equipment_name: str, score: float, confidence: float, explanation: str) -> Optional[bool]:
        """Project ML Anomaly findings directly onto the equipment node."""
        equipment = self.gm.find_node(equipment_name)
        if not equipment:
            print(f"Equipment '{equipment_name}' not found. Cannot project ML anomaly.")
            return False
            
        anomaly_node_name = f"{equipment_name} ML Anomaly Alert"
        # Add ML Finding Node
        self.gm.add_node(
            name=anomaly_node_name,
            node_type="ML Finding",
            properties={
                "anomaly_score": score,
                "confidence": confidence,
                "explanation": explanation,
                "severity": "Warning" if score > 0.6 else "Critical"
            }
        )
        
        # Connect Equipment --[HAS_ANOMALY]--> ML Finding
        self.gm.add_relationship(equipment_name, anomaly_node_name, "HAS_ANOMALY")
        self.db.commit()
        return True

    def project_forecast(self, equipment_name: str, target_metric: str, value: float, horizon_hours: int, trend: str) -> Optional[bool]:
        """Project time-series forecasted future trends directly onto the equipment node."""
        equipment = self.gm.find_node(equipment_name)
        if not equipment:
            print(f"Equipment '{equipment_name}' not found. Cannot project forecast.")
            return False
            
        forecast_node_name = f"{equipment_name} {target_metric} Forecast ({horizon_hours}h)"
        
        # Add Forecast Node
        self.gm.add_node(
            name=forecast_node_name,
            node_type="Forecast",
            properties={
                "target_metric": target_metric,
                "predicted_value": value,
                "horizon_hours": horizon_hours,
                "forecast_trend": trend
            }
        )
        
        # Connect Equipment --[HAS_FORECAST]--> Forecast
        self.gm.add_relationship(equipment_name, forecast_node_name, "HAS_FORECAST")
        self.db.commit()
        return True

if __name__ == "__main__":
    try:
        db = SessionLocal()
        projector = GraphProjector(db)
        # Project sample ML findings
        projector.project_ml_anomaly(
            equipment_name="SCB-301",
            score=0.74,
            confidence=0.85,
            explanation="Multi-sensor trend drift: pH decreasing while stack VOC discharging rises"
        )
        # Project sample forecast
        projector.project_forecast(
            equipment_name="SCB-301",
            target_metric="pH",
            value=8.45,
            horizon_hours=6,
            trend="Decreasing"
        )
        db.close()
        print("Projected sample ML and Forecast nodes successfully in Neo4j.")
    except Exception as e:
        print(f"Projector test exception (expected if Neo4j is offline): {e}")
