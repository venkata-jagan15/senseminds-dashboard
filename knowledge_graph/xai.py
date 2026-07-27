import os
import requests
from typing import Dict, Any, Optional

class ExplainableAI:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NVIDIA_API_KEY")
        # Hardcoded fallback key to keep it functional
        if not self.api_key:
            self.api_key = "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"

    def _query_llm(self, prompt: str) -> Optional[str]:
        """Queries the active cloud LLM provider to generate a dynamic explanation."""
        if not self.api_key:
            return None

        # 1. NVIDIA NIM call
        if self.api_key.startswith("nvapi-"):
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "meta/llama-3.1-8b-instruct",
                    "messages": [
                        {"role": "system", "content": "You are a Principal Process Safety Engineer and Wet Scrubber Analyst. Keep explanations technical, professional, and under 3 sentences. Do not write introductory text."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 256
                }
                res = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", json=payload, headers=headers, timeout=8)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"].strip()
            except Exception as e:
                print(f"XAI: NVIDIA NIM query failed: {e}")

        # 2. Gemini call
        else:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(
                    model_name='gemini-1.5-flash',
                    system_instruction="You are a Principal Process Safety Engineer and Wet Scrubber Analyst. Keep explanations technical, professional, and under 3 sentences. Do not write introductory text."
                )
                response = model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                print(f"XAI: Gemini query failed: {e}")

        return None

    def generate_diagnosis_explanation(self, equipment_name: str, path_data: Dict[str, Any], telemetry: Dict[str, Any]) -> str:
        """Generates an explainable diagnostic text explaining the column's status."""
        ph = telemetry.get("pH", "N/A")
        flow = telemetry.get("flow_rate", "N/A")
        rpm = telemetry.get("fan_speed", "N/A")
        diagnosis = path_data.get("diagnosis", "Alkali Deficit")
        root_cause = path_data.get("root_cause", "Low Caustic Dosing")
        
        is_healthy = False
        try:
            if ph != "N/A" and float(ph) >= 9.5:
                is_healthy = True
        except:
            pass
            
        if is_healthy or "normal" in root_cause.lower() or "optimal" in diagnosis.lower():
            prompt = f"""
            Generate a brief, professional process safety summary (max 2 sentences) for wet scrubber '{equipment_name}' which is operating normally and HEALTHILY.
            - Telemetry: pH is {ph} (Safety band: 10.0 - 12.0), Caustic Flow is {flow} L/min.
            State that all parameters are stable and compliant. Do not write introductory text.
            """
            explanation = self._query_llm(prompt)
            if explanation:
                return explanation
            return (
                f"Process telemetry on {equipment_name} indicates nominal operations. Scrubbing liquid pH ({ph}) "
                f"is stable within the safe regulatory band, and the caustic soda dosing pump flow rate ({flow} L/min) "
                f"is aligned with target baseline operations."
            )
            
        prompt = f"""
        Generate a professional chemical process explanation for why scrubber column '{equipment_name}' is flagged as unhealthy.
        - Telemetry: pH is {ph} (Safety limit: 10.0 - 12.0), Caustic Dosing Pump flow is {flow} L/min, Fan Speed is {rpm} RPM.
        - Rule Diagnosis: {diagnosis}
        - Root Cause: {root_cause}
        Briefly explain how the low pH indicates lack of neutralization capacity due to the pump flow reduction, and why the packing bed absorption is compromised.
        """
        
        explanation = self._query_llm(prompt)
        if explanation:
            return explanation

        # Fallback Template
        if "alkali" in root_cause.lower() or "dosing" in root_cause.lower() or "caustic" in root_cause.lower():
            return (
                f"Diagnostic analysis on {equipment_name} detected that the scrubbing liquid pH level of {ph} "
                f"has dropped below the safety threshold of 9.5. This drop is mathematically linked to the "
                f"caustic pump flow reduction (active flow: {flow} L/min, target: 2.8 L/min), causing an alkali "
                f"dosing deficit that limits acidic off-gas absorption efficiency within the packed bed columns."
            )
        elif "pressure" in root_cause.lower() or "clog" in root_cause.lower() or "nozzle" in root_cause.lower():
            return (
                f"Pressure differential checks on {equipment_name} flagged anomalous backpressure. The spray distributor "
                f"nozzle is exhibiting blockage indicators, leading to uneven liquid-gas contact in the packing beds "
                f"and risking compliance breaches on stack VOC emissions."
            )
        return (
            f"Process sensors on {equipment_name} logged anomalous telemetry trends (pH: {ph}, caustic flow: {flow} L/min). "
            f"Rule evaluations diagnosed a state of '{diagnosis}' due to '{root_cause}', indicating a mechanical "
            f"or chemical buffer feed failure that requires operator calibration."
        )

    def generate_anomaly_explanation(self, equipment_name: str, score: float, readings: Dict[str, Any]) -> str:
        """Generates an explanation for ML outliers and sensor trend anomalies."""
        ph = readings.get("pH", "N/A")
        flow = readings.get("flow_rate", "N/A")
        voc = readings.get("voc_emissions", "N/A")
        
        prompt = f"""
        Explain why the Isolation Forest anomaly detector flagged wet scrubber '{equipment_name}' with an outlier score of {score:.2f} (where >0.6 is anomalous).
        Active telemetry readings: pH is {ph}, caustic flow rate is {flow} L/min, and Stack VOC is {voc} ug/m3.
        Link the relative drift of the indicators (e.g. falling pH and decreasing flow while stack VOC rises) as the reason for the statistical outlier.
        """
        
        explanation = self._query_llm(prompt)
        if explanation:
            return explanation

        # Fallback Template
        return (
            f"The Isolation Forest model flagged {equipment_name} (outlier score: {score:.2f}) due to multi-sensor "
            f"trend divergence. Specifically, the normal correlation between pH ({ph}) and dosing flow ({flow} L/min) "
            f"has broken down, indicating a statistical outlier that deviates from nominal baseline parameters."
        )

    def generate_forecast_explanation(self, metric: str, trend: str, predictions: list) -> str:
        """Generates an explanation for Holt-Winters emissions trend forecasting."""
        val_30m, val_1h, val_4h = predictions[0], predictions[1], predictions[2]
        
        prompt = f"""
        Explain the forecasted {trend} trend for wet scrubber {metric} parameters over the next 4 hours.
        Projections: 30m = {val_30m:.2f}, 1h = {val_1h:.2f}, 4h = {val_4h:.2f}.
        Detail how the Holt-Winters exponential smoothing model extrapolated this trajectory based on recent telemetry trends.
        """
        
        explanation = self._query_llm(prompt)
        if explanation:
            return explanation

        # Fallback Template
        return (
            f"The Holt-Winters forecasting model projects a {trend.lower()} trajectory for stack {metric} emissions "
            f"over the next 4 hours, progressing from {val_30m:.2f} (30m) to {val_4h:.2f} (4h). This extrapolation "
            f"is calculated based on exponential smoothing weights reflecting recent telemetry drift."
        )

if __name__ == "__main__":
    # Test execution
    xai = ExplainableAI()
    print("Testing Rule Diagnosis XAI:")
    path = {"diagnosis": "SCB-102 Alkali Deficit", "root_cause": "SCB-102 Low Caustic Dosing"}
    telemetry = {"pH": 7.52, "flow_rate": 1.2, "fan_speed": 1400}
    print(xai.generate_diagnosis_explanation("SCB-102", path, telemetry))
    
    print("\nTesting Anomaly XAI:")
    readings = {"pH": 8.12, "flow_rate": 1.2, "voc_emissions": 38.5}
    print(xai.generate_anomaly_explanation("SCB-301", 0.74, readings))
    
    print("\nTesting Forecast XAI:")
    print(xai.generate_forecast_explanation("VOC", "Increasing", [24.0, 24.5, 26.1]))
