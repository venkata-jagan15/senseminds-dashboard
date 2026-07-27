import re
import pandas as pd
from .graph import SessionLocal, init_db, GraphManager

def clean_scrubber_name(col_name: str) -> str:
    """Extracts a readable scrubber name from the raw column header."""
    match = re.search(r'SCB_?(\d{3})', col_name, re.IGNORECASE)
    if match:
        return f"SCB-{match.group(1)}"
    
    if "Ammonia" in col_name:
        return "Ammonia Scrubber"
    if "GCB_6" in col_name:
        return "GCB-6 Scrubber"
    if "FES102" in col_name:
        return "FES-102 Scrubber"
    if "FES_101" in col_name:
        return "FES-101 Scrubber"
        
    return col_name.split('-')[0].strip()

def build_knowledge_graph():
    # 1. Initialize DB tables/constraints
    init_db()
    
    # 2. Start Session
    db = SessionLocal()
    gm = GraphManager(db)
    
    try:
        # Clear existing graph nodes and relationships
        db.run("MATCH (n) DETACH DELETE n")
        print("Cleared existing Neo4j graph nodes and relationships.")

        # Load rule engine output with fallback support if locked/renamed
        import os
        rules_path = "rule_engine_output.csv"
        if not os.path.exists(rules_path) and os.path.exists("rule_engine_output_new.csv"):
            rules_path = "rule_engine_output_new.csv"
            print("Builder: Using fallback rule_engine_output_new.csv")
            
        df_rules = pd.read_csv(rules_path)
        if df_rules.empty:
            print("Rule engine output is empty. Cannot build graph.")
            return
            
        # Get the latest row for real-time status projection
        latest_row = df_rules.iloc[-1]
        
        # 3. Create Plant Node
        plant_name = "Laurus Labs Unit 1"
        gm.add_node(plant_name, "Plant", {"location": "Visakhapatnam, India", "status": "Active"})
        
        # 4. Identify Scrubber columns and add Equipment/Sensor/Finding nodes
        scrubber_cols = [c for c in df_rules.columns if "pH" in c and c not in ["Average_pH", "Max_pH", "Min_pH", "pH_Range", "pH_Change", "pH_Rolling_7", "pH_Status", "pH_Threshold", "pH_Difference", "pH_Trend"]]
        
        print(f"Parsing {len(scrubber_cols)} scrubber sensor columns...")
        
        for col in scrubber_cols:
            scrubber_name = clean_scrubber_name(col)
            raw_val = latest_row[col]
            
            # Skip if value is missing or NaN
            if pd.isna(raw_val):
                continue
                
            val = float(raw_val)
            
            # Add Equipment
            gm.add_node(scrubber_name, "Equipment", {"status": "Active"})
            gm.add_relationship(plant_name, scrubber_name, "HAS_EQUIPMENT")
            
            # Add Sensor
            sensor_name = f"{scrubber_name} pH Sensor"
            gm.add_node(sensor_name, "Sensor", {"unit": "pH", "current_value": val})
            gm.add_relationship(scrubber_name, sensor_name, "HAS_SENSOR")
            
            # Create Health Node
            health_score = 100 - abs(val - 11.0) * 15 # Simple chemical offset score
            health_score = max(0.0, min(100.0, round(health_score, 1)))
            
            health_node_name = f"{scrubber_name} Health Rating"
            gm.add_node(health_node_name, "Health", {"score": health_score})
            gm.add_relationship(scrubber_name, health_node_name, "HAS_HEALTH")
            
            # Add Finding, Diagnosis, Root Cause, Recommendation based on threshold rules
            if val < 9.5:
                finding_name = f"{scrubber_name} Low pH"
                gm.add_node(finding_name, "Finding", {"value": val, "severity": "Critical"})
                gm.add_relationship(sensor_name, finding_name, "GENERATES")
                
                diagnosis_name = f"{scrubber_name} Alkali Deficit"
                gm.add_node(diagnosis_name, "Diagnosis", {"description": "Chemical scrubbing efficiency compromised due to lack of alkali buffer."})
                gm.add_relationship(finding_name, diagnosis_name, "CAUSES")
                
                cause_name = f"{scrubber_name} Low Caustic Dosing"
                gm.add_node(cause_name, "Root Cause", {"probable_cause": "Caustic pump line blockage or supply failure"})
                gm.add_relationship(diagnosis_name, cause_name, "HAS_ROOT_CAUSE")
                
                rec_name = f"Verify {scrubber_name} Caustic Feed Line & Increase Pump Flow"
                gm.add_node(rec_name, "Recommendation", {"action": "Inspect dosing pump valves and run alkali calibration"})
                gm.add_relationship(cause_name, rec_name, "HAS_RECOMMENDATION")
            else:
                finding_name = f"{scrubber_name} Standard pH Neutralization"
                gm.add_node(finding_name, "Finding", {"value": val, "severity": "Normal"})
                gm.add_relationship(sensor_name, finding_name, "GENERATES")
                
                diagnosis_name = f"{scrubber_name} Optimal Neutralization"
                gm.add_node(diagnosis_name, "Diagnosis", {"description": "Scrubber chemical parameters within regulatory bounds."})
                gm.add_relationship(finding_name, diagnosis_name, "CAUSES")

        # 5. Add Global Air/Stack VOC Sensors
        voc_val = float(latest_row["AQMS2_VOC"]) if "AQMS2_VOC" in latest_row else 24.0
        voc_sensor = "Stack VOC CEMS"
        gm.add_node(voc_sensor, "Sensor", {"unit": "µg/m³", "current_value": voc_val})
        gm.add_relationship(plant_name, voc_sensor, "HAS_SENSOR")
        
        if voc_val > 35.0:
            finding_name = "High Stack VOC Discharge"
            gm.add_node(finding_name, "Finding", {"value": voc_val, "severity": "Warning"})
            gm.add_relationship(voc_sensor, finding_name, "GENERATES")
            
            diagnosis_name = "Reduced Scrubbing Absorption Efficiency"
            gm.add_node(diagnosis_name, "Diagnosis", {"description": "Unabsorbed volatile gases venting to atmosphere."})
            gm.add_relationship(finding_name, diagnosis_name, "CAUSES")
            
            cause_name = "Low Alkali Dosing / High Influent Gas Load"
            gm.add_node(cause_name, "Root Cause", {"probable_cause": "Cumulative scrubber alkaline drops leading to reduced contact efficiency."})
            gm.add_relationship(diagnosis_name, cause_name, "HAS_ROOT_CAUSE")
            
            rec_name = "Inspect Caustic Feed Calibration Across All Active Scrubber Columns"
            gm.add_node(rec_name, "Recommendation", {"action": "Perform plant-wide scrubber calibration"})
            gm.add_relationship(cause_name, rec_name, "HAS_RECOMMENDATION")
        else:
            finding_name = "Standard Air Emissions"
            gm.add_node(finding_name, "Finding", {"value": voc_val, "severity": "Normal"})
            gm.add_relationship(voc_sensor, finding_name, "GENERATES")
            
        db.commit()
        print("Knowledge Graph successfully populated in Neo4j.")
        
        # 6. Export to JSON for frontend usage/caching
        gm.export_json("cems_knowledge_graph.json")
        import os
        os.makedirs("src/data", exist_ok=True)
        gm.export_json("src/data/cems_knowledge_graph.json")
        print("Exported cems_knowledge_graph.json and src/data/cems_knowledge_graph.json successfully.")
        
    except Exception as e:
        db.rollback()
        print(f"Error populating knowledge graph: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    build_knowledge_graph()
