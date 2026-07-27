# ============================================
# FEATURE ENGINEERING - LAURUS LABS
# ============================================

import pandas as pd
import os
import numpy as np

# ---------------------------------
# Load Cleaned Dataset
# ---------------------------------

file_path = "clean_data.csv"

if os.path.exists(file_path):
    df = pd.read_csv(file_path)
elif os.path.exists("Laurus_Cleaned_Data.xlsx"):
    file_path = "Laurus_Cleaned_Data.xlsx"
    df = pd.read_excel(file_path)
else:
    raise FileNotFoundError("Neither 'clean_data.csv' nor 'Laurus_Cleaned_Data.xlsx' was found.")

print(f"Loaded dataset from: {file_path}")

# ---------------------------------
# Convert Date
# ---------------------------------

date_col = "Date" if "Date" in df.columns else ("Time" if "Time" in df.columns else None)

if date_col:
    df["Date"] = pd.to_datetime(df[date_col], errors="coerce")
else:
    raise KeyError("Could not find 'Date' or 'Time' column in dataset.")

# ---------------------------------
# Automatically Detect Scrubber Columns
# ---------------------------------

ph_columns = [col for col in df.columns if ("PH" in col.upper() or "SCB" in col.upper()) and col not in ["Average_pH", "Max_pH", "Min_pH", "pH_Range", "pH_Change", "pH_Rolling_7", "pH_Status"]]

print("\nDetected Scrubber Columns:")
print(ph_columns)

# ---------------------------------
# Average pH
# ---------------------------------

df["Average_pH"] = df[ph_columns].mean(axis=1)

# ---------------------------------
# Maximum pH
# ---------------------------------

df["Max_pH"] = df[ph_columns].max(axis=1)

# ---------------------------------
# Minimum pH
# ---------------------------------

df["Min_pH"] = df[ph_columns].min(axis=1)

# ---------------------------------
# pH Range
# ---------------------------------

df["pH_Range"] = df["Max_pH"] - df["Min_pH"]

# ---------------------------------
# pH Change
# ---------------------------------

df["pH_Change"] = df["Average_pH"].diff()

# ---------------------------------
# Detect & Combine VOC Columns
# ---------------------------------

raw_voc_columns = [col for col in df.columns if "VOC" in col.upper() and not col.startswith("VOC_") and col not in ["Primary_VOC"]]

print("\nDetected Raw VOC Sensor Columns:")
print(raw_voc_columns)

if not raw_voc_columns:
    raise ValueError("No VOC columns found in dataset.")

# Combine into Primary_VOC to ensure non-zero continuous telemetry across stations
df["Primary_VOC"] = df[raw_voc_columns].max(axis=1)
voc = "Primary_VOC"
print(f"Using combined VOC signal: '{voc}'")

# ---------------------------------
# VOC Change
# ---------------------------------

df["VOC_Change"] = df[voc].diff()

# ---------------------------------
# VOC Rolling Average
# ---------------------------------

df["VOC_Rolling_7"] = df[voc].rolling(7, min_periods=1).mean()

# ---------------------------------
# VOC Rolling Std Dev
# ---------------------------------

df["VOC_STD_7"] = df[voc].rolling(7, min_periods=1).std().fillna(0)

# ---------------------------------
# pH Rolling Average
# ---------------------------------

df["pH_Rolling_7"] = df["Average_pH"].rolling(7, min_periods=1).mean()

# ---------------------------------
# VOC Rate of Change
# ---------------------------------

df["VOC_Rate"] = (df[voc].pct_change() * 100).replace([np.inf, -np.inf], np.nan).fillna(0)

# ---------------------------------
# Stability Index
# ---------------------------------

df["Stability_Index"] = 100 - abs(df["pH_Change"].fillna(0) * 10)

# ---------------------------------
# Day & Month Names
# ---------------------------------

df["Day_Name"] = df["Date"].dt.day_name()
df["Month_Name"] = df["Date"].dt.month_name()

# ---------------------------------
# pH Status
# ---------------------------------

def ph_status(x):
    if pd.isna(x):
        return "Unknown"
    elif x < 9.5:
        return "Low"
    elif x <= 11.5:
        return "Normal"
    else:
        return "High"

df["pH_Status"] = df["Average_pH"].apply(ph_status)

# ---------------------------------
# VOC Category
# ---------------------------------

def voc_status(x):
    if pd.isna(x):
        return "Unknown"
    elif x < 1.0:
        return "Low"
    elif x <= 25.0:
        return "Normal"
    else:
        return "High"

df["VOC_Status"] = df[voc].apply(voc_status)

# ---------------------------------
# Save Feature Engineered Dataset
# ---------------------------------

out_filename = "feature_engineered_data.csv"
try:
    df.to_csv(out_filename, index=False)
except PermissionError:
    out_filename = "feature_engineered_data_updated.csv"
    df.to_csv(out_filename, index=False)
    print(f"Warning: 'feature_engineered_data.csv' is open/locked in another program. Saved to '{out_filename}' instead.")

print("\n===================================")
print("FEATURE ENGINEERING COMPLETED")
print("===================================")

print("\nNew Columns Created:\n")

new_columns = [
    "Average_pH",
    "Max_pH",
    "Min_pH",
    "pH_Range",
    "pH_Change",
    "VOC_Change",
    "VOC_Rolling_7",
    "VOC_STD_7",
    "pH_Rolling_7",
    "VOC_Rate",
    "Stability_Index",
    "Day_Name",
    "Month_Name",
    "pH_Status",
    "VOC_Status"
]

for col in new_columns:
    print(col)

print("\nSaved File:")
print(out_filename)