from fastapi import FastAPI, Form

from typing import List, Dict, Any
from fastapi import Body
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.get('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    return {'status': 'parsed'}


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

def is_dag(nodes, edges):
    # Kahn's algorithm for cycle detection
    node_ids = [n["id"] for n in nodes]
    indeg = {nid: 0 for nid in node_ids}
    graph = {nid: [] for nid in node_ids}

    for e in edges:
        src = e["source"]
        tgt = e["target"]
        if src in graph and tgt in indeg:
            graph[src].append(tgt)
            indeg[tgt] += 1

    q = [nid for nid in node_ids if indeg[nid] == 0]
    visited = 0

    while q:
        cur = q.pop()
        visited += 1
        for nxt in graph[cur]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)

    return visited == len(node_ids)

@app.post("/pipeline/parse")
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges
    return {
        "num_nodes": len(nodes),
        "num_edges": len(edges),
        "is_dag": is_dag(nodes, edges),
    }