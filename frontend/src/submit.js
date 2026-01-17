import { useStore } from "./store";

export const SubmitButton = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const onSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/pipeline/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Backend error: ${res.status}\n${txt}`);
        return;
      }

      const data = await res.json();
      alert(
        `Pipeline Parsed ✅\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nDAG: ${data.is_dag}`
      );
    } catch (e) {
      alert(`Request failed: ${e.message}`);
    }
  };

  return (
    <div className="submitBar">
      <button className="primaryBtn" type="button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};
