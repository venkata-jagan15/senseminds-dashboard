# =====================================================
# SenseMinds Rule Engine
# =====================================================

import pandas as pd

# -----------------------------------------------------
# Load Deterministic Analytics Output
# -----------------------------------------------------

df = pd.read_csv("deterministic_analytics_output.csv")

# -----------------------------------------------------
# Rule Engine Function
# -----------------------------------------------------

def apply_rules(row):

    diagnosis = []
    causes = []
    recommendations = []
    severity = "Normal"

    # ---------------------------------
    # Rule 1 : Low pH
    # ---------------------------------

    if row["Average_pH"] < 9.5:

        diagnosis.append("Low pH")

        causes.append("Low Alkali Dosing")

        recommendations.append("Increase Alkali Flow")

        severity = "Warning"

    # ---------------------------------
    # Rule 2 : High VOC
    # ---------------------------------

    if row["VOC_Threshold"] == "High":

        diagnosis.append("High VOC")

        causes.append("Poor VOC Absorption")

        recommendations.append("Inspect Packing Material")

        severity = "Warning"

    # ---------------------------------
    # Rule 3 : Low pH + High VOC
    # ---------------------------------

    if row["Average_pH"] < 9.5 and row["VOC_Threshold"] == "High":

        diagnosis.append("Reduced Scrubber Efficiency")

        causes.append("Scrubber Chemical Inefficiency")

        recommendations.append("Check Alkali Dosing Pump")

        severity = "Critical"

    # ---------------------------------
    # Rule 4 : Low Health Score
    # ---------------------------------

    if row["Health_Score"] < 60:

        diagnosis.append("Maintenance Required")

        causes.append("Equipment Health Degraded")

        recommendations.append("Schedule Maintenance")

        severity = "Critical"

    # ---------------------------------
    # Rule 5 : pH Trend
    # ---------------------------------

    if row["pH_Trend"] == "Decreasing":

        diagnosis.append("Scrubber Performance Degrading")

        recommendations.append("Monitor pH Continuously")

    # ---------------------------------
    # Rule 6 : VOC Trend
    # ---------------------------------

    if row["VOC_Trend"] == "Increasing":

        diagnosis.append("VOC Increasing")

        recommendations.append("Inspect VOC Removal Efficiency")

    # ---------------------------------
    # Healthy Condition
    # ---------------------------------

    if len(diagnosis) == 0:

        diagnosis.append("Healthy")

        causes.append("Normal Operation")

        recommendations.append("Continue Monitoring")

        severity = "Normal"

    return pd.Series({

        "Severity": severity,

        "Diagnosis": ", ".join(sorted(set(diagnosis))),

        "Root_Cause": ", ".join(sorted(set(causes))),

        "Recommendation": ", ".join(sorted(set(recommendations)))

    })

# -----------------------------------------------------
# Apply Rule Engine
# -----------------------------------------------------

rule_output = df.apply(apply_rules, axis=1)

df = pd.concat([df, rule_output], axis=1)

# -----------------------------------------------------
# Display Results
# -----------------------------------------------------

print("=" * 80)
print("               SENSEMINDS RULE ENGINE")
print("=" * 80)

print(df[[
    "Date",
    "Average_pH",
    "Health_Score",
    "VOC_Threshold",
    "Severity",
    "Diagnosis",
    "Root_Cause",
    "Recommendation"
]].head(20))

# -----------------------------------------------------
# Save Output
# -----------------------------------------------------

output_file = "rule_engine_output.csv"

try:
    df.to_csv(output_file, index=False)
    print(f"\nRule Engine Completed Successfully!")
    print(f"Output saved as: {output_file}")
except PermissionError:
    print(f"\nWARNING: '{output_file}' is locked (likely open in Excel). Please close the file.")
    fallback_file = "rule_engine_output_new.csv"
    df.to_csv(fallback_file, index=False)
    print(f"Fallback: Saved rule engine output to '{fallback_file}' instead.")