import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

// (keep existing variable extraction for now; we'll improve it in next step)
const extractVariables = (text) => {
  // Supports:
  //  - {{ var }}
  //  - {{ nodeId.output }}
  // Rules:
  //  - base identifier: [a-zA-Z_][a-zA-Z0-9_]*
  //  - optional dot segments: .[a-zA-Z_][a-zA-Z0-9_]*
  const re =
    /{{\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*}}/g;

  const vars = new Set();
  let match;

  while ((match = re.exec(text)) !== null) {
    vars.add(match[1]);
  }

  return Array.from(vars);
};


const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState(() =>
    extractVariables(data?.text || "{{input}}")
  );

  // Auto-resize state
  const [nodeWidth, setNodeWidth] = useState(260);
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);

  // Recompute variables whenever text changes (we'll enhance regex later)
  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  // Handles (unchanged for now)
  const handles = useMemo(() => {
    const incoming = variables.map((v, idx) => {
      const top =
        variables.length === 1
          ? "50%"
          : `${Math.round(((idx + 1) * 100) / (variables.length + 1))}%`;

      return {
        type: "target",
        position: Position.Left,
        id: `${id}-var-${v.replaceAll(".", "__")}`,
        style: { top },
      };
    });

    return [
      ...incoming,
      { type: "source", position: Position.Right, id: `${id}-output` },
    ];
  }, [variables, id]);

  // Height auto-grow: textarea grows; node height follows naturally
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    // reset then set to scrollHeight
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Width auto-grow: measure the longest line width using canvas
  const autoResizeWidth = () => {
    const el = textareaRef.current;
    if (!el) return;

    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const styles = window.getComputedStyle(el);
    const font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    ctx.font = font;

    const lines = (el.value || "").split("\n");
    const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b), "");
    const measured = ctx.measureText(longest).width;

    // padding: textarea padding + container padding + a little buffer
    const padLeft = parseFloat(styles.paddingLeft || "0");
    const padRight = parseFloat(styles.paddingRight || "0");

    const buffer = 90; // accounts for node padding + label area + breathing room
    const nextWidth = clamp(measured + padLeft + padRight + buffer, 260, 560);

    setNodeWidth(nextWidth);
  };

  // Run on mount + whenever text changes
  useLayoutEffect(() => {
    autoResizeTextarea();
    autoResizeWidth();
  }, [currText]);

  return (
    <BaseNode title="Text" handles={handles} style={{ width: nodeWidth }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Text:</div>

        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Type here..."
          rows={2}
          style={{
            width: "100%",
            resize: "none",
            overflow: "hidden",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            padding: 10,
            lineHeight: "18px",
            fontSize: 13,
            background: "rgba(0,0,0,0.35)",
            color: "rgba(255,255,255,0.95)",
          }}

        />

        {variables.length > 0 && (
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Vars: {variables.join(", ")}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
