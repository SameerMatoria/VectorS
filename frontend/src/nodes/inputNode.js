// inputNode.js
import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  return (
    <BaseNode
      title="Input"
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
      style={{ minWidth: 220 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label>
          Name:
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            style={{ marginLeft: 6 }}
          />
        </label>

        <label>
          Type:
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            style={{ marginLeft: 6 }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
