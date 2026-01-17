import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const ConditionNode = ({ id, data }) => {
  const [expr, setExpr] = useState(data?.expr || "x > 0");

  return (
    <BaseNode
      title="Condition"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in` },
        { type: "source", position: Position.Right, id: `${id}-true`, style: { top: "35%" } },
        { type: "source", position: Position.Right, id: `${id}-false`, style: { top: "75%" } },
      ]}
      style={{ minWidth: 240 }}
    >
      <label>
        Expression:
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          style={{ marginLeft: 6, width: "100%" }}
        />
      </label>
    </BaseNode>
  );
};
