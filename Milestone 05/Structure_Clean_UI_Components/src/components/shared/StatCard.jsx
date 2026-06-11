// src/components/shared/StatCard.jsx
import React from "react";

export default function StatCard({ title, value, valueColor = "#e2e8f0", subtext, children }) {
  return (
    <div style={{ background: "#1a1a2e", border: "1px solid #2d2d44", borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: valueColor }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {subtext}
        </div>
      )}
      {children}
    </div>
  );
}
