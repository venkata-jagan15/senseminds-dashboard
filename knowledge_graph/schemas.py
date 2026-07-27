from typing import Dict, List, Any, Optional
from pydantic import BaseModel, ConfigDict

# config dict configuration allows SQLAlchemy model conversion
class NodeBase(BaseModel):
    name: str
    type: str
    properties: Optional[Dict[str, Any]] = None

class NodeCreate(NodeBase):
    pass

class NodeResponse(NodeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class RelationshipBase(BaseModel):
    source_id: int
    target_id: int
    type: str
    properties: Optional[Dict[str, Any]] = None

class RelationshipCreate(RelationshipBase):
    pass

class RelationshipResponse(RelationshipBase):
    id: int
    source_name: Optional[str] = None
    target_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class GraphResponse(BaseModel):
    nodes: List[NodeResponse]
    relationships: List[RelationshipResponse]

class QueryExplainResponse(BaseModel):
    equipment_name: str
    health_score: Optional[float] = None
    status: str
    path: List[Dict[str, Any]] # traversal path
    recommendations: List[str]
    explanation: Optional[str] = None
