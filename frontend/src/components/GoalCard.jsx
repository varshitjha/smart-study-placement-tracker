// src/components/GoalCard.jsx
//
// PURPOSE:
// Displays the current weekly goal: target hours, hours completed,
// percentage progress, and a visual progress bar.
// Used on the Dashboard and Goals page.
//
// PROPS:
//   goal         - The goal object { targetHours, weekStartDate }
//   completedHours - How many hours the user actually studied this week

import React from 'react'

function GoalCard({ goal, completedHours = 0 }) {
  // If no goal is set yet, show a prompt
  if (!goal) {
    return (
      <div className="goal-card goal-card--empty">
        <div className="goal-card-icon">🎯</div>
        <div className="goal-card-body">
          <div className="goal-card-title">No Weekly Goal Set</div>
          <div className="goal-card-sub">Set a target on the Goals page to track your progress.</div>
        </div>
      </div>
    )
  }

  const target  = goal.targetHours || 1
  const done    = Math.min(completedHours, target)
  const percent = Math.min(Math.round((done / target) * 100), 100)

  // Color changes based on completion
  const color =
    percent >= 100 ? '#10B981' :
    percent >= 60  ? '#4F46E5' :
    percent >= 30  ? '#F59E0B' : '#EF4444'

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <div>
          <div className="goal-card-title">🎯 Weekly Goal</div>
          <div className="goal-card-sub">Study hours this week</div>
        </div>
        <div className="goal-card-percent" style={{ color }}>{percent}%</div>
      </div>

      <div className="goal-card-numbers">
        <span className="goal-card-done" style={{ color }}>{done.toFixed(1)}h</span>
        <span className="goal-card-sep"> / </span>
        <span className="goal-card-target">{target}h target</span>
      </div>

      <div className="goal-progress-track">
        <div
          className="goal-progress-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>

      <div className="goal-card-status">
        {percent >= 100
          ? '🎉 Goal achieved! Great job this week!'
          : `${(target - done).toFixed(1)}h remaining to hit your goal`}
      </div>
    </div>
  )
}

export default GoalCard
