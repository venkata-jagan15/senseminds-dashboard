import os
import json
import requests
import numpy as np
from typing import List, Dict, Any, Optional

SOP_MANUAL_PATH = os.path.join(os.path.dirname(__file__), "scrubber_sop_manual.txt")
CACHE_EMBEDDINGS_PATH = os.path.join(os.path.dirname(__file__), "rag_embeddings.json")

class SimpleRAG:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NVIDIA_API_KEY")
        # Hardcoded fallback key from api.py to keep it functional
        if not self.api_key:
            self.api_key = "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"
            
        self.chunks_cache: List[Dict[str, Any]] = []
        self.is_ready = False

    def load_and_initialize(self):
        """Loads and indexes the document corpus. Uses cache if available."""
        if not os.path.exists(SOP_MANUAL_PATH):
            print(f"RAG: Scrubber SOP Manual file not found at {SOP_MANUAL_PATH}")
            return
            
        # Check if cache is valid (compare modification times)
        sop_mtime = os.path.getmtime(SOP_MANUAL_PATH)
        cache_exists = os.path.exists(CACHE_EMBEDDINGS_PATH)
        
        if cache_exists:
            cache_mtime = os.path.getmtime(CACHE_EMBEDDINGS_PATH)
            if cache_mtime > sop_mtime:
                try:
                    with open(CACHE_EMBEDDINGS_PATH, "r", encoding="utf-8") as f:
                        self.chunks_cache = json.load(f)
                    self.is_ready = True
                    print(f"RAG: Loaded {len(self.chunks_cache)} embedded document chunks from cache.")
                    return
                except Exception as e:
                    print(f"RAG: Error reading cache file: {e}. Re-indexing manual...")

        # Parse SOP manual into chunks
        print("RAG: Parsing Scrubber SOP Manual into chunks...")
        with open(SOP_MANUAL_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Split chunks by double-newlines
        raw_chunks = [c.strip() for c in content.split("\n\n") if len(c.strip()) > 30]
        
        # Filter markdown header indicators out of small headings if needed, keeping context clear
        self.chunks_cache = []
        for chunk in raw_chunks:
            embedding = self._get_embedding(chunk)
            if embedding:
                self.chunks_cache.append({
                    "text": chunk,
                    "embedding": embedding
                })

        if self.chunks_cache:
            try:
                with open(CACHE_EMBEDDINGS_PATH, "w", encoding="utf-8") as f:
                    json.dump(self.chunks_cache, f, ensure_ascii=False, indent=2)
                self.is_ready = True
                print(f"RAG: Successfully indexed and cached {len(self.chunks_cache)} document chunks.")
            except Exception as e:
                print(f"RAG: Error saving cache file: {e}")

    def _get_embedding(self, text: str) -> Optional[List[float]]:
        """Generates embedding using the configured cloud LLM provider API."""
        if not self.api_key:
            return None

        # 1. NVIDIA NIM Embedding API Call (Standard OpenAI-compatible Embeddings)
        if self.api_key.startswith("nvapi-"):
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "input": [text],
                    "model": "nvidia/nv-embed-v1",
                    "encoding_format": "float",
                    "input_type": "passage"
                }
                res = requests.post(
                    "https://integrate.api.nvidia.com/v1/embeddings", 
                    json=payload, 
                    headers=headers,
                    timeout=10
                )
                if res.status_code == 200:
                    return res.json()["data"][0]["embedding"]
                else:
                    print(f"RAG: NVIDIA NIM Embedding API returned status {res.status_code}: {res.text}")
            except Exception as e:
                print(f"RAG: Error fetching NIM embedding: {e}")

        # 2. Google Gemini Embedding API Call
        else:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                # Use retrieval task type for optimal semantic document retrieval
                response = genai.embed_content(
                    model="models/text-embedding-004",
                    content=text,
                    task_type="retrieval_document"
                )
                return response["embedding"]
            except Exception as e:
                print(f"RAG: Error fetching Gemini embedding: {e}")
                
        return None

    def _get_query_embedding(self, query: str) -> Optional[List[float]]:
        """Generates query embedding, using retrieval_query task type if using Gemini."""
        if not self.api_key:
            return None

        if self.api_key.startswith("nvapi-"):
            try:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "input": [query],
                    "model": "nvidia/nv-embed-v1",
                    "encoding_format": "float",
                    "input_type": "query"
                }
                res = requests.post(
                    "https://integrate.api.nvidia.com/v1/embeddings", 
                    json=payload, 
                    headers=headers,
                    timeout=10
                )
                if res.status_code == 200:
                    return res.json()["data"][0]["embedding"]
                else:
                    print(f"RAG: NVIDIA NIM Embedding API returned status {res.status_code}: {res.text}")
            except Exception as e:
                print(f"RAG: Error fetching NIM query embedding: {e}")
        else:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                response = genai.embed_content(
                    model="models/text-embedding-004",
                    content=query,
                    task_type="retrieval_query"
                )
                return response["embedding"]
            except Exception as e:
                print(f"RAG: Error fetching query embedding: {e}")
                
        return None

    def search_similar(self, query: str, top_k: int = 3) -> List[str]:
        """Runs cosine similarity matching to return the top-K relevant chunks."""
        if not self.is_ready or not self.chunks_cache:
            print("RAG: SimpleRAG is not initialized or document cache is empty.")
            return []
            
        query_embedding = self._get_query_embedding(query)
        if not query_embedding:
            print("RAG: Failed to generate query embedding. Returning empty context.")
            return []
            
        q_vec = np.array(query_embedding)
        norm_q = np.linalg.norm(q_vec)
        
        if norm_q == 0:
            return []

        results = []
        for chunk in self.chunks_cache:
            c_vec = np.array(chunk["embedding"])
            norm_c = np.linalg.norm(c_vec)
            if norm_c == 0:
                continue
                
            similarity = float(np.dot(q_vec, c_vec) / (norm_q * norm_c))
            results.append((similarity, chunk["text"]))
            
        # Sort by similarity score descending
        results.sort(key=lambda x: x[0], reverse=True)
        
        # Extract the texts of the top-k chunks
        top_chunks = [text for score, text in results[:top_k]]
        return top_chunks

if __name__ == "__main__":
    # Test execution
    rag = SimpleRAG()
    rag.load_and_initialize()
    if rag.is_ready:
        print("\nTesting Semantic Similarity Search...")
        test_query = "What is the flow rate for SCB-301 during chlorine spikes?"
        matches = rag.search_similar(test_query, top_k=2)
        print(f"Query: '{test_query}'")
        for i, match in enumerate(matches):
            print(f"\nMatch {i+1}:\n{match}")
