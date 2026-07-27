import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from knowledge_graph.api import router as graph_router

app = FastAPI(
    title="SenseMinds Environmental Intelligence API",
    description="Backend API services supporting Scrubber CEMS telemetry, Rule Engine diagnostics, and Knowledge Graph traversal.",
    version="5.0"
)

# Enable CORS for React Frontend dashboard connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Knowledge Graph API endpoints
app.include_router(graph_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SenseMinds CEMS Backend",
        "version": "5.0"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    reload_mode = os.getenv("RELOAD", "false").lower() == "true"
    print(f"Starting server on http://localhost:{port} (reload={reload_mode})")
    uvicorn.run(
        "backend.app:app", 
        host="0.0.0.0", 
        port=port, 
        reload=reload_mode, 
        reload_dirs=["backend", "knowledge_graph"] if reload_mode else None
    )
