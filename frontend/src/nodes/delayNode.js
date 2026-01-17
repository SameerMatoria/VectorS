import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const DelayNode = ({ id, data }) => {
  const [ms, setMs] = useState(data?.ms ?? 500);

  return (
    <BaseNode
      title="Delay"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in` },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <label>
        Delay (ms):
        <input
          type="number"
          value={ms}
          onChange={(e) => setMs(Number(e.target.value))}
          style={{ marginLeft: 6, width: 90 }}
        />
      </label>
    </BaseNode>
  );
};
