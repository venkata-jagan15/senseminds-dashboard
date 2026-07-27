# ============================================
# LAURUS LABS - EXPLORATORY DATA ANALYSIS (EDA)
# ============================================

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# ----------------------------
# Helper: Sanitize Filenames
# ----------------------------
def safe_filename(name):
    return "".join([c if c.isalnum() or c in ('_', '-') else '_' for c in str(name)])

# ----------------------------
# Load Dataset
# ----------------------------
file_path = "clean_data.csv"

if os.path.exists(file_path):
    df = pd.read_csv(file_path)
elif os.path.exists("Laurus_Cleaned_Data.xlsx"):
    file_path = "Laurus_Cleaned_Data.xlsx"
    df = pd.read_excel(file_path)
else:
    raise FileNotFoundError("Neither 'clean_data.csv' nor 'Laurus_Cleaned_Data.xlsx' was found.")

print(f"Loaded dataset from: {file_path}")

# ----------------------------
# Convert Date Column
# ----------------------------
date_col = "Date" if "Date" in df.columns else ("Time" if "Time" in df.columns else None)

if date_col:
    df["Date"] = pd.to_datetime(df[date_col], errors="coerce")
else:
    print("Warning: No Date/Time column found.")

# ----------------------------
# Dataset Information
# ----------------------------

print("="*60)
print("DATASET INFORMATION")
print("="*60)

print(df.info())

print("\n")

# ----------------------------
# First Five Rows
# ----------------------------

print("="*60)
print("FIRST FIVE ROWS")
print("="*60)

print(df.head())

# ----------------------------
# Missing Values
# ----------------------------

print("="*60)
print("MISSING VALUES")
print("="*60)

print(df.isnull().sum())

# ----------------------------
# Summary Statistics
# ----------------------------

print("="*60)
print("SUMMARY STATISTICS")
print("="*60)

print(df.describe())

# ----------------------------
# Create Output Folder
# ----------------------------

output_folder = "EDA_Output"

os.makedirs(output_folder, exist_ok=True)

# ----------------------------
# Find pH Columns
# ----------------------------

ph_columns = [col for col in df.columns if ("PH" in col.upper() or "SCB" in col.upper()) and col != "Average_pH"]

print("\nScrubber / pH Columns found:")
print(ph_columns)

# ----------------------------
# Plot pH Trends
# ----------------------------

if "Date" in df.columns:
    for col in ph_columns:
        safe_col = safe_filename(col)
        plt.figure(figsize=(12, 5))
        plt.plot(df["Date"], df[col])
        plt.title(f"{col} pH Trend")
        plt.xlabel("Date")
        plt.ylabel("pH")
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(f"{output_folder}/{safe_col}_Trend.png")
        plt.close()

# ----------------------------
# VOC Trends & Rolling Averages
# ----------------------------

voc_columns = [col for col in df.columns if "VOC" in col.upper() and not col.endswith("_Rolling") and not col.endswith("_Change")]

print("\nVOC Columns found:")
print(voc_columns)

if "Date" in df.columns:
    for col in voc_columns:
        safe_col = safe_filename(col)
        
        # Line plot for VOC Trend
        plt.figure(figsize=(12, 5))
        plt.plot(df["Date"], df[col], label=col, color='teal')
        plt.title(f"{col} Trend")
        plt.xlabel("Date")
        plt.ylabel(col)
        plt.grid(True)
        plt.tight_layout()
        plt.savefig(f"{output_folder}/{safe_col}_Trend.png")
        plt.close()

        # Rolling Average VOC
        rolling_col = f"{col}_Rolling"
        df[rolling_col] = df[col].rolling(window=7, min_periods=1).mean()

        plt.figure(figsize=(12, 5))
        plt.plot(df["Date"], df[col], label=f"Raw {col}", alpha=0.5)
        plt.plot(df["Date"], df[rolling_col], label=f"7-Day Avg {col}", color='darkorange', linewidth=2)
        plt.legend()
        plt.grid(True)
        plt.title(f"{col} 7-Day Rolling Average")
        plt.xlabel("Date")
        plt.ylabel(col)
        plt.tight_layout()
        plt.savefig(f"{output_folder}/{safe_col}_Rolling.png")
        plt.close()

        # Daily VOC Change
        change_col = f"{col}_Change"
        df[change_col] = df[col].diff()

# ----------------------------
# Average pH
# ----------------------------

if len(ph_columns) > 0:
    df["Average_pH"] = df[ph_columns].mean(axis=1)

# ----------------------------
# Histograms & Boxplots
# ----------------------------

numeric_columns = df.select_dtypes(include="number").columns
# Exclude Sl No., Year, Month, Day from individual plots to focus on sensors
sensor_numeric_cols = [c for c in numeric_columns if c not in ["Sl No.", "Year", "Month", "Day"]]

for col in sensor_numeric_cols:
    safe_col = safe_filename(col)
    
    # Histogram
    plt.figure(figsize=(6, 4))
    df[col].dropna().hist(bins=20, color='skyblue', edgecolor='black')
    plt.title(f"{col} Distribution")
    plt.xlabel(col)
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.savefig(f"{output_folder}/{safe_col}_Histogram.png")
    plt.close()

    # Boxplot
    plt.figure(figsize=(4, 6))
    plt.boxplot(df[col].dropna())
    plt.title(col)
    plt.tight_layout()
    plt.savefig(f"{output_folder}/{safe_col}_Boxplot.png")
    plt.close()

# ----------------------------
# Correlation Heatmap
# ----------------------------

if len(sensor_numeric_cols) > 1:
    corr = df[sensor_numeric_cols].corr()

    plt.figure(figsize=(14, 12))
    sns.heatmap(corr,
                annot=True,
                fmt=".2f",
                cmap="coolwarm",
                linewidths=0.5,
                annot_kws={"size": 8})

    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(f"{output_folder}/Correlation_Heatmap.png")
    plt.close()

# ----------------------------
# Save Processed Dataset
# ----------------------------

try:
    df.to_csv(f"{output_folder}/EDA_Data.csv", index=False)
except PermissionError:
    df.to_csv(f"{output_folder}/EDA_Data_updated.csv", index=False)
    print(f"Warning: 'EDA_Data.csv' is open in another program. Saved to '{output_folder}/EDA_Data_updated.csv'.")

# ----------------------------
# Save Summary Report
# ----------------------------

summary = df.describe(include="all")
try:
    summary.to_csv(f"{output_folder}/Summary_Report.csv")
except PermissionError:
    summary.to_csv(f"{output_folder}/Summary_Report_updated.csv")
    print(f"Warning: 'Summary_Report.csv' is open in another program. Saved to '{output_folder}/Summary_Report_updated.csv'.")

print("\n")
print("="*60)
print("EDA COMPLETED SUCCESSFULLY")
print("="*60)
print("Outputs Saved Inside : EDA_Output")

print("""
Generated Files inside EDA_Output:

1. Summary_Report.csv
2. EDA_Data.csv
3. pH Trend Charts (for each scrubber)
4. VOC Trend & Rolling Average Charts
5. Histograms & Boxplots
6. Correlation Heatmap
""")