# ============================================
# DETERMINISTIC ANALYTICS ENGINE
# ============================================

import pandas as pd
import numpy as np

# --------------------------------------------
# Load Feature Engineered Dataset
# --------------------------------------------

df = pd.read_csv("feature_engineered_data.csv")

# --------------------------------------------
# Detect VOC Column Automatically
# --------------------------------------------

voc_column = None

for col in df.columns:
    if "VOC" in col.upper():
        voc_column = col
        break

if voc_column is None:
    raise Exception("VOC column not found!")

print("VOC Column :", voc_column)

# ============================================
# 1. STATISTICS
# ============================================

print("\n========== DATASET STATISTICS ==========")

print("\nAverage pH Statistics")
print(df["Average_pH"].describe())

print("\nVOC Statistics")
print(df[voc_column].describe())

# ============================================
# 2. THRESHOLD DETECTION
# ============================================

def ph_threshold(ph):

    if ph < 9.5:
        return "Critical"

    elif ph <= 11.5:
        return "Normal"

    else:
        return "High"

df["pH_Threshold"] = df["Average_pH"].apply(ph_threshold)


def voc_threshold(v):

    if v < 20:
        return "Low"

    elif v <= 35:
        return "Normal"

    else:
        return "High"

df["VOC_Threshold"] = df[voc_column].apply(voc_threshold)

# ============================================
# 3. TREND DETECTION
# ============================================

df["pH_Difference"] = df["Average_pH"].diff()

df["VOC_Difference"] = df[voc_column].diff()


def trend(x):

    if pd.isna(x):
        return "Stable"

    elif x > 0:
        return "Increasing"

    elif x < 0:
        return "Decreasing"

    else:
        return "Stable"

df["pH_Trend"] = df["pH_Difference"].apply(trend)

df["VOC_Trend"] = df["VOC_Difference"].apply(trend)

# ============================================
# 4. HEALTH SCORE
# ============================================

def health_score(row):

    score = 100

    if row["Average_pH"] < 9.5:
        score -= 30

    if row[voc_column] > 35:
        score -= 30

    if row["pH_Trend"] == "Decreasing":
        score -= 10

    if row["VOC_Trend"] == "Increasing":
        score -= 10

    if score < 0:
        score = 0

    return score

df["Health_Score"] = df.apply(health_score, axis=1)

# ============================================
# 5. ALERT GENERATION
# ============================================

def generate_alert(row):

    alerts = []

    if row["Average_pH"] < 9.5:
        alerts.append("Low pH")

    if row[voc_column] > 35:
        alerts.append("High VOC")

    if row["pH_Trend"] == "Decreasing":
        alerts.append("pH Dropping")

    if row["VOC_Trend"] == "Increasing":
        alerts.append("VOC Rising")

    if len(alerts) == 0:
        return "No Alert"

    return ", ".join(alerts)

df["Alert"] = df.apply(generate_alert, axis=1)

# ============================================
# 6. ENGINEERING FINDINGS
# ============================================

def engineering_finding(row):

    if row["Average_pH"] < 9.5 and row[voc_column] > 35:
        return "Reduced Scrubber Efficiency"

    elif row["Average_pH"] < 9.5:
        return "Low Alkali Dosing"

    elif row[voc_column] > 35:
        return "Poor VOC Absorption"

    elif row["VOC_Trend"] == "Increasing":
        return "VOC Trend Increasing"

    elif row["pH_Trend"] == "Decreasing":
        return "Scrubber Performance Degrading"

    else:
        return "Healthy"

df["Engineering_Finding"] = df.apply(engineering_finding, axis=1)

# ============================================
# DISPLAY RESULTS
# ============================================

print("\n========== DETERMINISTIC ANALYTICS ==========\n")

print(df[[
    "Date",
    "Average_pH",
    voc_column,
    "pH_Threshold",
    "VOC_Threshold",
    "pH_Trend",
    "VOC_Trend",
    "Health_Score",
    "Alert",
    "Engineering_Finding"
]].head(20))

# ============================================
# SAVE OUTPUT
# ============================================

df.to_csv("deterministic_analytics_output.csv", index=False)

print("\n===========================================")
print("DETERMINISTIC ANALYTICS COMPLETED")
print("===========================================")

print("\nOutput File Saved As:")
print("deterministic_analytics_output.csv")