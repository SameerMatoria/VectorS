// llmNode.js
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      title="LLM"
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-system`,
          style: { top: `${100 / 3}%` },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-prompt`,
          style: { top: `${200 / 3}%` },
        },
        { type: "source", position: Position.Right, id: `${id}-response` },
      ]}
    >
      <div>This is a LLM.</div>
    </BaseNode>
  );
};
