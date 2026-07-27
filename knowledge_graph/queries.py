from typing import List, Dict, Any, Optional
from .graph import SessionLocal, Neo4jNodeMock

class GraphQueryEngine:
    def __init__(self, db_session):
        self.db = db_session

    def search_nodes(self, query_str: str) -> List[Neo4jNodeMock]:
        """Search nodes matching query string in their name."""
        query = "MATCH (n:Node) WHERE n.name CONTAINS $query RETURN id(n) as id, properties(n) as properties"
        result = self.db.run(query, query=query_str)
        return [Neo4jNodeMock(rec["id"], rec["properties"]) for rec in result]

    def get_equipment_findings(self, equipment_name: str) -> List[Neo4jNodeMock]:
        """Traverses Scrubber -> Sensor -> Finding nodes."""
        query = """
        MATCH (e:Equipment {name: $name})-[:HAS_SENSOR]->(s:Sensor)-[:GENERATES]->(f:Finding)
        RETURN id(f) as id, properties(f) as properties
        """
        result = self.db.run(query, name=equipment_name)
        return [Neo4jNodeMock(rec["id"], rec["properties"]) for rec in result]

    def why_is_equipment_unhealthy(self, equipment_name: str) -> Dict[str, Any]:
        """Traverses Equipment -> Sensor -> Finding -> Diagnosis -> Root Cause -> Recommendation."""
        result = {
            "equipment_name": equipment_name,
            "status": "Healthy",
            "health_score": 100,
            "path": [],
            "recommendations": []
        }
        
        # Check if Equipment node exists
        check_query = "MATCH (e:Equipment {name: $name}) RETURN id(e) as id"
        check_res = self.db.run(check_query, name=equipment_name)
        if not check_res.peek():
            result["status"] = "Unknown Equipment"
            return result
            
        # Find Health Node Score
        health_query = "MATCH (e:Equipment {name: $name})-[:HAS_HEALTH]->(h:Health) RETURN h.score as score"
        health_res = self.db.run(health_query, name=equipment_name)
        h_rec = health_res.single()
        if h_rec and h_rec["score"] is not None:
            score = h_rec["score"]
            result["health_score"] = score
            if score < 90:
                result["status"] = "Warning"
            if score < 75:
                result["status"] = "Critical"
                
        # Traverse finding path for Warning/Critical findings
        path_query = """
        MATCH (e:Equipment {name: $name})-[:HAS_SENSOR]->(s:Sensor)-[:GENERATES]->(f:Finding)-[:CAUSES]->(d:Diagnosis)-[:HAS_ROOT_CAUSE]->(c:RootCause)-[:HAS_RECOMMENDATION]->(rec:Recommendation)
        WHERE f.severity IN ["Warning", "Critical"]
        RETURN f.name as finding, d.name as diagnosis, c.name as root_cause, rec.name as recommendation, rec.action as action
        """
        path_res = self.db.run(path_query, name=equipment_name)
        for rec in path_res:
            result["path"].append({
                "finding": rec["finding"],
                "diagnosis": rec["diagnosis"],
                "root_cause": rec["root_cause"],
                "recommendation": rec["recommendation"]
            })
            action_desc = rec["action"] or rec["recommendation"]
            if action_desc not in result["recommendations"]:
                result["recommendations"].append(action_desc)
                
        return result

if __name__ == "__main__":
    try:
        db = SessionLocal()
        engine = GraphQueryEngine(db)
        # Test trace query for SCB-302
        trace = engine.why_is_equipment_unhealthy("SCB-302")
        print("\n--- Neo4j Telemetry Diagnostic Trace for SCB-302 ---")
        print(f"Status: {trace['status']}")
        print(f"Health Score: {trace['health_score']}%")
        for step in trace["path"]:
            print(f"Finding: {step['finding']}")
            print(f"  ➔ Diagnosis: {step['diagnosis']}")
            print(f"  ➔ Root Cause: {step['root_cause']}")
            print(f"  ➔ Recommendation: {step['recommendation']}")
        db.close()
    except Exception as e:
        print(f"Query test exception (expected if Neo4j is offline): {e}")
