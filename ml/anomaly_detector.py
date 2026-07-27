import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def run_anomaly_detection():
    # 1. Load feature engineered data
    input_file = "feature_engineered_data.csv"
    if not os.path.exists(input_file):
        print(f"Input file {input_file} not found. Cannot run anomaly detection.")
        return
        
    df = pd.read_csv(input_file)
    print(f"Loaded {len(df)} rows from {input_file}")
    
    # 2. Select numerical features for Isolation Forest
    feature_cols = [
        "Average_pH", "Max_pH", "Min_pH", "pH_Range", "pH_Change",
        "Primary_VOC", "VOC_Change", "VOC_Rolling_7", "VOC_STD_7", 
        "pH_Rolling_7", "VOC_Rate", "Stability_Index"
    ]
    
    # Verify columns exist
    feature_cols = [c for c in feature_cols if c in df.columns]
    print(f"Using {len(feature_cols)} features: {feature_cols}")
    
    # 3. Clean and impute missing cells (NaNs)
    X = df[feature_cols].copy()
    X = X.ffill().bfill() # Forward fill and backfill missing cells
    # Fill remaining NaNs with mean values
    for col in X.columns:
        if X[col].isnull().any():
            X[col] = X[col].fillna(X[col].mean())
            
    # 4. Fit Isolation Forest model
    # contamination = 0.05 targets approximately 5% outliers
    forest = IsolationForest(n_estimators=120, contamination=0.05, random_state=42)
    forest.fit(X)
    
    # 5. Compute predictions and scores
    predictions = forest.predict(X) # 1 = normal, -1 = anomaly
    raw_scores = forest.score_samples(X) # lower = more anomalous
    
    # Normalize anomaly scores to a 0.0 - 1.0 scale where higher is more anomalous
    max_raw = raw_scores.max()
    min_raw = raw_scores.min()
    range_raw = max_raw - min_raw if max_raw != min_raw else 1.0
    anomaly_scores = (max_raw - raw_scores) / range_raw
    
    # 6. Analyze feature drivers for explainability (Z-score deviation check)
    means = X.mean()
    stds = X.std().replace(0, 1.0) # Avoid division by zero
    
    drivers = []
    explanations = []
    
    for idx, row in X.iterrows():
        is_outlier = predictions[idx] == -1
        
        # Calculate absolute deviations
        z_scores = abs((row - means) / stds)
        primary_driver = z_scores.idxmax()
        deviation_val = z_scores[primary_driver]
        
        drivers.append(primary_driver)
        
        if is_outlier:
            explanations.append(
                f"Multi-sensor outlier state detected. Primary driver: '{primary_driver}' showing a {deviation_val:.2f}x standard deviation from normal mean operating baselines."
            )
        else:
            explanations.append("Operational values within normal multidimensional clusters.")

    # 7. Add metrics back to dataframe
    df["ML_Anomaly_Score"] = np.round(anomaly_scores, 3)
    df["ML_Is_Anomaly"] = predictions # 1 or -1
    df["ML_Primary_Driver"] = drivers
    df["ML_Anomaly_Explanation"] = explanations
    
    # Save output files
    df.to_csv("ml_anomalies_output.csv", index=False)
    # Also overwrite updated feature csv to sync downstream
    df.to_csv("feature_engineered_data_updated.csv", index=False)
    print("Isolation Forest metrics calculated. Saved ml_anomalies_output.csv")
    
    # 8. Project Anomalies into the Knowledge Graph
    project_anomalies_to_graph(df)

def project_anomalies_to_graph(df):
    """Write anomalies to the database utilizing our GraphProjector."""
    try:
        from knowledge_graph.projector import GraphProjector
        from knowledge_graph.graph import SessionLocal
        from knowledge_graph.xai import ExplainableAI
        
        db = SessionLocal()
        projector = GraphProjector(db)
        xai_engine = ExplainableAI()
        
        # Find rows flagged as anomalies
        anomalies_df = df[df["ML_Is_Anomaly"] == -1]
        print(f"Projecting {len(anomalies_df)} machine learning anomalies to the Knowledge Graph...")
        
        for _, row in anomalies_df.iterrows():
            date_str = str(row["Date"])
            score = float(row["ML_Anomaly_Score"])
            driver = row["ML_Primary_Driver"]
            explanation = row["ML_Anomaly_Explanation"]
            
            # Map anomaly to equipment columns
            target_asset = "SCB-301" # Default to our high-risk scrubber column
            
            # Let's see if we can identify specific scrubbers showing anomalies
            scrubber_cols = [c for c in df.columns if "pH" in c and c not in [
                "Average_pH", "Max_pH", "Min_pH", "pH_Range", "pH_Change", "pH_Rolling_7",
                "pH_Status", "pH_Threshold", "pH_Difference", "pH_Trend", "ML_Anomaly_Score", "ML_Is_Anomaly"
            ]]
            
            worst_dev = -1.0
            for col in scrubber_cols:
                val = row[col]
                if not pd.isna(val):
                    dev = abs(float(val) - 11.0)
                    if dev > worst_dev:
                        worst_dev = dev
                        # Extract scrubber name, e.g. SCB-301
                        match = re_match_scrubber(col)
                        if match:
                            target_asset = match
                            
            # Gather readings for XAI
            readings = {
                "pH": row.get("Average_pH", 8.12),
                "flow_rate": row.get("Average_NaOH_Flow", 1.2),
                "voc_emissions": row.get("Average_VOC", 38.5)
            }
            
            # Generate explainable AI note dynamically
            try:
                xai_explanation = xai_engine.generate_anomaly_explanation(target_asset, score, readings)
                explanation = xai_explanation
            except Exception as e:
                print(f"ML Anomaly XAI generation error: {e}")
            
            projector.project_ml_anomaly(
                equipment_name=target_asset,
                score=score,
                confidence=0.82,
                explanation=explanation
            )
            
        db.close()
        print("ML findings projected successfully to database.")
    except Exception as e:
        print(f"Error projecting ML findings to graph: {e}")

def re_match_scrubber(col_name: str) -> str:
    import re
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
    return "SCB-302"

if __name__ == "__main__":
    run_anomaly_detection()
