import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Position, useEdges } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const extractRefs = (text) => {
  // Supports {{nodeId}} and {{nodeId.field}} and deeper like {{a.b.c}}
  const re =
    /{{\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*}}/g;

  const refs = new Set();
  let match;
  while ((match = re.exec(text)) !== null) refs.add(match[1]);
  return Array.from(refs);
};

const getAliasForNode = (node) => {
  // Use user-facing names when available so refs match what user sees
  if (!node) return "";
  if (node.type === "customInput") return node.data?.inputName || "";
  if (node.type === "customOutput") return node.data?.outputName || "";
  // could expand for other nodes later
  return "";
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [refs, setRefs] = useState(() => extractRefs(data?.text || "{{input}}"));

  // Auto-resize state
  const [nodeWidth, setNodeWidth] = useState(260);
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);

  const edges = useEdges();
  const nodes = useStore((s) => s.nodes);

  // Update refs when text changes
  useEffect(() => {
    setRefs(extractRefs(currText));
  }, [currText]);

  // Build maps for alias resolution
  const { aliasById, idByAlias } = useMemo(() => {
    const aById = {};
    const iByA = {};
    for (const n of nodes || []) {
      const alias = getAliasForNode(n);
      if (alias) {
        aById[n.id] = alias;
        iByA[alias] = n.id;
      }
    }
    return { aliasById: aById, idByAlias: iByA };
  }, [nodes]);

  // Handles are created from refs so user can connect them
  const handles = useMemo(() => {
    const incoming = refs.map((r, idx) => {
      const top =
        refs.length === 1
          ? "50%"
          : `${Math.round(((idx + 1) * 100) / (refs.length + 1))}%`;

      return {
        type: "target",
        position: Position.Left,
        id: `${id}-var-${r.replaceAll(".", "__")}`,
        style: { top },
      };
    });

    return [
      ...incoming,
      { type: "source", position: Position.Right, id: `${id}-output` },
    ];
  }, [refs, id]);

  // Connected incoming sources (actual ids)
  const connectedSourceIds = useMemo(() => {
    const incoming = edges.filter((e) => e.target === id);
    return new Set(incoming.map((e) => e.source));
  }, [edges, id]);

  // Connected "names" we show to the user (aliases when available)
  const connectedDisplayNames = useMemo(() => {
    const names = [];
    for (const sid of connectedSourceIds) {
      names.push(aliasById[sid] || sid);
    }
    return Array.from(new Set(names));
  }, [connectedSourceIds, aliasById]);

  // Validate refs: valid if base matches either
  // - connected source id
  // - alias of a connected source id
  const invalidRefs = useMemo(() => {
    const connectedAliasSet = new Set(
      Array.from(connectedSourceIds).map((sid) => aliasById[sid] || sid)
    );

    return refs.filter((r) => {
      const base = r.split(".")[0];
      return !(connectedSourceIds.has(base) || connectedAliasSet.has(base));
    });
  }, [refs, connectedSourceIds, aliasById]);

  // Unused connected: connected nodes exist but not referenced (by id or alias)
  const unusedConnected = useMemo(() => {
    const usedBases = new Set(refs.map((r) => r.split(".")[0]));

    // Used can be either node id or alias; normalize:
    const usedResolvedIds = new Set();
    for (const b of usedBases) {
      if (connectedSourceIds.has(b)) usedResolvedIds.add(b);
      const resolved = idByAlias[b];
      if (resolved && connectedSourceIds.has(resolved)) usedResolvedIds.add(resolved);
    }

    const unusedIds = Array.from(connectedSourceIds).filter(
      (sid) => !usedResolvedIds.has(sid)
    );

    // show alias if exists
    return unusedIds.map((sid) => aliasById[sid] || sid);
  }, [connectedSourceIds, refs, idByAlias, aliasById]);

  // Auto-resize (height + width)
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

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

    const padLeft = parseFloat(styles.paddingLeft || "0");
    const padRight = parseFloat(styles.paddingRight || "0");
    const buffer = 120;

    const nextWidth = clamp(measured + padLeft + padRight + buffer, 260, 560);
    setNodeWidth(nextWidth);
  };

  useLayoutEffect(() => {
    autoResizeTextarea();
    autoResizeWidth();
  }, [currText]);

  return (
    <BaseNode title="Text" handles={handles} style={{ width: nodeWidth }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* ERROR: referenced but not connected */}
        {invalidRefs.length > 0 && (
          <div
            style={{
              border: "1px solid rgba(255, 60, 60, 0.45)",
              background: "rgba(255, 60, 60, 0.12)",
              padding: "8px 10px",
              borderRadius: 10,
              fontSize: 12,
              lineHeight: "16px",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              Invalid reference (not connected):
            </div>
            <div>{invalidRefs.join(", ")}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              Connect the node first, then reference it like{" "}
              <b>{"{{nodeId.field}}"}</b>.
            </div>
          </div>
        )}

        {/* WARNING: connected but unused */}
        {unusedConnected.length > 0 && (
          <div
            style={{
              border: "1px solid rgba(255, 170, 0, 0.40)",
              background: "rgba(255, 170, 0, 0.10)",
              padding: "8px 10px",
              borderRadius: 10,
              fontSize: 12,
              lineHeight: "16px",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 4 }}>
              You are not using any of the connected input:
            </div>
            <div style={{ marginBottom: 4 }}>{unusedConnected.join(", ")}</div>
            <div style={{ opacity: 0.85 }}>
              Use it by typing <b>{"{{nodeId.field}}"}</b> in the text area.
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, opacity: 0.85 }}>Text:</div>

        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder='Example: {{input_0.value}}'
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

        {refs.length > 0 && (
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Refs: {refs.join(", ")}
          </div>
        )}

        {connectedDisplayNames.length > 0 && (
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Connected: {connectedDisplayNames.join(", ")}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
