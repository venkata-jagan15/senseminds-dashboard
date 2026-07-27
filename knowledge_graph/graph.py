import os
import json
from typing import Dict, List, Any, Optional
from neo4j import GraphDatabase

# Neo4j connection configuration
NEO4J_URI = os.getenv("NEO4J_URI", "neo4j+s://82bc2be3.databases.neo4j.io")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "juP9heBw0mL-o7ldAEM73mNSooE5LhUFRzvM84FQywk")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

class Neo4jSessionWrapper:
    """Wrapper to maintain compatibility with SQLAlchemy-style context manager and commit/rollback calls."""
    def __init__(self, session):
        self._session = session
        self._tx = None

    def run(self, *args, **kwargs):
        if self._tx:
            return self._tx.run(*args, **kwargs)
        return self._session.run(*args, **kwargs)

    def execute_write(self, *args, **kwargs):
        return self._session.execute_write(*args, **kwargs)

    def execute_read(self, *args, **kwargs):
        return self._session.execute_read(*args, **kwargs)

    def begin_transaction(self):
        if not self._tx:
            self._tx = self._session.begin_transaction()
        return self._tx

    def commit(self):
        if self._tx:
            self._tx.commit()
            self._tx = None

    def rollback(self):
        if self._tx:
            self._tx.rollback()
            self._tx = None

    def close(self):
        if self._tx:
            try:
                self._tx.close()
            except Exception:
                pass
            self._tx = None
        self._session.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()
        else:
            self.commit()
        self.close()

def SessionLocal():
    return Neo4jSessionWrapper(driver.session())

def init_db():
    """Initializes indexes and constraints in Neo4j."""
    with driver.session() as session:
        try:
            # Create a unique constraint on node name
            session.run("CREATE CONSTRAINT node_name_unique FOR (n:Node) REQUIRE n.name IS UNIQUE")
            print("Successfully initialized unique constraint for Node.name")
        except Exception as e:
            # Constraint may already exist or fail depending on Neo4j version
            print(f"Index/Constraint initialization note: {e}")

class Neo4jNodeMock:
    """Mock Node class matching original SQLAlchemy Node model attributes."""
    def __init__(self, record_node_id: int, properties: dict):
        self.id = record_node_id
        self.properties = properties
        self.name = properties.get("name")
        self.type = properties.get("type", "Node")

    def __repr__(self):
        return f"<Node(name='{self.name}', type='{self.type}')>"

class Neo4jRelMock:
    """Mock Relationship class matching original SQLAlchemy Relationship model attributes."""
    def __init__(self, rel_id: int, source_id: int, target_id: int, rel_type: str, properties: dict):
        self.id = rel_id
        self.source_id = source_id
        self.target_id = target_id
        self.type = rel_type
        self.properties = properties

    def __repr__(self):
        return f"<Relationship(source_id={self.source_id}, target_id={self.target_id}, type='{self.type}')>"

class GraphManager:
    def __init__(self, db_session):
        self.db = db_session

    def add_node(self, name: str, node_type: str, properties: Optional[Dict[str, Any]] = None) -> Neo4jNodeMock:
        """Finds or creates a node by name. If it exists, merges properties."""
        safe_label = "".join([c for c in node_type if c.isalnum() or c == '_'])
        props = dict(properties or {})
        props["type"] = node_type
        props["name"] = name

        query = f"""
        MERGE (n:Node {{name: $name}})
        SET n:{safe_label}
        SET n += $props
        RETURN id(n) as id, properties(n) as properties
        """
        result = self.db.run(query, name=name, props=props)
        record = result.single()
        return Neo4jNodeMock(record["id"], record["properties"])

    def find_node(self, name: str) -> Optional[Neo4jNodeMock]:
        """Finds a node by name."""
        query = "MATCH (n:Node {name: $name}) RETURN id(n) as id, properties(n) as properties"
        result = self.db.run(query, name=name)
        record = result.single()
        if not record:
            return None
        return Neo4jNodeMock(record["id"], record["properties"])

    def update_node(self, name: str, properties: Dict[str, Any]) -> Optional[Neo4jNodeMock]:
        """Updates a node's metadata properties."""
        query = "MATCH (n:Node {name: $name}) SET n += $properties RETURN id(n) as id, properties(n) as properties"
        result = self.db.run(query, name=name, properties=properties)
        record = result.single()
        if not record:
            return None
        return Neo4jNodeMock(record["id"], record["properties"])

    def add_relationship(self, source_name: str, target_name: str, rel_type: str, properties: Optional[Dict[str, Any]] = None) -> Neo4jRelMock:
        """Connects source and target nodes by name, creating them if needed."""
        # Note: source_node and target_node are automatically merged if they don't exist
        safe_rel = "".join([c for c in rel_type if c.isalnum() or c == '_'])
        props = properties or {}

        query = f"""
        MERGE (s:Node {{name: $source_name}})
        MERGE (t:Node {{name: $target_name}})
        MERGE (s)-[r:{safe_rel}]->(t)
        SET r += $props
        RETURN id(r) as id, id(s) as source_id, id(t) as target_id, type(r) as type, properties(r) as properties
        """
        result = self.db.run(query, source_name=source_name, target_name=target_name, props=props)
        record = result.single()
        return Neo4jRelMock(
            record["id"], 
            record["source_id"], 
            record["target_id"], 
            record["type"], 
            record["properties"]
        )

    def remove_relationship(self, source_name: str, target_name: str, rel_type: str) -> bool:
        """Deletes a specific relationship between two nodes by name."""
        safe_rel = "".join([c for c in rel_type if c.isalnum() or c == '_'])
        query = f"""
        MATCH (s:Node {{name: $source_name}})-[r:{safe_rel}]->(t:Node {{name: $target_name}})
        DELETE r
        RETURN count(r) as deleted_count
        """
        result = self.db.run(query, source_name=source_name, target_name=target_name)
        record = result.single()
        return record["deleted_count"] > 0

    def remove_node(self, name: str) -> bool:
        """Deletes a node and any of its associated relationships (inbound and outbound)."""
        query = "MATCH (n:Node {name: $name}) DETACH DELETE n RETURN count(n) as deleted_count"
        result = self.db.run(query, name=name)
        record = result.single()
        return record["deleted_count"] > 0

    def export_json(self, filepath: str):
        """Exports all nodes and relationships to a JSON representation."""
        node_query = "MATCH (n:Node) RETURN id(n) as id, properties(n) as properties"
        node_result = self.db.run(node_query)
        nodes_list = []
        node_map = {}
        for record in node_result:
            nid = record["id"]
            props = record["properties"]
            name = props.get("name")
            ntype = props.get("type", "Node")
            node_map[nid] = name
            nodes_list.append({
                "id": nid,
                "name": name,
                "type": ntype,
                "properties": props
            })

        rel_query = "MATCH (s:Node)-[r]->(t:Node) RETURN id(r) as id, id(s) as source_id, id(t) as target_id, type(r) as type, properties(r) as properties"
        rel_result = self.db.run(rel_query)
        rels_list = []
        for record in rel_result:
            rels_list.append({
                "id": record["id"],
                "source": node_map.get(record["source_id"]),
                "target": node_map.get(record["target_id"]),
                "type": record["type"],
                "properties": record["properties"]
            })

        export_data = {
            "nodes": nodes_list,
            "relationships": rels_list
        }

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)

    def import_json(self, filepath: str):
        """Imports all nodes and relationships from a JSON file."""
        if not os.path.exists(filepath):
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            import_data = json.load(f)

        for node_data in import_data.get("nodes", []):
            self.add_node(
                name=node_data["name"],
                node_type=node_data["type"],
                properties=node_data.get("properties")
            )

        for rel_data in import_data.get("relationships", []):
            self.add_relationship(
                source_name=rel_data["source"],
                target_name=rel_data["target"],
                rel_type=rel_data["type"],
                properties=rel_data.get("properties")
            )
