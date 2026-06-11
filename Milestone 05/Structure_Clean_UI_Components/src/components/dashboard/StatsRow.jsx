// src/components/dashboard/StatsRow.jsx
import React from "react";
import StatCard from "../shared/StatCard";

export default function StatsRow({ totalCount, completedCount, progressPercent }) {
  const remainingCount = totalCount - completedCount;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
      <StatCard title="Total Tasks" value={totalCount} valueColor="#e2e8f0" subtext="All time" />
      <StatCard title="Completed" value={completedCount} valueColor="#22c55e" subtext="Done ✓" />
      <StatCard title="Remaining" value={remainingCount} valueColor="#f59e0b" subtext="To do" />
      <StatCard title="Progress" value={`${progressPercent}%`} valueColor="#6366f1">
        <div style={{ height: 4, background: "#2d2d44", borderRadius: 99, marginTop: 8 }}>
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </StatCard>
    </div>
  );
}
