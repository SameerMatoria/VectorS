import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MathNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.op || "+");

  return (
    <BaseNode
      title="Math"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-a`, style: { top: "30%" } },
        { type: "target", position: Position.Left, id: `${id}-b`, style: { top: "70%" } },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div>Op:</div>
        <select value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
      </div>
    </BaseNode>
  );
};
