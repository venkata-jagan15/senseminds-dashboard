import os
import logging
from datetime import datetime

# Setup safety alerts logging
LOG_FILE = "safety_alerts.log"
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

class AlertDispatcher:
    @staticmethod
    def log_alert(level: str, safety_score: float, details: str):
        """Logs safety warnings locally to alerts log file."""
        msg = f"THREAT LEVEL: {level} (Safety Index: {safety_score}%) - {details}"
        print(f"[ALERT DISPATCH] {msg}")
        if level in ["Orange", "Red"]:
            logging.error(msg)
            AlertDispatcher.dispatch_mock_notifications(level, safety_score, details)
        elif level == "Yellow":
            logging.warning(msg)
        else:
            logging.info(msg)

    @staticmethod
    def dispatch_mock_notifications(level: str, safety_score: float, details: str):
        """Simulates SMS, Email, and WhatsApp API dispatch alerts representing Layer 5."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print("\n" + "="*60)
        print(f"🚨 LAYER 5 LIVE DISPATCH ALERTS (TIMESTAMPM: {timestamp})")
        print("="*60)
        
        # 1. Mock SMS
        print(f"📱 [SMS DISPATCHED] -> To Safety Officer (+91-98XXX-XXXXX):")
        print(f"   \"CRITICAL ALERT: Laurus Labs Unit 1 Threat Level: {level} (Safety Score: {safety_score}%). Action Required: {details}\"")
        
        # 2. Mock Email
        print(f"📧 [EMAIL SENT] -> To plant-managers@lauruslabs.com:")
        print(f"   Subject: EMERGENCY WARNING: AI Safety Engine Flag [{level}]")
        print(f"   Body: Outlier multi-sensor drift and mechanical failures detected on scrubber columns. Active Score: {safety_score}%. details: {details}")
        
        # 3. Mock WhatsApp
        print(f"💬 [WHATSAPP DISPATCHED] -> To Executive Operations Group:")
        print(f"   \"🚨 Safety Alert: Emergency Dampers Triggered automatically by AI safety engine override. Scrubber Efficiency at critical limits.\"")
        print("="*60 + "\n")

def check_and_dispatch_alerts(db_session):
    """Load latest Plant Safety score from DB and run checks."""
    try:
        query = "MATCH (p:Plant) RETURN properties(p) as properties LIMIT 1"
        res = db_session.run(query)
        record = res.single()
        if not record:
            return
            
        props = record["properties"] or {}
        score = props.get("safety_score", 100.0)
        level = props.get("safety_level", "Green")
        
        # Build alert details string based on failures or readings
        failures = []
        if props.get("pump_failure_probability", 0) > 40.0:
            failures.append("Pump Failure probability high")
        if props.get("fan_failure_probability", 0) > 40.0:
            failures.append("Fan Motor fatigue warning")
            
        details = ", ".join(failures) if failures else "Standard operating parameters observed."
        
        # Run dispatcher check
        AlertDispatcher.log_alert(level, score, details)
        
    except Exception as e:
        print(f"Error checking and dispatching alerts: {e}")

if __name__ == "__main__":
    from knowledge_graph.graph import SessionLocal
    db = SessionLocal()
    check_and_dispatch_alerts(db)
    db.close()
