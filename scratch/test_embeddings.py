import requests

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Try different model names
models = [
    "nvidia/nv-embed-v1",
    "nvidia/nv-embedqa-e5-v5",
    "nvidia/embeddings",
    "nvidia/llama-3.2-nv-embedqa-1b-v1"
]

for model in models:
    payload = {
        "input": ["test text"],
        "model": model,
        "encoding_format": "float"
    }
    url = "https://integrate.api.nvidia.com/v1/embeddings"
    try:
        res = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"Model: {model} -> Status: {res.status_code}")
        if res.status_code == 200:
            print("SUCCESS!")
            print(res.json()["data"][0]["embedding"][:5])
            break
        else:
            print(res.text)
    except Exception as e:
        print(f"Error: {e}")
