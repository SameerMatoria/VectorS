// BaseNode.js
import React from "react";
import { Handle } from "reactflow";

const containerStyle = {
  minWidth: 200,
  borderRadius: 14,
  padding: 12,
  background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  color: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(6px)",
};


const headerStyle = {
  fontWeight: 800,
  fontSize: 13,
  marginBottom: 10,
  letterSpacing: "0.2px",
  opacity: 0.95,
};


export const BaseNode = ({ title, handles = [], children, style = {} }) => {
  return (
    <div style={{ ...containerStyle, ...style }}>
      <div style={headerStyle}>{title}</div>

      <div>{children}</div>

      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={h.style}
        />
      ))}
    </div>
  );
};
