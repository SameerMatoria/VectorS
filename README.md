# VectorShift Frontend Technical Assessment

This project implements a node-based workflow builder inspired by VectorShift.
Users can drag nodes onto a canvas, connect them to form pipelines, and submit the
pipeline to a backend service that validates structure and detects cycles (DAG).

The solution focuses on **clean abstractions**, **extensible node design**, and
**improved UX for text-based variable handling**.

---

## Tech Stack

### Frontend
- React
- ReactFlow
- Zustand (state management)
- CSS (custom dark / glass UI)

### Backend
- FastAPI
- Python
- DAG validation using topological sorting (Kahn’s algorithm)

---

## Project Structure

```text
frontend/
├── src/
│   ├── nodes/
│   │   ├── BaseNode.js
│   │   ├── inputNode.js
│   │   ├── outputNode.js
│   │   ├── llmNode.js
│   │   ├── textNode.js
│   │   ├── mathNode.js
│   │   ├── mergeNode.js
│   │   ├── conditionNode.js
│   │   ├── delayNode.js
│   │   └── noteNode.js
│   ├── store.js
│   ├── ui.js
│   ├── toolbar.js
│   ├── submit.js
│   └── index.css
backend/
└── main.py
```

---

## Task 1 — Node Abstraction (`BaseNode`)

### Problem
Each node initially duplicated:
- container styling
- title header
- handle rendering logic

This made adding new nodes error-prone and repetitive.

### Solution
A reusable `BaseNode` component was created.

### What `BaseNode` handles
- Consistent container UI
- Node title/header
- Handle positioning
- Layout and spacing
- Minimum width/height to prevent collapsing

### Benefits
- Eliminates duplication
- Makes new nodes trivial to add
- Ensures visual consistency across all node types

All nodes (Input, Output, LLM, Text, Math, Merge, Condition, Delay, Note) are built on top of `BaseNode`.

---

## Task 1 Continued — Adding 5 New Nodes

Five additional nodes were implemented to demonstrate extensibility:

| Node | Purpose |
|-----|--------|
| Math | Performs arithmetic on two inputs |
| Merge | Merges multiple inputs |
| Condition | Branching logic with two outputs |
| Delay | Introduces a delay step |
| Note | Informational / annotation node |

Each node:
- Uses `BaseNode`
- Defines its own handles and internal UI
- Is registered in `nodeTypes` so ReactFlow renders it correctly

---

## Task 2 — Styling Improvements

### Changes Made
- Introduced a dark, glass-style UI
- Centralized colors using CSS variables
- Fixed layout issues (`100wv → 100vw`)
- Ensured Submit button remains visible using CSS Grid
- Added minimum node height to prevent UI collapse

### Result
- Cleaner, professional UI
- Improved readability
- Consistent appearance across nodes

---

## Task 3 — Text Node Enhancements

### Auto Resize (Width + Height)

The Text node dynamically resizes as the user types.

**How it works**
- Height adapts using `scrollHeight`
- Width adapts by measuring text length via a canvas context
- Width is clamped to reasonable min/max values

**Benefit**
- Users can clearly see long prompts
- No hidden or clipped text

---

### `{{ }}` Variable Handling (Core Feature)

Users can reference upstream nodes inside the Text node using double curly braces:

```text
{{input_1}}
{{input_1.text}}
```

**Variable Parsing**
- Supports valid JavaScript identifiers
- Supports dot notation (`node.field`)
- Variables are extracted via regex

**Dynamic Handles**
- Each variable creates a left-side input handle
- Removing a variable removes its handle
- Handles are positioned evenly

**Alias Resolution (Important Detail)**
ReactFlow uses internal IDs like `customInput-1`, but users see and type `input_1`.

**Solution:**
- Input node names are persisted into global store (`data.inputName`)
- Text node resolves references against:
  - actual node IDs
  - user-facing aliases
- This makes the system intuitive and matches VectorShift behavior.

**Validation Rules (VectorShift-style)**
The Text node provides real-time feedback:

❌ **Error**
Variable references a node that is not connected.
*Example:* `{{input_1}}` but `input_1` is not connected.

⚠️ **Warning**
A node is connected but not referenced in text.

✅ **Valid**
All referenced variables are properly connected.

This prevents silent pipeline errors and improves UX.

---

## Task 4 — Pipeline Submission & DAG Validation

### Frontend
- Clicking **Submit** sends nodes + edges to backend
- Uses `fetch` to call `/pipeline/parse`

### Backend
- FastAPI endpoint receives pipeline data
- Counts:
  - number of nodes
  - number of edges
- Detects cycles using topological sort
- Returns:
```json
{
  "nodes": 3,
  "edges": 2,
  "is_dag": true
}
```

### Why Backend Validation?
- Prevents invalid pipelines
- Ensures correctness independent of UI
- Mirrors real production systems

---

## How to Run Locally

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend docs available at: `http://127.0.0.1:8000/docs`

---

## Final Result

- Reusable node abstraction
- 5 additional node types
- Clean, consistent UI
- Smart Text node with auto-resize + variables
- Alias-aware validation
- Backend DAG validation

---

## Design Philosophy

- **Maintainability first** (BaseNode abstraction)
- **User clarity** (auto-resize + validation)
- **Extensibility** (easy to add new nodes)
- **Correctness** (backend DAG checks)
