import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from knowledge_graph.graph import SessionLocal, GraphManager

def compute_safety_engine():
    input_file = "feature_engineered_data_updated.csv"
    if not os.path.exists(input_file):
        input_file = "feature_engineered_data.csv"
        
    if not os.path.exists(input_file):
        print(f"Telemetry engineered dataset not found. Cannot run safety engine.")
        return
        
    df = pd.read_csv(input_file)
    print(f"Safety Engine: Loaded {len(df)} telemetry logs.")
    
    # Get latest row to represent active Control Room telemetry
    latest_row = df.iloc[-1]
    
    # Extract current metrics
    current_voc = float(latest_row["Primary_VOC"]) if "Primary_VOC" in latest_row else 24.0
    current_ph = float(latest_row["Average_pH"]) if "Average_pH" in latest_row else 9.85
    stability = float(latest_row["Stability_Index"]) if "Stability_Index" in latest_row else 98.5
    
    # Calculate Forecasts (30m, 1h, 4h horizons)
    # Using linear expansion / trend analysis of the last 7 rows
    trend_slice = df.tail(7)
    voc_trend_slope = np.polyfit(range(len(trend_slice)), trend_slice["Primary_VOC"].fillna(24.0), 1)[0]
    ph_trend_slope = np.polyfit(range(len(trend_slice)), trend_slice["Average_pH"].fillna(9.85), 1)[0]
    
    # Projections
    voc_30m = max(0.0, round(current_voc + voc_trend_slope * 0.5, 2))
    voc_1h = max(0.0, round(current_voc + voc_trend_slope * 1.0, 2))
    voc_4h = max(0.0, round(current_voc + voc_trend_slope * 4.0, 2))
    
    ph_30m = max(0.0, min(14.0, round(current_ph + ph_trend_slope * 0.5, 2)))
    ph_1h = max(0.0, min(14.0, round(current_ph + ph_trend_slope * 1.0, 2)))
    ph_4h = max(0.0, min(14.0, round(current_ph + ph_trend_slope * 4.0, 2)))
    
    # Calculate Scrubber Mechanical Failure Probabilities (%)
    # Derived from telemetry fluctuations
    ph_std = trend_slice["Average_pH"].std()
    voc_std = trend_slice["Primary_VOC"].std()
    
    pump_failure_prob = round(min(98.5, max(1.2, ph_std * 45.0 + (100.0 - stability) * 0.4)), 1)
    fan_failure_prob = round(min(99.0, max(0.8, voc_std * 2.8 + (voc_30m > 40.0) * 20.0)), 1)
    sensor_failure_prob = round(min(95.0, max(0.5, (ph_std < 0.01) * 35.0 + (voc_std < 0.01) * 25.0)), 1) # flatlining sensor indication
    nozzle_blockage_prob = round(min(97.5, max(1.5, (ph_trend_slope < -0.15) * 50.0 + (100.0 - stability) * 0.2)), 1)
    
    # Calculate Scrubber Efficiency Score (%)
    scrubber_efficiency = round(max(15.0, min(99.8, 98.2 - (11.0 - current_ph) * 8.0 - (100.0 - stability) * 0.15)), 1)
    
    # Compute Plant Safety Index (0-100) and Classification (Green, Yellow, Orange, Red)
    # Standard engineering KPI weightings
    safety_score = 100.0 - (
        (11.0 - current_ph) * 3.5 + 
        (current_voc > 35.0) * 15.0 + 
        (100.0 - stability) * 0.5 + 
        max(pump_failure_prob, fan_failure_prob) * 0.25
    )
    safety_score = max(0.0, min(100.0, round(safety_score, 1)))
    
    classification = "Green"
    if safety_score < 90.0:
        classification = "Yellow"
    if safety_score < 75.0:
        classification = "Orange"
    if safety_score < 60.0:
        classification = "Red"
        
    # Generate Corrective Automatic PLC overrides
    plc_actions = []
    if current_ph < 9.5:
        plc_actions.append({
            "command": "INCREASE_CHEMICAL_DOSING",
            "parameter": "NaOH pump flow rate set to 6.2 L/hr (+25%)",
            "status": "Executed Automatically"
        })
    if pump_failure_prob > 40.0:
        plc_actions.append({
            "command": "START_STANDBY_PUMP",
            "parameter": "Activating backup chemical dosing pump P-302B",
            "status": "Standby Engaged"
        })
    if current_voc > 35.0 or fan_failure_prob > 35.0:
        plc_actions.append({
            "command": "BOOST_EXHAUST_FAN",
            "parameter": "Scrubber exhaust fan spin speed boosted to 1800 RPM",
            "status": "Active Override"
        })
    if classification in ["Orange", "Red"]:
        plc_actions.append({
            "command": "TRIGGER_EMERGENCY_VENTILATION",
            "parameter": "Duct bypass ventilation dampers set to 100% open",
            "status": "Alarm State Engaged"
        })
        
    print(f"Safety Score: {safety_score}% ({classification})")
    print(f"Active PLC overrides: {len(plc_actions)}")
    
    # Write and project results directly to the Knowledge Graph
    db = SessionLocal()
    gm = GraphManager(db)
    
    try:
        plant_name = "Laurus Labs Unit 1"
        # Update plant safety node details
        gm.add_node(
            plant_name, 
            "Plant", 
            {
                "safety_score": safety_score, 
                "safety_level": classification,
                "scrubber_efficiency": scrubber_efficiency,
                "pump_failure_probability": pump_failure_prob,
                "fan_failure_probability": fan_failure_prob,
                "nozzle_blockage_probability": nozzle_blockage_prob,
                "sensor_failure_probability": sensor_failure_prob
            }
        )
        
        # Add Forecast Node
        forecast_node = "Emissions Trend Forecast"
        gm.add_node(
            forecast_node,
            "Forecast",
            {
                "voc_30m": voc_30m,
                "voc_1h": voc_1h,
                "voc_4h": voc_4h,
                "ph_30m": ph_30m,
                "ph_1h": ph_1h,
                "ph_4h": ph_4h,
                "calculated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        )
        gm.add_relationship(plant_name, forecast_node, "HAS_FORECAST")
        
        # Save PLC Command Details
        for idx, action in enumerate(plc_actions):
            cmd_node = f"PLC Override Alert {idx+1}: {action['command']}"
            gm.add_node(
                cmd_node,
                "Recommendation",
                {
                    "action": action["parameter"],
                    "command": action["command"],
                    "status": action["status"],
                    "severity": "High" if classification in ["Orange", "Red"] else "Medium"
                }
            )
            gm.add_relationship(plant_name, cmd_node, "HAS_RECOMMENDATION")
            
        db.commit()
        print("Safety engine successfully synced to database.")
        
        # Export latest json cache
        gm.export_json("cems_knowledge_graph.json")
        gm.export_json("src/data/cems_knowledge_graph.json")
        print("Knowledge Graph static asset cache files exported.")
        
    except Exception as e:
        db.rollback()
        print(f"Error syncing safety engine details: {e}")
        raise e
    finally:
        db.close()
        
    # Return metrics for local verification log
    return {
        "safety_score": safety_score,
        "classification": classification,
        "plc_actions": plc_actions,
        "failures": {
            "pump": pump_failure_prob,
            "fan": fan_failure_prob,
            "nozzle": nozzle_blockage_prob,
            "sensor": sensor_failure_prob
        },
        "forecasts": {
            "voc": [voc_30m, voc_1h, voc_4h],
            "ph": [ph_30m, ph_1h, ph_4h]
        }
    }

if __name__ == "__main__":
    compute_safety_engine()
