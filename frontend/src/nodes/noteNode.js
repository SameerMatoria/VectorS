import { useState } from "react";
import { BaseNode } from "./BaseNode";

export const NoteNode = ({ data }) => {
  const [note, setNote] = useState(data?.note || "Write a note...");

  return (
    <BaseNode
      title="Note"
      handles={[]}
      style={{ background: "#fff8c5", border: "1px solid #d6c35a" }}
    >
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        style={{ width: "100%", resize: "vertical" }}
      />
    </BaseNode>
  );
};
