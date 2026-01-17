import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MergeNode = ({ id }) => {
  return (
    <BaseNode
      title="Merge"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in1`, style: { top: "35%" } },
        { type: "target", position: Position.Left, id: `${id}-in2`, style: { top: "70%" } },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <div>Combines two inputs into one.</div>
    </BaseNode>
  );
};
