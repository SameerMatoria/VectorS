import { useEffect, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  // Ensure initial values are written into the store
  useEffect(() => {
    updateNodeField(id, "inputName", currName);
    updateNodeField(id, "inputType", inputType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNameChange = (val) => {
    setCurrName(val);
    updateNodeField(id, "inputName", val);
  };

  const onTypeChange = (val) => {
    setInputType(val);
    updateNodeField(id, "inputType", val);
  };

  return (
    <BaseNode
      title="Input"
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
      style={{ minWidth: 220 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ minWidth: 50 }}>Name:</span>
          <input
            type="text"
            value={currName}
            onChange={(e) => onNameChange(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "6px 8px",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.95)",
            }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ minWidth: 50 }}>Type:</span>
          <select
            value={inputType}
            onChange={(e) => onTypeChange(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "6px 8px",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
