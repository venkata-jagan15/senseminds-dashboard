import os
import pandas as pd
import json

def main():
    xlsx_path = "c:\\Users\\Nartu Sindhusri\\OneDrive\\Desktop\\VOC\\Unit 1 Scrubbers & VOC six months data (1).xlsx"
    if not os.path.exists(xlsx_path):
        print(f"Error: file not found at {xlsx_path}")
        return

    xl = pd.ExcelFile(xlsx_path)
    sheets_info = {}
    
    for name in xl.sheet_names:
        df = xl.parse(name)
        sheets_info[name] = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "head": df.head(10).to_dict(orient="records"),
            "null_counts": df.isnull().sum().to_dict(),
            "types": df.dtypes.astype(str).to_dict()
        }
        
    with open("c:\\Users\\Nartu Sindhusri\\OneDrive\\Desktop\\VOC\\xlsx_info.json", "w") as f:
        json.dump(sheets_info, f, indent=2, default=str)
        
    print("Done writing xlsx_info.json!")

if __name__ == "__main__":
    main()
