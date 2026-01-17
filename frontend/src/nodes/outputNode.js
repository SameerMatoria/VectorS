// outputNode.js
import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <BaseNode
      title="Output"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-value` },
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
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            style={{ marginLeft: 6 }}
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
