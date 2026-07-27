import pandas as pd
import numpy as np

# -----------------------------
# Step 1: Read Excel file
# -----------------------------
file = "Unit 1 Scrubbers & VOC six months data (1).xlsx"

# Skip the first 6 metadata rows
df = pd.read_excel(file, skiprows=6)

# -----------------------------
# Step 2: Remove empty rows
# -----------------------------
df.dropna(how='all', inplace=True)

# -----------------------------
# Step 3: Replace 'NA' with NaN
# -----------------------------
df.replace("NA", np.nan, inplace=True)

# -----------------------------
# Step 4: Remove duplicate rows
# -----------------------------
df.drop_duplicates(inplace=True)

# -----------------------------
# Step 5: Remove columns having all missing values
# -----------------------------
df.dropna(axis=1, how='all', inplace=True)

# -----------------------------
# Step 6: Remove extra spaces from column names
# -----------------------------
df.columns = df.columns.str.strip()

# -----------------------------
# Step 7: Rename important columns
# (Modify according to your dataset)
# -----------------------------
df.rename(columns={
    "FES_102_RM-pH - (pH) Raw": "FES102_pH",
    "Ambient-Ambient_VOC - (ug/m3) Raw": "Ambient_VOC",
    "Aaqms_2-VOC - (ug/m3) Raw": "AQMS2_VOC"
}, inplace=True)

# -----------------------------
# Step 8: Convert Date column
# -----------------------------
df["Time"] = pd.to_datetime(df["Time"], errors="coerce")

# -----------------------------
# Step 9: Convert numeric columns
# -----------------------------
for col in df.columns:
    if col != "Time":
        df[col] = pd.to_numeric(df[col], errors="coerce")

# -----------------------------
# Step 10: Remove invalid pH values
# -----------------------------
ph_columns = [col for col in df.columns if "pH" in col]

for col in ph_columns:
    df.loc[(df[col] < 0) | (df[col] > 14), col] = np.nan

# -----------------------------
# Step 11: Remove negative VOC values
# -----------------------------
voc_columns = [col for col in df.columns if "VOC" in col]

for col in voc_columns:
    df.loc[df[col] < 0, col] = np.nan

# -----------------------------
# Step 12: Fill missing values
# -----------------------------
df = df.ffill()

# -----------------------------
# Step 13: Create new date columns
# -----------------------------
df["Year"] = df["Time"].dt.year
df["Month"] = df["Time"].dt.month
df["Day"] = df["Time"].dt.day

# -----------------------------
# Step 14: Save cleaned file
# -----------------------------
df.to_csv("clean_data.csv", index=False)

try:
    df.to_excel("Laurus_Cleaned_Data.xlsx", index=False)
except PermissionError:
    print("Warning: Laurus_Cleaned_Data.xlsx is open in Excel; saved clean_data.csv successfully.")

print("Data cleaned successfully!")