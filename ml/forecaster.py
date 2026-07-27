import os
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from knowledge_graph.graph import SessionLocal, GraphManager

def run_forecasting_pipeline():
    input_file = "feature_engineered_data.csv"
    if not os.path.exists(input_file):
        print(f"Input telemetry dataset {input_file} not found. Cannot run forecaster.")
        return
        
    df = pd.read_csv(input_file)
    print(f"Forecaster: Loaded {len(df)} rows of data.")
    
    # 1. Prepare VOC time-series
    # Fill any missing values using interpolation
    voc_series = df["Primary_VOC"].interpolate(method="linear").fillna(24.0)
    ph_series = df["Average_pH"].interpolate(method="linear").fillna(11.0)
    
    # 2. Fit Holt-Winters Exponential Smoothing models
    try:
        # Fit VOC forecaster
        # Holt Winters is ideal for local trend smoothing without seasonal patterns
        model_voc = ExponentialSmoothing(voc_series, trend="add", seasonal=None)
        fit_voc = model_voc.fit()
        # Predict 4 steps ahead (30m, 1h, 2h, 4h)
        voc_forecast = fit_voc.forecast(steps=4)
        
        # Fit pH forecaster
        model_ph = ExponentialSmoothing(ph_series, trend="add", seasonal=None)
        fit_ph = model_ph.fit()
        ph_forecast = fit_ph.forecast(steps=4)
        
        # Ensure values don't go below bounds
        voc_30m = max(0.0, round(float(voc_forecast.iloc[0]), 2))
        voc_1h = max(0.0, round(float(voc_forecast.iloc[1]), 2))
        voc_4h = max(0.0, round(float(voc_forecast.iloc[3]), 2))
        
        ph_30m = max(0.0, min(14.0, round(float(ph_forecast.iloc[0]), 2)))
        ph_1h = max(0.0, min(14.0, round(float(ph_forecast.iloc[1]), 2)))
        ph_4h = max(0.0, min(14.0, round(float(ph_forecast.iloc[3]), 2)))
        
        print(" Holt-Winters time-series models fitted successfully.")
        print(f"Forecasted VOC limits: 30m={voc_30m}, 1h={voc_1h}, 4h={voc_4h}")
        
        # 3. Export to CSV for compliance records
        forecast_df = pd.DataFrame({
            "Horizon": ["30_min", "1_hour", "4_hour"],
            "VOC_Prediction": [voc_30m, voc_1h, voc_4h],
            "pH_Prediction": [ph_30m, ph_1h, ph_4h]
        })
        forecast_df.to_csv("cems_predictions.csv", index=False)
        print("Exported cems_predictions.csv successfully.")
        
        # 4. Sync values back to Database & JSON Graph
        sync_forecasts_to_db(voc_30m, voc_1h, voc_4h, ph_30m, ph_1h, ph_4h)
        
    except Exception as e:
        print(f"Error executing forecasting model: {e}")

def sync_forecasts_to_db(voc_30m, voc_1h, voc_4h, ph_30m, ph_1h, ph_4h):
    db = SessionLocal()
    gm = GraphManager(db)
    try:
        plant_name = "Laurus Labs Unit 1"
        forecast_node = "Emissions Trend Forecast"
        
        # Generate XAI explanation for Forecast node
        from knowledge_graph.xai import ExplainableAI
        xai_engine = ExplainableAI()
        
        trend = "Increasing" if voc_4h > voc_30m else "Decreasing"
        if abs(voc_4h - voc_30m) < 0.2:
            trend = "Stable"
            
        explanation = "Telemetry forecasts indicate standard stable parameters."
        try:
            explanation = xai_engine.generate_forecast_explanation("VOC", trend, [voc_30m, voc_1h, voc_4h])
        except Exception as e:
            print(f"Forecasting XAI generation failed: {e}")
            
        # Add Forecast Node
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
                "forecasting_method": "Holt-Winters Exponential Smoothing",
                "explanation": explanation
            }
        )
        gm.add_relationship(plant_name, forecast_node, "HAS_FORECAST")
        db.commit()
        
        # Update JSON static cache file
        gm.export_json("cems_knowledge_graph.json")
        gm.export_json("src/data/cems_knowledge_graph.json")
        print("Knowledge Graph JSON assets synchronized with advanced forecasts.")
        
    except Exception as e:
        db.rollback()
        print(f"Error writing forecast results to database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_forecasting_pipeline()
