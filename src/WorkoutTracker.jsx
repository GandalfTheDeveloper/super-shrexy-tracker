import React, { useState, useEffect, useRef, useCallback, useMemo, useId } from "react";
import { Settings, ChevronLeft, ChevronRight, Smartphone, Monitor, RefreshCw, Plus, Trash2, X, Maximize2, Minimize2 } from "lucide-react";

const PLAN_DAYS = [
  { Week: 1, DayOfWeek: "Monday", Type: "Lift", MuscleGroups: "Back, Biceps, Core", Notes: "" },
  { Week: 1, DayOfWeek: "Tuesday", Type: "Run+Mobility", MuscleGroups: "Cardio, Flexibility", Notes: "30-45 min trail run zone 2 + yoga" },
  { Week: 1, DayOfWeek: "Wednesday", Type: "Lift", MuscleGroups: "Chest, Legs, Calves", Notes: "" },
  { Week: 1, DayOfWeek: "Thursday", Type: "Lift", MuscleGroups: "Core, Biceps, Triceps", Notes: "Pickleball same day" },
  { Week: 1, DayOfWeek: "Friday", Type: "Rest", MuscleGroups: "", Notes: "Full rest day" },
  { Week: 1, DayOfWeek: "Saturday", Type: "Run", MuscleGroups: "Cardio", Notes: "30-45 min trail run zone 2" },
  { Week: 1, DayOfWeek: "Sunday", Type: "Lift", MuscleGroups: "Chest, Shoulders, Butt, Legs, Calves, Triceps", Notes: "" },
  { Week: 2, DayOfWeek: "Monday", Type: "Lift", MuscleGroups: "Back, Biceps, Core", Notes: "" },
  { Week: 2, DayOfWeek: "Tuesday", Type: "Run+Mobility", MuscleGroups: "Cardio, Flexibility", Notes: "30-45 min trail run zone 2 + yoga" },
  { Week: 2, DayOfWeek: "Wednesday", Type: "Lift", MuscleGroups: "Chest, Legs, Calves", Notes: "" },
  { Week: 2, DayOfWeek: "Thursday", Type: "Lift", MuscleGroups: "Core, Biceps, Triceps", Notes: "Pickleball same day" },
  { Week: 2, DayOfWeek: "Friday", Type: "Rest", MuscleGroups: "", Notes: "Full rest day" },
  { Week: 2, DayOfWeek: "Saturday", Type: "HIIT", MuscleGroups: "Cardio", Notes: "Jump rope VO2 max intervals" },
  { Week: 2, DayOfWeek: "Sunday", Type: "Lift", MuscleGroups: "Chest, Shoulders, Butt, Legs, Calves, Triceps", Notes: "" },
];

const RAW_EX = `1,Monday,1,Back,Cable Rows,3,12
1,Monday,2,Back,Bent Over Fly's,3,15
1,Monday,3,Back,Hyperextensions,3,12
1,Monday,4,Back,Dumbbell Row,3,12
1,Monday,5,Biceps,Bicep Barbell Curls,3,8
1,Monday,6,Biceps,Hammer Curls,3,12
1,Monday,7,Biceps,Incline Dumbbell Curls,3,10
1,Monday,8,Core,Hanging Leg Raises,3,10
1,Monday,9,Core,Weighted Vee Twists,3,12
1,Monday,10,Core,Plank,3,60s
1,Wednesday,1,Chest,Dumbbell Bench Press,3,10
1,Wednesday,2,Chest,Incline Dumbbell Press,3,8
1,Wednesday,3,Chest,Dumbbell Chest Fly,3,10
1,Wednesday,4,Legs,Squats,3,8
1,Wednesday,5,Legs,Bulgarian Split Squats,3,10
1,Wednesday,6,Calves,Calf Raises,4,15-20
1,Wednesday,7,Triceps,Tricep Rope Pushdown,2,12
1,Thursday,1,Core,Ab Roller,3,10
1,Thursday,2,Core,Weighted Vee Twists,3,12
1,Thursday,3,Core,Hanging Leg Raises,3,10
1,Thursday,4,Biceps,Concentration Curls,3,10
1,Thursday,5,Biceps,EZ Bar Preacher Curls,3,12
1,Thursday,6,Biceps,Alternating Dumbbell Curls,3,12
1,Thursday,7,Triceps,Face Pulls,2,12
1,Thursday,8,Triceps,Overhead Tricep Extension,3,12
1,Sunday,1,Chest,Incline Dumbbell Press,3,10
1,Sunday,2,Chest,Slow Pushups,2,Failure
1,Sunday,3,Chest,Cable Crossovers,3,12
1,Sunday,4,Shoulders,Seated Dumbbell Press,3,10
1,Sunday,5,Shoulders,Lateral Raises,3,15
1,Sunday,6,Shoulders,Front Raises,3,10
1,Sunday,7,Butt,Bulgarian Split Squats,3,12
1,Sunday,8,Butt,Weighted Hip Thrusts,3,12
1,Sunday,9,Butt,Weighted Step Ups,3,12
1,Sunday,10,Legs,Leg Curls,3,12
1,Sunday,11,Legs,Leg Extensions,3,12
1,Sunday,12,Legs,Leg Press,3,10
1,Sunday,13,Calves,Calf Raises,4,15-20
1,Sunday,14,Triceps,Overhead Tricep Extension,3,12
1,Sunday,15,Triceps,Face Pulls,2,12
2,Monday,1,Back,Cable Rows,3,12
2,Monday,2,Back,Bent Over Fly's,3,15
2,Monday,3,Back,Hyperextensions,3,12
2,Monday,4,Back,Dumbbell Row,3,12
2,Monday,5,Biceps,Bicep Barbell Curls,3,8
2,Monday,6,Biceps,Hammer Curls,3,12
2,Monday,7,Biceps,Incline Dumbbell Curls,3,10
2,Monday,8,Core,Hanging Leg Raises,3,10
2,Monday,9,Core,Weighted Vee Twists,3,12
2,Monday,10,Core,Plank,3,60s
2,Wednesday,1,Chest,Dumbbell Bench Press,3,10
2,Wednesday,2,Chest,Incline Dumbbell Press,3,8
2,Wednesday,3,Chest,Dumbbell Chest Fly,3,10
2,Wednesday,4,Legs,Squats,3,8
2,Wednesday,5,Legs,Bulgarian Split Squats,3,10
2,Wednesday,6,Calves,Calf Raises,4,15-20
2,Wednesday,7,Triceps,Tricep Rope Pushdown,2,12
2,Thursday,1,Core,Ab Roller,3,10
2,Thursday,2,Core,Weighted Vee Twists,3,12
2,Thursday,3,Core,Hanging Leg Raises,3,10
2,Thursday,4,Biceps,Concentration Curls,3,10
2,Thursday,5,Biceps,EZ Bar Preacher Curls,3,12
2,Thursday,6,Biceps,Alternating Dumbbell Curls,3,12
2,Thursday,7,Triceps,Face Pulls,2,12
2,Thursday,8,Triceps,Overhead Tricep Extension,3,12
2,Sunday,1,Chest,Incline Dumbbell Press,3,10
2,Sunday,2,Chest,Slow Pushups,2,Failure
2,Sunday,3,Chest,Cable Crossovers,3,12
2,Sunday,4,Shoulders,Seated Dumbbell Press,3,10
2,Sunday,5,Shoulders,Lateral Raises,3,15
2,Sunday,6,Shoulders,Front Raises,3,10
2,Sunday,7,Butt,Bulgarian Split Squats,3,12
2,Sunday,8,Butt,Weighted Hip Thrusts,3,12
2,Sunday,9,Butt,Weighted Step Ups,3,12
2,Sunday,10,Legs,Leg Curls,3,12
2,Sunday,11,Legs,Leg Extensions,3,12
2,Sunday,12,Legs,Leg Press,3,10
2,Sunday,13,Calves,Calf Raises,4,15-20
2,Sunday,14,Triceps,Overhead Tricep Extension,3,12
2,Sunday,15,Triceps,Face Pulls,2,12`;

// "weighted" (reps + weight), "reps" (bodyweight, reps only), "time" (timer, seconds only)
const REPS_ONLY_NAMES = new Set(["Hanging Leg Raises", "Ab Roller", "Slow Pushups"]);
function classifyExerciseType(name, targetReps) {
  if (/s$/i.test(String(targetReps || "").trim())) return "time";
  if (REPS_ONLY_NAMES.has(name)) return "reps";
  return "weighted";
}

const PLAN_EXERCISES = RAW_EX.split("\n").map((line) => {
  const [Week, DayOfWeek, Order, MuscleGroup, ExerciseName, TargetSets, TargetReps] = line.split(",");
  return { Week: Number(Week), DayOfWeek, Order: Number(Order), MuscleGroup, ExerciseName, TargetSets, TargetReps, ExerciseType: classifyExerciseType(ExerciseName, TargetReps) };
});

// ---- Palette: dark teal base, turquoise / mustard gold / red accents ----
const BG = "#0D1917";
const CARD = "#152321";
const CARD2 = "#1A2C29";
const LINE = "#243733";
const INK = "#E9F2EF";
const SUB = "#7FA39B";
const ACCENT = "#2FD9C0"; // turquoise - primary
const GOLD = "#E3B23C"; // mustard - partial / secondary
const REDC = "#D00000"; // matched red - none / alert / delete
const SLATE = "#3A4D48"; // neutral / no-data

const statusColor = (s) => (s === "Complete" ? ACCENT : s === "Partial" ? GOLD : s === "None" ? REDC : SLATE);
const fmtDate = (d) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const dayName = (d) => d.toLocaleDateString("en-US", { weekday: "long" });
const startOfWeek = (d) => { const x = new Date(d); const diff = (x.getDay() + 6) % 7; x.setDate(x.getDate() - diff); x.setHours(0, 0, 0, 0); return x; };

function getWeekNumber(date, anchorStr) {
  const anchor = new Date(anchorStr + "T00:00:00");
  const monday = startOfWeek(date);
  const anchorMonday = startOfWeek(anchor);
  const diffWeeks = Math.round((monday - anchorMonday) / (7 * 86400000));
  const mod = ((diffWeeks % 2) + 2) % 2;
  return mod === 0 ? 1 : 2;
}
const parseTargetSets = (ts) => { const n = parseInt(ts, 10); return isNaN(n) ? 1 : n; };
// Fixed once, on purpose: this used to be a per-device editable setting, which
// let each device's local storage drift out of sync with the others (one
// device says Week 1, another says Week 2, for the same calendar day).
// Sep 21, 2026 is a confirmed Week 1 Monday.
const CYCLE_ANCHOR = "2026-09-21";
const isManualFlag = (v) => String(v).toUpperCase() === "TRUE";
// Rest days count as Complete unless a status was deliberately set by hand —
// otherwise logging a weigh-in on a rest day (which saves status "None")
// would paint that rest day red.
const effectiveStatus = (planType, entry) => {
  if (planType === "Rest") return entry?.CompletionStatus && isManualFlag(entry.StatusManual) ? entry.CompletionStatus : "Complete";
  return entry?.CompletionStatus || "None";
};
function getPlanTypeForDate(dateStr, anchorDate) {
  const d = new Date(dateStr + "T00:00:00");
  const wk = getWeekNumber(d, anchorDate);
  return PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dayName(d))?.Type;
}
const planKey = (wk, dn) => `${wk}-${dn}`;
function getEffectiveExercises(overrides, wk, dn) {
  const key = planKey(wk, dn);
  if (overrides && overrides[key]) return overrides[key].map((e, i) => ({ ...e, Week: wk, DayOfWeek: dn, Order: i + 1, ExerciseType: e.ExerciseType || "weighted" }));
  return PLAN_EXERCISES.filter((e) => e.Week === wk && e.DayOfWeek === dn).sort((a, b) => a.Order - b.Order);
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };

async function storeGet(key, fallback) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : fallback;
    }
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
async function storeSet(key, value) {
  try {
    if (typeof window !== "undefined" && window.storage) { await window.storage.set(key, JSON.stringify(value)); return; }
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---- History-based placeholder logic ----
function overlayPending(log, queue, action) {
  const pending = (queue || []).filter((i) => i.action === action).map((i) => i.data);
  if (!pending.length) return log;
  const map = new Map();
  log.forEach((r) => map.set(r.Date, r));
  pending.forEach((r) => map.set(r.Date, { ...(map.get(r.Date) || {}), ...r }));
  return [...map.values()];
}

function effectiveExerciseLog(exerciseLog, queue) {
  const pending = (queue || []).filter((i) => i.action === "logExercise").map((i) => i.data);
  if (!pending.length) return exerciseLog;
  const key = (r) => `${r.Date}|${r.ExerciseName}|${r.SetNumber}`;
  const map = new Map();
  exerciseLog.forEach((r) => map.set(key(r), r));
  pending.forEach((r) => map.set(key(r), r));
  return [...map.values()];
}

// Finds the most recent PAST calendar date this exercise was actually
// scheduled to happen, per the plan (walks backward day by day). Distinct
// from getLastSession: this does NOT skip a date just because nothing was
// logged for it — a skipped session should still count as "last time."
function getLastScheduledDate(exName, dateStr, anchorDate, planOverrides) {
  let d = addDays(new Date(dateStr + "T00:00:00"), -1);
  for (let i = 0; i < 21; i++) {
    const wk = getWeekNumber(d, anchorDate);
    const dn = dayName(d);
    const dayExercises = getEffectiveExercises(planOverrides, wk, dn);
    if (dayExercises.some((e) => e.ExerciseName === exName)) return fmtDate(d);
    d = addDays(d, -1);
  }
  return null;
}

function getLastSession(exerciseLog, name, beforeDateStr) {
  const dates = [...new Set(exerciseLog.filter((r) => r.ExerciseName === name && r.Date < beforeDateStr).map((r) => r.Date))].sort();
  if (!dates.length) return [];
  const last = dates[dates.length - 1];
  return exerciseLog.filter((r) => r.ExerciseName === name && r.Date === last).sort((a, b) => Number(a.SetNumber) - Number(b.SetNumber));
}
function modeOrAverage(session) {
  if (!session.length) return { reps: "", weight: "" };
  const counts = {};
  session.forEach((s) => { const k = `${s.Reps}|${s.Weight}`; counts[k] = (counts[k] || 0) + 1; });
  const entries = Object.entries(counts);
  const maxFreq = Math.max(...entries.map((e) => e[1]));
  const modes = entries.filter((e) => e[1] === maxFreq);
  if (session.length === 1 || (maxFreq > 1 && modes.length === 1)) {
    const [reps, weight] = modes[0][0].split("|");
    return { reps, weight };
  }
  const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : "");
  const repsNums = session.map((s) => Number(s.Reps)).filter((n) => !isNaN(n));
  const weightNums = session.map((s) => Number(s.Weight)).filter((n) => !isNaN(n));
  return { reps: String(avg(repsNums)), weight: String(avg(weightNums)) };
}
function generateDemoData() {
  const daily = [], exercise = [], run = [];
  const today = new Date();
  let bw = 186;
  for (let i = 70; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = fmtDate(d);
    const dn = dayName(d);
    if (dn === "Friday") continue;
    bw -= Math.random() * 0.15;
    const roll = Math.random();
    const status = roll > 0.8 ? "Partial" : roll > 0.12 ? "Complete" : "None";
    daily.push({ Date: ds, Weight: bw.toFixed(1), CompletionStatus: status, Notes: "" });
    if (status !== "None" && (dn === "Wednesday" || dn === "Monday" || dn === "Sunday")) {
      const weekIdx = Math.floor((70 - i) / 7);
      if (dn === "Wednesday") {
        const base = 30 + weekIdx * 1.2;
        exercise.push({ Date: ds, ExerciseName: "Dumbbell Bench Press", SetNumber: 1, Reps: 10, Weight: Math.round(base) });
        exercise.push({ Date: ds, ExerciseName: "Dumbbell Bench Press", SetNumber: 2, Reps: 10, Weight: Math.round(base) });
        exercise.push({ Date: ds, ExerciseName: "Dumbbell Bench Press", SetNumber: 3, Reps: 8, Weight: Math.round(base - 8) });
        exercise.push({ Date: ds, ExerciseName: "Squats", SetNumber: 1, Reps: 8, Weight: Math.round(65 + weekIdx * 1.8) });
        exercise.push({ Date: ds, ExerciseName: "Squats", SetNumber: 2, Reps: 8, Weight: Math.round(65 + weekIdx * 1.8) });
      }
      if (dn === "Monday") {
        const base = 75 + weekIdx * 1.5;
        exercise.push({ Date: ds, ExerciseName: "Cable Rows", SetNumber: 1, Reps: 12, Weight: Math.round(base) });
        exercise.push({ Date: ds, ExerciseName: "Cable Rows", SetNumber: 2, Reps: 12, Weight: Math.round(base) });
        exercise.push({ Date: ds, ExerciseName: "Cable Rows", SetNumber: 3, Reps: 10, Weight: Math.round(base - 5) });
      }
    }
    if (status !== "None" && (dn === "Tuesday" || dn === "Saturday")) {
      const weekIdx = Math.floor((70 - i) / 7);
      const paceSec = Math.max(495, 620 - weekIdx * 3);
      const m = Math.floor(paceSec / 60), s = paceSec % 60;
      run.push({ Date: ds, Distance: (2.8 + Math.random() * 0.6).toFixed(1), Time: "32:00", Pace: `${m}:${String(s).padStart(2, "0")}` });
    }
  }
  return { daily, exercise, run };
}

function getLastNoteForSameWeekday(dailyLog, dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const dn = dayName(d);
  const candidates = dailyLog
    .filter((r) => r.Date < dateStr && r.Notes)
    .filter((r) => dayName(new Date(r.Date + "T00:00:00")) === dn)
    .sort((a, b) => b.Date.localeCompare(a.Date));
  return candidates[0]?.Notes || "";
}

function computePace(distance, time) {
  const dist = parseFloat(distance);
  if (!dist || dist <= 0 || !time) return "";
  const minutes = parseClock(time);
  if (!(minutes > 0)) return "";
  return formatPace(minutes / dist);
}

function formatSecondsClock(totalSeconds) {
  const n = Number(totalSeconds);
  if (!n || n < 0) return "0:00";
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function computeAutoStatus(setsObj, runD, isRunDay, isRestDay) {
  if (isRestDay) return "Complete";
  const allRows = Object.values(setsObj).flat();
  if (allRows.length > 0) {
    const filled = allRows.filter((r) => String(r.reps).trim() !== "");
    if (filled.length === 0) return isRunDay && (runD.Distance || runD.Time) ? "Partial" : "None";
    if (filled.length === allRows.length) return "Complete";
    return "Partial";
  }
  if (isRunDay) {
    if (runD.Distance && runD.Time) return "Complete";
    if (runD.Distance || runD.Time) return "Partial";
    return "None";
  }
  return "None";
}

function rowPlaceholder(exerciseLog, exName, dateStr, rowIndex) {
  const session = getLastSession(exerciseLog, exName, dateStr);
  if (rowIndex === 0) return modeOrAverage(session);
  const row = session[rowIndex];
  return row ? { reps: row.Reps, weight: row.Weight } : { reps: "", weight: "" };
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, padding: "10px 8px", borderRadius: 8, border: `1px solid ${value === o.value ? o.color : LINE}`,
          background: value === o.value ? o.color + "22" : "transparent", color: value === o.value ? o.color : SUB,
          fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

const STATUS_OPTS = [{ value: "None", label: "None", color: REDC }, { value: "Partial", label: "Partial", color: GOLD }, { value: "Complete", label: "Complete", color: ACCENT }];

function TodaySlide({ date, weekNum, planDay, exercises, dailyLog }) {
  const existing = dailyLog.find((r) => r.Date === fmtDate(date));
  const eff = effectiveStatus(planDay?.Type, existing);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 28, gap: 20, overflowY: "auto" }}>
      <div>
        <div style={{ fontSize: 13, letterSpacing: 1.5, color: ACCENT, fontWeight: 700, textTransform: "uppercase" }}>Week {weekNum} &middot; {planDay?.Type || "—"}</div>
        <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "Arial Narrow, Arial, sans-serif", letterSpacing: 0.5 }}>
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div style={{ fontSize: 15, color: SUB, marginTop: 4 }}>{planDay?.MuscleGroups || "—"}{planDay?.Notes ? ` · ${planDay.Notes}` : ""}</div>
      </div>
      {exercises.length > 0 && (
        <div style={{ background: CARD, borderRadius: 12, padding: "6px 16px" }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < exercises.length - 1 ? `1px solid ${LINE}` : "none" }}>
              <span style={{ fontSize: 15 }}>{ex.ExerciseName}</span>
              <span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: SUB, fontSize: 14 }}>{ex.TargetSets} × {ex.TargetReps}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: "auto" }}>
        <div>
          <div style={{ fontSize: 12, color: SUB, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Weight</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{existing?.Weight ? `${existing.Weight} lb` : "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: SUB, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Status</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: statusColor(eff) }}>{eff === "None" ? "Not logged" : eff}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: SUB, fontStyle: "italic" }}>Read-only display &middot; log sets, weight and notes from phone mode.</div>
    </div>
  );
}

function WeekSlide({ date, anchorDate, dailyLog, exerciseLog, calendarNotes, onSaveNote, onNav, planOverrides, onEditDay }) {
  const [editingDate, setEditingDate] = useState(null);
  const monday = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d; });
  const today = fmtDate(new Date());
  const endOfW = addDays(monday, 6);
  const label = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endOfW.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 28, gap: 16, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{label}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ChevronLeft size={24} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(-1)} />
          <span onClick={() => onNav("today")} style={{ fontSize: 15, color: ACCENT, cursor: "pointer", fontWeight: 700 }}>Today</span>
          <ChevronRight size={24} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(1)} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
        {days.map((d) => {
          const wk = getWeekNumber(d, anchorDate);
          const dn = dayName(d);
          const plan = PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dn);
          const exList = getEffectiveExercises(planOverrides, wk, dn);
          const ds = fmtDate(d);
          const log = dailyLog.find((r) => r.Date === ds);
          const note = calendarNotes?.[ds];
          const isPast = ds < today, isToday = ds === today;
          const color = isPast || isToday ? statusColor(effectiveStatus(plan?.Type, log)) : LINE;
          return (
            <div key={ds} onClick={() => setEditingDate(ds)} style={{ cursor: "pointer", display: "flex", flexDirection: "column", background: CARD, borderRadius: 10, padding: 12, border: isToday ? `2px solid ${ACCENT}` : `1px solid ${LINE}` }}>
              <div style={{ fontSize: 15, color: SUB, textTransform: "uppercase", letterSpacing: 1 }}>{dn.slice(0, 3)} {d.getDate()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT, margin: "4px 0" }}>{plan?.Type}</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                {exList.length > 0 ? exList.map((e, i) => (
                  <div key={i} style={{ fontSize: 14.5, color: SUB, lineHeight: 1.5, display: "flex", gap: 4 }}>
                    <span style={{ color: GOLD, flexShrink: 0 }}>&#9656;</span>{e.ExerciseName}
                  </div>
                )) : <div style={{ fontSize: 15, color: SUB }}>{plan?.Notes || plan?.MuscleGroups}</div>}
              </div>
              {note && <div style={{ fontSize: 14.5, color: GOLD, fontStyle: "italic", marginTop: 6, borderTop: `1px solid ${LINE}`, paddingTop: 6 }}>&#9733; {note}</div>}
              <div style={{ width: "100%", height: 5, borderRadius: 3, background: (isPast || isToday) ? color : "transparent", marginTop: 8 }} />
            </div>
          );
        })}
      </div>
      {editingDate && (
        <DayDetailModal dateStr={editingDate} initialNote={calendarNotes?.[editingDate]}
          isPast={editingDate < today}
          planType={getPlanTypeForDate(editingDate, anchorDate)}
          dailyEntry={dailyLog.find((r) => r.Date === editingDate)}
          exerciseEntries={exerciseLog.filter((r) => r.Date === editingDate)}
          onClose={() => setEditingDate(null)}
          onSave={(text) => { onSaveNote(editingDate, text); setEditingDate(null); }}
          onClear={() => { onSaveNote(editingDate, ""); setEditingDate(null); }}
          onEdit={(ds) => { onEditDay(ds); setEditingDate(null); }} />
      )}
    </div>
  );
}

function DayDetailModal({ dateStr, initialNote, dailyEntry, exerciseEntries, isPast, planType, onSave, onClear, onClose, onEdit }) {
  const [text, setText] = useState(initialNote || "");
  const grouped = exerciseEntries.reduce((acc, r) => { (acc[r.ExerciseName] = acc[r.ExerciseName] || []).push(r); return acc; }, {});
  const eff = effectiveStatus(planType, dailyEntry);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: "22px 22px 40px 22px", width: 340, maxHeight: "85%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
          <X size={18} style={{ cursor: "pointer", color: SUB }} onClick={onClose} />
        </div>

        {(
          <div style={{ background: BG, borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: SUB, textTransform: "uppercase", letterSpacing: 1 }}>{isPast ? "What you did" : "Workout"}</div>
              {planType !== "Rest" && <button onClick={() => onEdit(dateStr)} style={{ fontSize: 11, color: ACCENT, background: "none", border: `1px solid ${ACCENT}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 700 }}>Edit</button>}
            </div>
            {dailyEntry ? (
              <>
                <div style={{ display: "flex", gap: 16, marginBottom: Object.keys(grouped).length ? 10 : 0, fontSize: 13 }}>
                  <span>Weight: <b>{dailyEntry.Weight || "—"}</b></span>
                  <span style={{ color: statusColor(eff) }}>{eff}</span>
                </div>
                {dailyEntry.Notes && <div style={{ fontSize: 12, color: SUB, marginBottom: 10, fontStyle: "italic" }}>&ldquo;{dailyEntry.Notes}&rdquo;</div>}
                {Object.entries(grouped).map(([name, rows]) => (
                  <div key={name} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 11, color: SUB, fontFamily: "ui-monospace, Menlo, monospace" }}>
                      {rows.sort((a, b) => Number(a.SetNumber) - Number(b.SetNumber)).map((r) => `${r.Reps}x${r.Weight}`).join("  ·  ")}
                    </div>
                  </div>
                ))}
              </>
            ) : planType === "Rest" ? (
              <div style={{ fontSize: 12, color: statusColor("Complete") }}>Rest day — nothing to log.</div>
            ) : <div style={{ fontSize: 12, color: SUB }}>{isPast ? "Nothing logged for this day." : "Nothing logged yet."}</div>}
          </div>
        )}

        <div style={{ fontSize: 11, color: SUB }}>One-off note for this date. Shown on week view, not tracked in reporting.</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. Paddle boarding with Sam, 2pm"
          style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK, resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onSave(text)} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: GOLD, color: "#332405", fontWeight: 700 }}>Save note</button>
          {initialNote && <button onClick={onClear} style={{ padding: 11, borderRadius: 10, border: `1px solid ${REDC}`, background: "transparent", color: REDC, fontWeight: 700 }}>Clear</button>}
        </div>
      </div>
    </div>
  );
}

function MonthSlide({ date, anchorDate, dailyLog, exerciseLog, calendarNotes, onSaveNote, onNav, onEditDay }) {
  const [editingDate, setEditingDate] = useState(null);
  const year = date.getFullYear(), month = date.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  const today = fmtDate(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 20px", gap: 10, position: "relative", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ChevronLeft size={24} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(-1)} />
          <span onClick={() => onNav("today")} style={{ fontSize: 15, color: ACCENT, cursor: "pointer", fontWeight: 700 }}>Today</span>
          <ChevronRight size={24} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(1)} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 15, color: SUB, textTransform: "uppercase" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} style={{ textAlign: "center" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "minmax(0, 1fr)", gap: 6, flex: "1 1 0", minHeight: 0 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const wk = getWeekNumber(d, anchorDate);
          const plan = PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dayName(d));
          const label = plan?.MuscleGroups ? plan.MuscleGroups : plan?.Type;
          const ds = fmtDate(d);
          const log = dailyLog.find((r) => r.Date === ds);
          const note = calendarNotes?.[ds];
          const isPast = ds < today, isToday = ds === today;
          const color = isPast || isToday ? statusColor(effectiveStatus(plan?.Type, log)) : LINE;
          return (
            <div key={i} onClick={() => setEditingDate(ds)} style={{ position: "relative", cursor: "pointer", background: CARD, borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", border: isToday ? `2px solid ${ACCENT}` : `1px solid ${LINE}`, fontSize: 14, overflow: "hidden", minHeight: 0, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{d.getDate()}</div>
              <div style={{ color: SUB, flex: 1, overflow: "hidden", fontSize: 14 }}>{label}</div>
              {note && <div style={{ color: GOLD, fontSize: 13, fontStyle: "italic", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>&#9733; {note}</div>}
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: (isPast || isToday) ? color : "transparent" }} />
            </div>
          );
        })}
      </div>
      {editingDate && (
        <DayDetailModal dateStr={editingDate} initialNote={calendarNotes?.[editingDate]}
          isPast={editingDate < today}
          planType={getPlanTypeForDate(editingDate, anchorDate)}
          dailyEntry={dailyLog.find((r) => r.Date === editingDate)}
          exerciseEntries={exerciseLog.filter((r) => r.Date === editingDate)}
          onClose={() => setEditingDate(null)}
          onSave={(text) => { onSaveNote(editingDate, text); setEditingDate(null); }}
          onClear={() => { onSaveNote(editingDate, ""); setEditingDate(null); }}
          onEdit={(ds) => { onEditDay(ds); setEditingDate(null); }} />
      )}
    </div>
  );
}

// ===================== Progress analytics =====================
const WHITE_C = "#F4F7F6";
const RAINBOW = [ACCENT, GOLD, REDC, WHITE_C];
const GOAL_LOW = 175; // goal range is 175-179 inclusive (trend values are continuous)
const GOAL_HIGH = 179;
const GOLD_CEILING = 181; // up to 2 lb above the range = gold, beyond = red
const MAINT_STREAK_DAYS = 14;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const dayIndex = (dateStr) => { const [y, m, d] = String(dateStr).split("-").map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };
const idxToDateStr = (idx) => { const d = new Date(idx * 86400000); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; };
const idxLabel = (idx) => { const d = new Date(Math.round(idx) * 86400000); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };
const meanOf = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const signed = (v, digits = 1) => `${v > 0 ? "+" : ""}${v.toFixed(digits)}`;

// Parses "m:ss", "h:mm:ss" or a plain number into minutes.
function parseClock(str) {
  if (str === null || str === undefined || str === "") return NaN;
  const s = String(str).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const parts = s.split(":").map(Number);
  if (parts.some((p) => isNaN(p))) return NaN;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  return NaN;
}
const formatPace = (min) => { if (!isFinite(min)) return ""; const m = Math.floor(min); const s = Math.round((min - m) * 60); return s === 60 ? `${m + 1}:00` : `${m}:${String(s).padStart(2, "0")}`; };

// Ordinary least squares on {x, y}; returns value at x=0 (a) and slope (b).
function linFit(pts) {
  const mx = meanOf(pts.map((p) => p.x)), my = meanOf(pts.map((p) => p.y));
  let sxx = 0, sxy = 0;
  pts.forEach((p) => { sxx += (p.x - mx) * (p.x - mx); sxy += (p.x - mx) * (p.y - my); });
  const b = sxx > 0 ? sxy / sxx : 0;
  return { a: my - b * mx, b };
}

// Regression over the trailing `base` days ending at day d, using real
// elapsed days as x. Needs `minPts` points; if the base window is too sparse
// it widens backward (up to maxSpan days) until it has enough.
function windowFit(pts, d, base = 7, maxSpan = 30, minPts = 3) {
  const cand = pts.filter((p) => p.t <= d && p.t > d - maxSpan);
  if (cand.length < 2) return null;
  let span = base;
  if (cand.filter((p) => p.t > d - base).length < minPts) span = cand.length >= minPts ? d - cand[cand.length - minPts].t + 1 : maxSpan;
  const win = cand.filter((p) => p.t > d - span);
  if (win.length < 2) return null;
  const f = linFit(win.map((p) => ({ x: p.t - d, y: p.v })));
  // The fitted level is clamped to what was actually weighed in this window:
  // a straight line through a descent-then-plateau undershoots the kink, and
  // the trend must never claim a weight lower/higher than any real weigh-in.
  const vals = win.map((p) => p.v);
  return { value: Math.min(Math.max(f.a, Math.min(...vals)), Math.max(...vals)), slope: f.b };
}

// Deterministic "random" color runs so the rainbow is stable across reloads.
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function buildRainbowMap(startT, endT) {
  const rand = mulberry32(20260921);
  const map = new Map();
  let t = dayIndex("2025-01-01");
  while (t <= endT) {
    const len = 1 + Math.floor(rand() * 3);
    const c = RAINBOW[Math.floor(rand() * RAINBOW.length)];
    for (let k = 0; k < len && t <= endT; k++, t++) if (t >= startT) map.set(t, c);
  }
  return map;
}

function weightColor(v, slopeWk, maintenance, t, rainbowMap) {
  if (v < GOAL_LOW) return { color: REDC, label: "Below goal range" };
  if (maintenance) {
    if (v <= GOAL_HIGH) return { color: rainbowMap.get(t) || ACCENT, label: "Holding goal range" };
    if (v <= GOLD_CEILING) return { color: GOLD, label: "Slightly above goal range" };
    return { color: REDC, label: "Above goal range" };
  }
  if (v <= GOAL_HIGH) return { color: ACCENT, label: "In goal range" };
  if (slopeWk < -2) return { color: WHITE_C, label: "Losing faster than 2 lb/wk" };
  if (slopeWk <= -1) return { color: ACCENT, label: "On pace (1–2 lb/wk)" };
  if (slopeWk < -0.25) return { color: GOLD, label: "Losing, under pace" };
  return { color: REDC, label: "Stalled or gaining" };
}

// The LINE only ever connects real weigh-ins (plus one dashed segment from the
// last weigh-in to today). The regression is used for COLOR only, evaluated
// at real weigh-in dates — it never draws values where no data exists.
function computeWeightAnalysis(dailyLog, todayIdx, windowDays = 10) {
  const byDay = new Map();
  dailyLog.forEach((r) => {
    const w = parseFloat(r.Weight);
    if (DATE_RE.test(String(r.Date)) && !isNaN(w) && w > 50 && w < 700) byDay.set(dayIndex(r.Date), w);
  });
  const raw = [...byDay.entries()].map(([t, v]) => ({ t, v })).sort((a, b) => a.t - b.t);
  if (!raw.length) return { raw, line: [], latest: null, lastReal: null, maintenance: false, rainbowMap: new Map() };
  const lastT = raw[raw.length - 1].t;
  const rainbowMap = buildRainbowMap(raw[0].t, Math.max(todayIdx, lastT) + 1);
  // Widen the window over sparse stretches, but never reach back more than ~6
  // weeks — past that there's no recent trend to measure.
  const maxSpan = Math.max(42, windowDays * 2);

  let maintenance = false, maintStart = null, runStart = null, prevT = null;
  const line = raw.map((p) => {
    const f = windowFit(raw, p.t, windowDays, maxSpan);
    const trendV = f ? f.value : p.v;
    const slopeWk = f ? f.slope * 7 : null;
    // Maintenance: trend held inside the goal range for 14+ days, with no
    // gap longer than a week between weigh-ins (a gap breaks "consistently").
    if (!maintenance) {
      const inRange = f !== null && trendV >= GOAL_LOW && trendV <= GOAL_HIGH;
      if (!inRange) runStart = null;
      else if (runStart === null || (prevT !== null && p.t - prevT > 7)) runStart = p.t;
      if (runStart !== null && p.t - runStart >= MAINT_STREAK_DAYS) { maintenance = true; maintStart = p.t; }
    }
    prevT = p.t;
    const inMaint = maintenance && p.t > maintStart;
    let c;
    if (f) c = weightColor(trendV, slopeWk, inMaint, p.t, rainbowMap);
    else if (inMaint || trendV < GOAL_LOW || trendV <= GOAL_HIGH) c = weightColor(trendV, 0, inMaint, p.t, rainbowMap);
    else c = { color: SUB, label: "Not enough recent weigh-ins for a trend" };
    const rainbow = inMaint && trendV >= GOAL_LOW && trendV <= GOAL_HIGH;
    return { t: p.t, v: p.v, trendV, slopeWk, inMaint, rainbow, dashed: false, ...c };
  });

  const lastReal = line[line.length - 1];
  let latest = lastReal;
  if (todayIdx > lastT) {
    // Best guess for today only: continue from the last real weigh-in at the
    // current trend rate. Replaced by a real point as soon as today is logged.
    const slope = lastReal.slopeWk !== null ? lastReal.slopeWk : 0;
    const gap = todayIdx - lastT;
    const projTrend = lastReal.trendV + (slope / 7) * gap;
    const inMaint = maintenance;
    const c = lastReal.slopeWk !== null || inMaint ? weightColor(projTrend, slope, inMaint, todayIdx, rainbowMap) : { color: lastReal.color, label: lastReal.label };
    latest = { t: todayIdx, v: lastReal.v + (slope / 7) * gap, trendV: projTrend, slopeWk: lastReal.slopeWk, inMaint, rainbow: inMaint && projTrend >= GOAL_LOW && projTrend <= GOAL_HIGH, dashed: true, ...c };
    line.push(latest);
  }
  return { raw, line, latest, lastReal, maintenance, rainbowMap };
}

function computeConsistency(dailyLog, exerciseLog, anchorDate, todayIdx) {
  const status = new Map();
  dailyLog.forEach((r) => { if (DATE_RE.test(String(r.Date))) status.set(dayIndex(r.Date), r.CompletionStatus); });
  let start = Infinity;
  [...dailyLog, ...exerciseLog].forEach((r) => { if (DATE_RE.test(String(r.Date))) start = Math.min(start, dayIndex(r.Date)); });
  if (!isFinite(start)) return { level: [], rate: [] };
  const scored = [];
  for (let d = start; d <= todayIdx; d++) {
    const type = getPlanTypeForDate(idxToDateStr(d), anchorDate);
    if (!type || type === "Rest") continue;
    const s = status.get(d);
    if (d === todayIdx && !s) continue; // today is still in progress
    scored.push({ t: d, v: s === "Complete" ? 1 : s === "Partial" ? 0.5 : 0 });
  }
  const level = [];
  for (let d = start; d <= todayIdx; d++) {
    const win = scored.filter((p) => p.t <= d && p.t > d - 7);
    if (!win.length) continue;
    const v = meanOf(win.map((p) => p.v)) * 100;
    level.push({ t: d, v, color: v >= 90 ? ACCENT : v >= 70 ? GOLD : REDC, label: v >= 90 ? "Consistent" : v >= 70 ? "Some misses" : "Falling off" });
  }
  const rate = [];
  level.forEach((p) => {
    const win = level.filter((q) => q.t <= p.t && q.t > p.t - 7);
    if (win.length < 3) return;
    const r = linFit(win.map((q) => ({ x: q.t - p.t, y: q.v }))).b * 7;
    // Flat while already at 90%+ counts as blue: there's no higher to go.
    const up = r > 5, down = r < -5;
    rate.push({ t: p.t, v: r, level: p.v, color: up ? ACCENT : down ? REDC : p.v >= 90 ? ACCENT : GOLD, label: up ? "Trending up" : down ? "Trending down" : p.v >= 90 ? "Holding high" : "Flat" });
  });
  return { level, rate };
}

function parseTargetLow(tr) { const s = String(tr || ""); if (/s\s*$/i.test(s)) return NaN; const m = s.match(/^\s*(\d+)/); return m ? Number(m[1]) : NaN; }
function getExerciseMeta(name, planOverrides) {
  for (const rows of Object.values(planOverrides || {})) {
    const f = (rows || []).find((r) => r.ExerciseName === name);
    if (f) return { targetReps: f.TargetReps, type: f.ExerciseType || classifyExerciseType(name, f.TargetReps) };
  }
  const p = PLAN_EXERCISES.find((e) => e.ExerciseName === name);
  if (p) return { targetReps: p.TargetReps, type: p.ExerciseType };
  return { targetReps: "", type: classifyExerciseType(name, "") };
}

function buildLiftSessions(exerciseLog, name) {
  const dedup = new Map();
  exerciseLog.forEach((r) => { if (r.ExerciseName === name && DATE_RE.test(String(r.Date))) dedup.set(`${r.Date}|${r.SetNumber}`, r); });
  const byDate = new Map();
  dedup.forEach((r) => {
    const reps = parseFloat(r.Reps);
    if (isNaN(reps) || reps <= 0) return;
    const w = parseFloat(r.Weight);
    if (!byDate.has(r.Date)) byDate.set(r.Date, []);
    byDate.get(r.Date).push({ reps, w: isNaN(w) || w <= 0 ? null : w });
  });
  return [...byDate.entries()].map(([date, sets]) => {
    const reps = sets.map((s) => s.reps);
    const ws = sets.map((s) => s.w).filter((w) => w !== null);
    const counts = {};
    reps.forEach((r) => { counts[r] = (counts[r] || 0) + 1; });
    const maxCount = Math.max(...Object.values(counts));
    const modeReps = Math.min(...Object.keys(counts).filter((k) => counts[k] === maxCount).map(Number));
    const totalReps = reps.reduce((a, b) => a + b, 0);
    return {
      t: dayIndex(date), sets: sets.length, weighted: ws.length > 0,
      avgW: ws.length ? meanOf(ws) : 0, avgReps: meanOf(reps), modeReps, totalReps, longest: Math.max(...reps),
      volume: ws.length ? sets.reduce((a, s) => a + s.reps * (s.w || 0), 0) : totalReps,
    };
  }).sort((a, b) => a.t - b.t);
}

// B-graph coloring. Weighted exercises with a rep target follow the
// double-progression cycle; everything else compares totals week over week.
function colorLiftSessions(sessions, meta) {
  const target = parseTargetLow(meta.targetReps);
  const useCycle = meta.type === "weighted" && !isNaN(target) && sessions.some((s) => s.weighted);
  if (useCycle) {
    let ref = null, cycleStart = 0, reached = false, reachedAt = 0, prevMode = null;
    return { mode: "cycle", target, sessions: sessions.map((s) => {
      if (!s.weighted) return { ...s, color: SUB, label: "No weight logged" };
      const hit = s.modeReps >= target;
      const reset = () => { ref = s.avgW; cycleStart = s.t; reached = hit; reachedAt = s.t; };
      let color, label;
      if (ref === null) { reset(); color = ACCENT; label = "Baseline session"; }
      else if (s.avgW > ref + 0.01) { reset(); color = ACCENT; label = hit ? "Weight up, target reps hit" : "Weight increased"; }
      else if (s.avgW < ref - 0.01) { reset(); color = REDC; label = "Average weight dropped"; }
      else if (prevMode !== null && s.modeReps < prevMode) { color = REDC; label = "Reps dropped at the same weight"; }
      else if (!reached && hit) { reached = true; reachedAt = s.t; color = ACCENT; label = "Hit target reps — ready to add weight"; }
      else {
        const w = Math.floor((s.t - (reached ? reachedAt : cycleStart)) / 7);
        color = w <= 1 ? ACCENT : w === 2 ? GOLD : w === 3 ? WHITE_C : REDC;
        label = reached ? (w <= 1 ? "At target — ready to add weight" : `At target ${w} wks without adding weight`) : (w <= 1 ? "Rebuilding reps at new weight" : `Rebuilding reps — ${w} wks at this weight`);
      }
      prevMode = s.modeReps;
      return { ...s, color, label };
    }) };
  }
  const metric = (s) => (meta.type === "weighted" ? s.volume : s.totalReps);
  let lastImprove = null;
  return { mode: "totals", target, sessions: sessions.map((s, i) => {
    let prior = null;
    for (let j = i - 1; j >= 0; j--) if (sessions[j].t <= s.t - 6) { prior = sessions[j]; break; }
    let color, label;
    if (!prior) { color = ACCENT; label = "Baseline session"; lastImprove = s.t; }
    else if (metric(s) > metric(prior)) { color = ACCENT; label = "Improved vs last week"; lastImprove = s.t; }
    else if (metric(s) < metric(prior)) { color = REDC; label = "Down vs last week"; }
    else {
      const w = Math.floor((s.t - (lastImprove !== null ? lastImprove : s.t)) / 7);
      color = w <= 1 ? GOLD : w === 2 ? WHITE_C : REDC;
      label = `Flat — ${w} wk${w === 1 ? "" : "s"} since last improvement`;
    }
    return { ...s, color, label };
  }) };
}

// Plan info for an exercise on a specific date (targets can differ by day,
// e.g. Incline DB Press is 3x8 on Wednesday but 3x10 on Sunday).
function getExerciseMetaOn(name, dateStr, planOverrides, anchorDate) {
  const d = new Date(dateStr + "T00:00:00");
  const ex = getEffectiveExercises(planOverrides, getWeekNumber(d, anchorDate), dayName(d)).find((e) => e.ExerciseName === name);
  if (ex) return { targetReps: ex.TargetReps, type: ex.ExerciseType || classifyExerciseType(name, ex.TargetReps) };
  return getExerciseMeta(name, planOverrides);
}

// Runs the progression rules separately for each rep target, so a heavier
// 3x8 day is only ever compared with earlier 3x8 days — never read as a
// "weight drop" against a lighter 3x10 day of the same exercise.
function colorLiftByTarget(sessions, name, planOverrides, anchorDate) {
  const groups = new Map();
  sessions.forEach((s) => {
    const meta = getExerciseMetaOn(name, idxToDateStr(s.t), planOverrides, anchorDate);
    const key = `${meta.type}|${meta.targetReps}`;
    if (!groups.has(key)) groups.set(key, { meta, list: [] });
    groups.get(key).list.push(s);
  });
  const out = [], targets = new Set();
  let anyCycle = false;
  groups.forEach(({ meta, list }) => {
    const c = colorLiftSessions(list, meta);
    if (c.mode === "cycle") { anyCycle = true; targets.add(c.target); }
    out.push(...c.sessions);
  });
  out.sort((a, b) => a.t - b.t);
  return { mode: anyCycle ? "cycle" : "totals", targets: [...targets].sort((a, b) => a - b), sessions: out };
}

function computeRunSeries(runLog) {
  const byDay = new Map();
  runLog.forEach((r) => {
    if (!DATE_RE.test(String(r.Date))) return;
    const dist = parseFloat(r.Distance);
    const time = parseClock(r.Time);
    let pace = parseClock(r.Pace);
    if (!(pace > 0) && dist > 0 && time > 0) pace = time / dist;
    const t = dayIndex(r.Date);
    byDay.set(t, { t, dist: dist > 0 && dist < 100 ? dist : NaN, pace: pace > 2 && pace < 40 ? pace : NaN });
  });
  const pts = [...byDay.values()].sort((a, b) => a.t - b.t);
  return { pace: pts.filter((p) => !isNaN(p.pace)).map((p) => ({ t: p.t, v: p.pace })), dist: pts.filter((p) => !isNaN(p.dist)).map((p) => ({ t: p.t, v: p.dist })) };
}

// ===================== SVG chart =====================
function niceTicks(min, max, count = 5) {
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 1, ticks: [0, 1] };
  if (max - min < 1e-9) { min -= 1; max += 1; }
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(8)));
  return { min: lo, max: hi, ticks };
}

// Monotone cubic tangents (same method as d3.curveMonotoneX). The curve
// passes through every real point and never overshoots above/below the two
// points a segment connects — so the curve can't invent highs or lows.
function monotoneTangents(p) {
  const n = p.length, m = new Array(n).fill(0);
  if (n < 2) return m;
  const slope = (a, b) => (b.x - a.x ? (b.y - a.y) / (b.x - a.x) : 0);
  if (n === 2) { m[0] = m[1] = slope(p[0], p[1]); return m; }
  const sgn = (v) => (v < 0 ? -1 : 1);
  for (let i = 1; i < n - 1; i++) {
    const h0 = p[i].x - p[i - 1].x, h1 = p[i + 1].x - p[i].x;
    const s0 = slope(p[i - 1], p[i]), s1 = slope(p[i], p[i + 1]);
    const q = (s0 * h1 + s1 * h0) / (h0 + h1 || 1);
    m[i] = (sgn(s0) + sgn(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(q)) || 0;
  }
  const end = (a, b, t) => { const h = b.x - a.x; return h ? (3 * (b.y - a.y) / h - t) / 2 : t; };
  m[0] = end(p[0], p[1], m[1]);
  m[n - 1] = end(p[n - 2], p[n - 1], m[n - 2]);
  return m;
}

function SvgChart({ series, left, right, xLabel, bands = [], refLines = [] }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 640, h: 300 });
  const uid = ("c" + useId()).replace(/[^a-zA-Z0-9]/g, "");
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () => { const r = el.getBoundingClientRect(); if (r.width > 0 && r.height > 0) setSize({ w: r.width, h: r.height }); };
    update();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const allPts = series.flatMap((s) => s.points);
  let body = null;
  if (!allPts.length) {
    body = <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: SUB, fontSize: 15 }}>Not enough data yet</div>;
  } else {
    const W = size.w, H = size.h;
    const m = { l: left ? 64 : 16, r: right ? 64 : 16, t: 12, b: xLabel ? 48 : 30 };
    const pw = Math.max(10, W - m.l - m.r), ph = Math.max(10, H - m.t - m.b);
    let tMin = Infinity, tMax = -Infinity;
    allPts.forEach((p) => { tMin = Math.min(tMin, p.t); tMax = Math.max(tMax, p.t); });
    if (tMax - tMin < 1) { tMin -= 1; tMax += 1; }
    const xs = (t) => m.l + ((t - tMin) / (tMax - tMin)) * pw;
    const axisInfo = (side, cfg) => {
      if (!cfg) return null;
      const vals = [];
      series.filter((s) => (s.axis || "left") === side).forEach((s) => s.points.forEach((p) => vals.push(p.v)));
      if (!vals.length) return null;
      bands.filter((b) => (b.axis || "left") === side).forEach((b) => vals.push(b.from, b.to));
      refLines.filter((r) => (r.axis || "left") === side).forEach((r) => vals.push(r.value));
      if (cfg.min !== undefined) vals.push(cfg.min);
      if (cfg.max !== undefined) vals.push(cfg.max);
      let lo = Math.min(...vals), hi = Math.max(...vals);
      const pad = (hi - lo) * 0.06 || 1;
      lo -= pad; hi += pad;
      if (cfg.clampMin !== undefined) lo = Math.max(cfg.clampMin, lo);
      if (cfg.clampMax !== undefined) hi = Math.min(cfg.clampMax, hi);
      const nt = niceTicks(lo, hi, 5);
      const ys = (v) => (cfg.reversed ? m.t + ((v - nt.min) / (nt.max - nt.min)) * ph : m.t + ph - ((v - nt.min) / (nt.max - nt.min)) * ph);
      return { ...nt, ys, cfg };
    };
    const L = axisInfo("left", left), R = axisInfo("right", right);
    const axisFor = (side) => ((side || "left") === "left" ? L : R);

    const span = tMax - tMin;
    const maxTicks = Math.max(2, Math.floor(pw / 72));
    const step = [1, 2, 3, 7, 14, 28, 56, 91, 182, 364].find((s) => span / s <= maxTicks) || 364;
    const xt = [];
    for (let t = Math.ceil(tMin / step) * step; t <= tMax; t += step) xt.push(t);

    const defs = [], segs = [];
    series.forEach((s, si) => {
      const ax = axisFor(s.axis);
      if (!ax) return;
      const pts = s.points;
      const op = s.opacity !== undefined ? s.opacity : 1;
      if (!s.noLine) {
        const px = pts.map((p) => ({ x: xs(p.t), y: ax.ys(p.v) }));
        // Tangents come from the solid (real) points only, so a projected
        // point can never bend the shape of the real line.
        const firstDashed = pts.findIndex((p) => p.dashed);
        const solidN = firstDashed === -1 ? pts.length : firstDashed;
        const tan = s.curve !== false ? monotoneTangents(px.slice(0, solidN)) : null;
        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i], p2 = pts[i + 1];
          const { x: x1, y: y1 } = px[i], { x: x2, y: y2 } = px[i + 1];
          const c1 = p1.color || s.color, c2 = p2.color || s.color;
          // Extra color stops inside a segment (e.g. the rainbow flowing
          // across a multi-day gap between weigh-ins).
          const mids = [];
          if (s.colorAt && x2 - x1 > 0.5) for (let t = Math.floor(p1.t) + 1; t < p2.t; t++) { const c = s.colorAt(t, p1, p2); if (c) mids.push({ o: (xs(t) - x1) / (x2 - x1), c }); }
          let stroke = c1;
          if ((c1 !== c2 || mids.length) && x2 - x1 > 0.01) {
            const id = `${uid}g${si}x${i}`;
            defs.push(<linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={0} x2={x2} y2={0}><stop offset="0" stopColor={c1} />{mids.map((m, k) => <stop key={k} offset={m.o} stopColor={m.c} />)}<stop offset="1" stopColor={c2} /></linearGradient>);
            stroke = `url(#${id})`;
          }
          const dashed = p2.dashed;
          const common = { stroke, strokeWidth: s.width || 3, strokeLinecap: "round", fill: "none", opacity: op, strokeDasharray: dashed ? "7 7" : undefined };
          if (tan && !dashed && i + 1 < solidN) {
            const dx = (x2 - x1) / 3;
            segs.push(<path key={`${si}l${i}`} d={`M${x1},${y1}C${x1 + dx},${y1 + tan[i] * dx},${x2 - dx},${y2 - tan[i + 1] * dx},${x2},${y2}`} {...common} />);
          } else {
            segs.push(<line key={`${si}l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} {...common} />);
          }
        }
      }
      if (s.dots) pts.forEach((p, i) => segs.push(<circle key={`${si}d${i}`} cx={xs(p.t)} cy={ax.ys(p.v)} r={s.dotR || 4} fill={s.dotColor || p.color || s.color} opacity={op} />));
    });

    const axisText = (ax, side) => ax.ticks.map((v) => (
      <text key={`${side}t${v}`} x={side === "left" ? m.l - 8 : m.l + pw + 8} y={ax.ys(v)} fill={ax.cfg.color || SUB} fontSize={12} textAnchor={side === "left" ? "end" : "start"} dominantBaseline="middle">{ax.cfg.format ? ax.cfg.format(v) : v}</text>
    ));
    body = (
      <svg width={W} height={H} style={{ display: "block" }}>
        <defs>{defs}</defs>
        {bands.map((b, i) => { const ax = axisFor(b.axis); if (!ax) return null; const y1 = ax.ys(b.from), y2 = ax.ys(b.to); return <rect key={`b${i}`} x={m.l} width={pw} y={Math.min(y1, y2)} height={Math.abs(y2 - y1)} fill={b.color} opacity={0.12} />; })}
        {(L || R).ticks.map((v) => <line key={`g${v}`} x1={m.l} x2={m.l + pw} y1={(L || R).ys(v)} y2={(L || R).ys(v)} stroke={LINE} strokeDasharray="3 5" />)}
        {xt.map((t) => <line key={`gx${t}`} x1={xs(t)} x2={xs(t)} y1={m.t} y2={m.t + ph} stroke={LINE} strokeDasharray="3 5" opacity={0.6} />)}
        {refLines.map((r, i) => { const ax = axisFor(r.axis); if (!ax) return null; return <line key={`r${i}`} x1={m.l} x2={m.l + pw} y1={ax.ys(r.value)} y2={ax.ys(r.value)} stroke={SUB} strokeWidth={1.5} opacity={0.7} />; })}
        {segs}
        {L && axisText(L, "left")}
        {R && axisText(R, "right")}
        {xt.map((t) => <text key={`xt${t}`} x={xs(t)} y={m.t + ph + 18} fill={SUB} fontSize={12} textAnchor="middle">{idxLabel(t)}</text>)}
        {xLabel && <text x={m.l + pw / 2} y={H - 6} fill={SUB} fontSize={13} textAnchor="middle">{xLabel}</text>}
        {L && L.cfg.label && <text transform={`translate(15 ${m.t + ph / 2}) rotate(-90)`} fill={L.cfg.color || SUB} fontSize={13} textAnchor="middle">{L.cfg.label}</text>}
        {R && R.cfg.label && <text transform={`translate(${W - 15} ${m.t + ph / 2}) rotate(90)`} fill={R.cfg.color || SUB} fontSize={13} textAnchor="middle">{R.cfg.label}</text>}
      </svg>
    );
  }
  return <div ref={wrapRef} style={{ width: "100%", height: "100%", minHeight: 0, overflow: "hidden" }}>{body}</div>;
}

function LegendChip({ color, label, dashed, rainbow, dot }) {
  const swatch = rainbow ? `linear-gradient(90deg, ${RAINBOW.join(", ")})` : dashed ? `repeating-linear-gradient(90deg, ${SUB} 0 5px, transparent 5px 9px)` : color;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: SUB, whiteSpace: "nowrap" }}>
      <span style={{ width: dot ? 8 : 18, height: dot ? 8 : 4, borderRadius: dot ? 4 : 2, background: swatch }} />{label}
    </span>
  );
}

// ===================== Progress slide =====================
function ProgressSlide({ dailyLog, exerciseLog, runLog, anchorDate, planOverrides, abSeconds, weightWindow = 21 }) {
  const todayIdx = dayIndex(fmtDate(new Date()));
  const liftNames = useMemo(() => [...new Set(exerciseLog.filter((r) => parseFloat(r.Reps) > 0 && r.ExerciseName).map((r) => r.ExerciseName))].sort(), [exerciseLog]);
  const [tab, setTab] = useState(() => ["weight", "completion", "exercise", "run"][Math.floor(Math.random() * 4)]);
  const [exSel, setExSel] = useState(() => (liftNames.length ? liftNames[Math.floor(Math.random() * liftNames.length)] : ""));
  useEffect(() => { if (liftNames.length && !liftNames.includes(exSel)) setExSel(liftNames[Math.floor(Math.random() * liftNames.length)]); }, [liftNames]);

  const hasB = tab === "completion" || tab === "exercise";
  const [ver, setVer] = useState("A");
  useEffect(() => {
    setVer("A");
    if (!hasB) return undefined;
    const ms = Math.max(3, Number(abSeconds) || 15) * 1000;
    const id = setInterval(() => setVer((v) => (v === "A" ? "B" : "A")), ms);
    return () => clearInterval(id);
  }, [tab, exSel, hasB, abSeconds]);

  const weight = useMemo(() => (tab === "weight" ? computeWeightAnalysis(dailyLog, todayIdx, weightWindow) : null), [tab, dailyLog, todayIdx, weightWindow]);
  const cons = useMemo(() => (tab === "completion" ? computeConsistency(dailyLog, exerciseLog, anchorDate, todayIdx) : null), [tab, dailyLog, exerciseLog, anchorDate, todayIdx]);
  const lift = useMemo(() => {
    if (tab !== "exercise" || !exSel) return null;
    const meta = getExerciseMeta(exSel, planOverrides);
    const sessions = buildLiftSessions(exerciseLog, exSel);
    return { meta, sessions, colored: colorLiftByTarget(sessions, exSel, planOverrides, anchorDate) };
  }, [tab, exSel, exerciseLog, planOverrides, anchorDate]);
  const run = useMemo(() => (tab === "run" ? computeRunSeries(runLog) : null), [tab, runLog]);

  const tabs = [{ id: "weight", label: "Body weight" }, { id: "completion", label: "Consistency" }, { id: "exercise", label: "Lift progress" }, { id: "run", label: "Run pace" }];
  let title = "", status = null, statusColor = SUB, legend = [], chart = null;

  if (tab === "weight" && weight) {
    title = `Body weight · ${weightWindow}-day trend · ${weight.maintenance ? "Maintenance" : "Cutting"}`;
    if (weight.lastReal) {
      const l = weight.latest, r = weight.lastReal;
      statusColor = l.rainbow ? ACCENT : l.color;
      const rate = l.slopeWk !== null ? `trend ${signed(l.slopeWk)} lb/wk` : "trend —";
      status = `Last weigh-in ${r.v.toFixed(1)} lb (${idxLabel(r.t)}) · ${rate} · ${l.label}${l.dashed ? ` · dashed = projection to today` : ""}`;
    } else status = "Log a few weigh-ins to build the trend.";
    legend = weight.maintenance
      ? [<LegendChip key="r" rainbow label="In range" />, <LegendChip key="g" color={GOLD} label="1–2 lb over" />, <LegendChip key="rd" color={REDC} label="Under 175 / 2+ lb over" />]
      : [<LegendChip key="b" color={ACCENT} label="1–2 lb/wk" />, <LegendChip key="g" color={GOLD} label="Under 1 lb/wk" />, <LegendChip key="rd" color={REDC} label="Stalled / gaining" />, <LegendChip key="w" color={WHITE_C} label="Over 2 lb/wk" />];
    if (weight.line.some((p) => p.color === SUB)) legend.push(<LegendChip key="n" color={SUB} label="Not enough data for a trend" />);
    legend.push(<LegendChip key="p" dashed label="Projected (today only)" />, <LegendChip key="d" dot color={INK} label="Weigh-ins" />);
    const rb = weight.rainbowMap;
    chart = <SvgChart series={[
      { points: weight.line, width: 4, curve: true, colorAt: (t, p1, p2) => (p1.rainbow && p2.rainbow ? rb.get(t) : null) },
      { points: weight.raw, noLine: true, dots: true, dotColor: INK, dotR: 3, opacity: 0.85 },
    ]} left={{ label: "Weight (lb)", format: (v) => Math.round(v) }} xLabel="Date" bands={[{ from: GOAL_LOW, to: GOAL_HIGH, color: ACCENT }]} />;
  } else if (tab === "completion" && cons) {
    if (ver === "A") {
      title = "Consistency · A · 7-day completion rate (scheduled days)";
      const l = cons.level[cons.level.length - 1];
      if (l) { status = `${Math.round(l.v)}% of scheduled sessions · ${l.label}`; statusColor = l.color; }
      legend = [<LegendChip key="b" color={ACCENT} label="90%+" />, <LegendChip key="g" color={GOLD} label="70–89%" />, <LegendChip key="r" color={REDC} label="Under 70%" />];
      chart = <SvgChart series={[{ points: cons.level, width: 4 }]} left={{ format: (v) => `${Math.round(v)}%`, min: 0, max: 100, clampMin: 0, clampMax: 100 }} xLabel="Date" bands={[{ from: 90, to: 100, color: ACCENT }]} />;
    } else {
      title = "Consistency · B · Rate of change (points per week)";
      const l = cons.rate[cons.rate.length - 1];
      if (l) { status = `${signed(l.v, 0)} pts/wk · ${l.label}`; statusColor = l.color; }
      legend = [<LegendChip key="b" color={ACCENT} label="Rising / holding 90%+" />, <LegendChip key="g" color={GOLD} label="Flat" />, <LegendChip key="r" color={REDC} label="Falling" />];
      chart = <SvgChart series={[{ points: cons.rate, width: 4 }]} left={{ format: (v) => signed(v, 0) }} xLabel="Date" refLines={[{ value: 0 }]} />;
    }
  } else if (tab === "exercise") {
    if (!lift || !lift.sessions.length) {
      title = "Lift progress";
      status = "No lifts logged yet.";
      chart = <SvgChart series={[]} />;
    } else {
      const { meta, sessions, colored } = lift;
      const last = sessions[sessions.length - 1];
      const isTime = meta.type === "time", isReps = meta.type === "reps";
      if (ver === "A") {
        title = `${exSel} · A · Raw performance`;
        if (isTime) {
          status = `Last session: ${formatSecondsClock(last.totalReps)} total over ${last.sets} sets`;
          legend = [<LegendChip key="a" color={GOLD} label="Total time" />, <LegendChip key="b" color={ACCENT} label="Longest hold" />];
          chart = <SvgChart series={[{ points: sessions.map((s) => ({ t: s.t, v: s.totalReps })), color: GOLD, dots: true }, { axis: "right", points: sessions.map((s) => ({ t: s.t, v: s.longest })), color: ACCENT, dots: true }]} left={{ label: "Total time (s)", color: GOLD }} right={{ label: "Longest hold (s)", color: ACCENT }} xLabel="Date" />;
        } else if (isReps || !sessions.some((s) => s.weighted)) {
          status = `Last session: ${last.totalReps} total reps over ${last.sets} sets`;
          legend = [<LegendChip key="a" color={GOLD} label="Total reps" />, <LegendChip key="b" color={ACCENT} label="Sets" />];
          chart = <SvgChart series={[{ points: sessions.map((s) => ({ t: s.t, v: s.totalReps })), color: GOLD, dots: true }, { axis: "right", points: sessions.map((s) => ({ t: s.t, v: s.sets })), color: ACCENT, dots: true }]} left={{ label: "Total reps", color: GOLD }} right={{ label: "Sets", color: ACCENT }} xLabel="Date" />;
        } else {
          status = `Last session: ${last.avgW.toFixed(1)} lb avg × ${last.avgReps.toFixed(1)} reps avg · ${last.sets} sets`;
          legend = [<LegendChip key="a" color={GOLD} label="Avg weight" />, <LegendChip key="b" color={ACCENT} label="Avg reps / set" />];
          chart = <SvgChart series={[{ points: sessions.filter((s) => s.weighted).map((s) => ({ t: s.t, v: s.avgW })), color: GOLD, dots: true }, { axis: "right", points: sessions.map((s) => ({ t: s.t, v: s.avgReps })), color: ACCENT, dots: true }]} left={{ label: "Avg weight (lb)", color: GOLD, format: (v) => Math.round(v * 10) / 10 }} right={{ label: "Avg reps / set", color: ACCENT }} xLabel="Date" />;
        }
      } else {
        const cycle = colored.mode === "cycle";
        const metricLabel = isTime ? "Total time (s)" : isReps || meta.type !== "weighted" || !sessions.some((s) => s.weighted) ? "Total reps" : "Volume load (lb)";
        title = `${exSel} · B · ${cycle ? `Progression cycle (target ${colored.targets.join(" / ")} reps)` : "Week-over-week total"}`;
        const lc = colored.sessions[colored.sessions.length - 1];
        status = lc.label;
        statusColor = lc.color;
        legend = cycle
          ? [<LegendChip key="b" color={ACCENT} label="On track" />, <LegendChip key="g" color={GOLD} label="2 wks" />, <LegendChip key="w" color={WHITE_C} label="3 wks" />, <LegendChip key="r" color={REDC} label="4+ wks / regressed" />]
          : [<LegendChip key="b" color={ACCENT} label="Improved" />, <LegendChip key="g" color={GOLD} label="Flat 1 wk" />, <LegendChip key="w" color={WHITE_C} label="Flat 2 wks" />, <LegendChip key="r" color={REDC} label="3+ wks / down" />];
        const val = (s) => (metricLabel === "Volume load (lb)" ? s.volume : s.totalReps);
        chart = <SvgChart series={[{ points: colored.sessions.map((s) => ({ t: s.t, v: val(s), color: s.color })), width: 4, dots: true }]} left={{ label: metricLabel, format: (v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : Math.round(v)) }} xLabel="Date" />;
      }
    }
  } else if (tab === "run" && run) {
    title = "Run · Pace and distance";
    const lp = run.pace[run.pace.length - 1], ld = run.dist[run.dist.length - 1];
    status = lp || ld ? `Latest: ${ld ? `${ld.v.toFixed(2)} mi` : "—"}${lp ? ` @ ${formatPace(lp.v)}/mi` : ""}` : "No runs logged yet.";
    legend = [<LegendChip key="p" color={GOLD} label="Pace (faster is higher)" />, <LegendChip key="d" color={ACCENT} label="Distance" />];
    chart = <SvgChart series={[{ points: run.pace, color: GOLD, dots: true }, { axis: "right", points: run.dist, color: ACCENT, dots: true }]} left={{ label: "Pace (min/mi)", color: GOLD, reversed: true, format: formatPace }} right={{ label: "Distance (mi)", color: ACCENT, format: (v) => Math.round(v * 10) / 10 }} xLabel="Date" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 28px 40px 28px", gap: 10, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginRight: 6 }}>Progress</div>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${tab === t.id ? ACCENT : LINE}`, background: tab === t.id ? ACCENT + "22" : "transparent", color: tab === t.id ? ACCENT : SUB, fontSize: 13, cursor: "pointer" }}>{t.label}</button>
        ))}
        {tab === "exercise" && liftNames.length > 0 && (
          <select value={exSel} onChange={(e) => setExSel(e.target.value)} style={{ padding: 8, borderRadius: 8, background: CARD, color: INK, border: `1px solid ${LINE}`, maxWidth: 240 }}>
            {liftNames.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        {hasB && (
          <div style={{ display: "flex", borderRadius: 20, border: `1px solid ${LINE}`, overflow: "hidden", marginLeft: "auto" }}>
            {["A", "B"].map((v) => <button key={v} onClick={() => setVer(v)} style={{ padding: "6px 14px", border: "none", background: ver === v ? GOLD + "33" : "transparent", color: ver === v ? GOLD : SUB, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{v}</button>)}
          </div>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
      {status && <div style={{ fontSize: 14, color: statusColor, fontWeight: 600 }}>{status}</div>}
      <div style={{ flex: "1 1 0", minHeight: 0 }}>{chart}</div>
      {legend.length > 0 && <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>{legend}</div>}
    </div>
  );
}

const SLIDE_DEFS = [{ id: "today", label: "Today" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "progress", label: "Progress" }];

function SettingsModal({ settings, onSave, onClose, onLoadDemo, onOpenPlanEditor }) {
  const [url, setUrl] = useState(settings.apiUrl);
  const [key, setKey] = useState(settings.apiKey);
  const [slides, setSlides] = useState(settings.slides);
  const [seconds, setSeconds] = useState(settings.slideSeconds);
  const [enabled, setEnabled] = useState(settings.slideshowEnabled);
  const [refreshMin, setRefreshMin] = useState(settings.refreshMinutes || 3);
  const [abSecs, setAbSecs] = useState(settings.abCycleSeconds || 15);
  const [weightWin, setWeightWin] = useState(settings.weightWindowDays || 21);

  const toggleSlide = (id) => setSlides((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: "24px 24px 44px 24px", width: 380, maxHeight: "88%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Settings</div>
          <X size={20} style={{ cursor: "pointer", color: SUB }} onClick={onClose} />
        </div>
        <label style={{ fontSize: 12, color: SUB }}>Apps Script web app URL (ends in /exec)</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }} />
        <label style={{ fontSize: 12, color: SUB }}>Secret key</label>
        <input value={key} onChange={(e) => setKey(e.target.value)} style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }} />
        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 6, paddingTop: 12 }}>
          <label style={{ fontSize: 12, color: SUB, display: "block", marginBottom: 8 }}>Slides to display</label>
          {SLIDE_DEFS.map((s) => (
            <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 14 }}>
              <input type="checkbox" checked={slides.includes(s.id)} onChange={() => toggleSlide(s.id)} /> {s.label}
            </label>
          ))}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginTop: 6 }}>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Auto-advance slideshow
        </label>
        <div>
          <label style={{ fontSize: 12, color: SUB }}>Seconds per slide</label>
          <input type="number" min={5} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} disabled={!enabled}
            style={{ width: "100%", padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK, opacity: enabled ? 1 : 0.5, marginTop: 4 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: SUB }}>Seconds between graph versions A / B (Progress slide)</label>
          <input type="number" min={3} value={abSecs} onChange={(e) => setAbSecs(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK, marginTop: 4 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: SUB }}>Body weight trend window (days) — shorter reacts faster but colors get unreliable below ~14</label>
          <input type="number" min={5} max={60} value={weightWin} onChange={(e) => setWeightWin(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK, marginTop: 4 }} />
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 6, paddingTop: 12 }}>
          <label style={{ fontSize: 12, color: SUB }}>Auto-refresh from sheet every (minutes)</label>
          <input type="number" min={1} value={refreshMin} onChange={(e) => setRefreshMin(Number(e.target.value))}
            style={{ width: "100%", padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK, marginTop: 4 }} />
        </div>

        <button onClick={() => onSave({ apiUrl: url, apiKey: key, anchorDate: CYCLE_ANCHOR, slides: slides.length ? slides : ["today"], slideSeconds: seconds || 150, slideshowEnabled: enabled, refreshMinutes: refreshMin || 3, abCycleSeconds: abSecs || 15, weightWindowDays: Math.min(60, Math.max(5, weightWin || 21)) })}
          style={{ padding: 12, borderRadius: 10, border: "none", background: ACCENT, color: "#06211D", fontWeight: 700, marginTop: 8 }}>Save</button>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 4, paddingTop: 12 }}>
          <button onClick={onOpenPlanEditor} style={{ width: "100%", padding: 11, borderRadius: 10, border: `1px solid ${ACCENT}`, background: "transparent", color: ACCENT, fontWeight: 700 }}>Edit workouts</button>
          <div style={{ fontSize: 10, color: SUB, marginTop: 6 }}>Change which lifts happen on a given day of the cycle. Only affects future occurrences — past logs stay as they were.</div>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}`, marginTop: 4, paddingTop: 12 }}>
          <button onClick={onLoadDemo} style={{ width: "100%", padding: 11, borderRadius: 10, border: `1px solid ${GOLD}`, background: "transparent", color: GOLD, fontWeight: 700 }}>Load sample data (for testing charts)</button>
          <div style={{ fontSize: 10, color: SUB, marginTop: 6 }}>Fills the Progress slide with ~10 weeks of fake history, stored locally only. Doesn't touch your Sheet.</div>
        </div>
      </div>
    </div>
  );
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function PlanEditorModal({ planOverrides, onSave, onClose }) {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState("Monday");
  const [rows, setRows] = useState(() => getEffectiveExercises(planOverrides, 1, "Monday").map((e) => ({ ExerciseName: e.ExerciseName, TargetSets: e.TargetSets, TargetReps: e.TargetReps, ExerciseType: e.ExerciseType || "weighted" })));

  const loadDay = (wk, dn) => setRows(getEffectiveExercises(planOverrides, wk, dn).map((e) => ({ ExerciseName: e.ExerciseName, TargetSets: e.TargetSets, TargetReps: e.TargetReps, ExerciseType: e.ExerciseType || "weighted" })));

  const changeWeek = (w) => { setWeek(w); loadDay(w, day); };
  const changeDay = (d) => { setDay(d); loadDay(week, d); };

  const updateRow = (i, field, val) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));
  const addRow = () => setRows((r) => [...r, { ExerciseName: "", TargetSets: "3", TargetReps: "10", ExerciseType: "weighted" }]);

  const save = () => { onSave(planKey(week, day), rows.filter((r) => r.ExerciseName.trim())); };
  const resetDefault = () => { onSave(planKey(week, day), null); loadDay(week, day); };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: "22px 22px 40px 22px", width: 380, maxHeight: "88%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>Edit workouts</div>
          <X size={20} style={{ cursor: "pointer", color: SUB }} onClick={onClose} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={week} onChange={(e) => changeWeek(Number(e.target.value))} style={{ flex: 1, padding: 8, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }}>
            <option value={1}>Week 1</option><option value={2}>Week 2</option>
          </select>
          <select value={day} onChange={(e) => changeDay(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }}>
            {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 8, borderBottom: `1px solid ${LINE}` }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input value={row.ExerciseName} onChange={(e) => updateRow(i, "ExerciseName", e.target.value)} placeholder="exercise name" style={{ flex: 3, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
              <input value={row.TargetSets} onChange={(e) => updateRow(i, "TargetSets", e.target.value)} placeholder="sets" style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
              <input value={row.TargetReps} onChange={(e) => updateRow(i, "TargetReps", e.target.value)} placeholder="reps" style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
              <Trash2 size={16} style={{ color: REDC, cursor: "pointer", flexShrink: 0 }} onClick={() => removeRow(i)} />
            </div>
            <select value={row.ExerciseType} onChange={(e) => updateRow(i, "ExerciseType", e.target.value)} style={{ padding: 6, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: SUB, fontSize: 12 }}>
              <option value="weighted">Reps + weight</option>
              <option value="reps">Reps only (bodyweight)</option>
              <option value="time">Time-based (e.g. plank)</option>
            </select>
          </div>
        ))}
        <button onClick={addRow} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GOLD, background: "none", border: "none", cursor: "pointer" }}>
          <Plus size={14} /> Add exercise
        </button>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={save} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: ACCENT, color: "#06211D", fontWeight: 700 }}>Save for this day</button>
          <button onClick={resetDefault} style={{ padding: 12, borderRadius: 10, border: `1px solid ${LINE}`, background: "transparent", color: SUB, fontWeight: 700 }}>Reset to default</button>
        </div>
        <div style={{ fontSize: 10, color: SUB }}>Changes apply the next time Week {week} {day} comes around, and every time after. Past logs for this day are untouched.</div>
      </div>
    </div>
  );
}

function LogEntryView({ date, setDate, anchorDate, dailyLog, exerciseLog, runLog, queue, planOverrides, isEditingHistorical, onDone, onSave, onSwipeSave, onLocalSave, onSync, syncing, pendingCount }) {
  const wk = getWeekNumber(date, anchorDate);
  const dn = dayName(date);
  const dateStr = fmtDate(date);
  const planDay = PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dn);
  const exercises = useMemo(() => getEffectiveExercises(planOverrides, wk, dn), [wk, dn, planOverrides]);
  const isRunDay = ["Run", "Run+Mobility", "HIIT"].includes(planDay?.Type);
  const existingDaily = dailyLog.find((r) => r.Date === dateStr);
  const effExerciseLog = useMemo(() => effectiveExerciseLog(exerciseLog, queue), [exerciseLog, queue]);
  const swipeTouchX = useRef(null);

  const isRestDay = planDay?.Type === "Rest";

  const [status, setStatus] = useState(existingDaily?.CompletionStatus || "None");
  const [statusManual, setStatusManual] = useState(isManualFlag(existingDaily?.StatusManual));
  const [weight, setWeight] = useState(existingDaily?.Weight || "");
  const [notes, setNotes] = useState(existingDaily?.Notes || "");
  const [sets, setSets] = useState({});
  const [runData, setRunData] = useState({ Distance: "", Time: "", Pace: "" });
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState({});
  const [timerRunning, setTimerRunning] = useState({});
  const timerIntervals = useRef({});
  // True once anything has been changed since this day was loaded or last
  // saved. Gates every automatic local save, so browsing days never creates
  // queue entries — only real edits do.
  const editedRef = useRef(false);
  const markEdited = () => { editedRef.current = true; };

  useEffect(() => () => { Object.values(timerIntervals.current).forEach(clearInterval); }, []);

  useEffect(() => {
    // Anything still sitting in the local sync queue for this date is the most
    // up-to-date version of that data — layer it on top of confirmed synced data
    // so reopening a day never looks like the entry vanished while unsynced.
    const pendingForDate = (queue || []).filter((item) => item.data.Date === dateStr);
    const pendingDaily = [...pendingForDate].reverse().find((i) => i.action === "logDaily")?.data;
    const pendingRun = [...pendingForDate].reverse().find((i) => i.action === "logRun")?.data;
    const pendingExercise = pendingForDate.filter((i) => i.action === "logExercise");

    const initial = {};
    exercises.forEach((ex) => {
      const existingRows = exerciseLog.filter((r) => r.Date === dateStr && r.ExerciseName === ex.ExerciseName);
      const pendingRows = pendingExercise.filter((i) => i.data.ExerciseName === ex.ExerciseName).map((i) => i.data);
      const bySet = {};
      existingRows.forEach((r) => { bySet[Number(r.SetNumber)] = { reps: String(r.Reps ?? ""), weight: String(r.Weight ?? "") }; });
      pendingRows.forEach((r) => { bySet[Number(r.SetNumber)] = { reps: String(r.Reps ?? ""), weight: String(r.Weight ?? "") }; });
      const maxSet = Math.max(parseTargetSets(ex.TargetSets), ...Object.keys(bySet).map(Number), 0);
      initial[ex.ExerciseName] = Array.from({ length: maxSet }, (_, i) => bySet[i + 1] || { reps: "", weight: "" });
    });
    setSets(initial);

    // Manual override is only honored when it was explicitly saved as one.
    // Otherwise the status is recomputed from the sets every time.
    const dailyForDate = pendingDaily || dailyLog.find((r) => r.Date === dateStr);
    setStatusManual(isManualFlag(dailyForDate?.StatusManual));
    setStatus(dailyForDate?.CompletionStatus || "None");
    setWeight(dailyForDate?.Weight || "");
    setNotes(dailyForDate?.Notes || "");

    const existingRun = pendingRun || runLog.find((r) => r.Date === dateStr);
    setRunData(existingRun ? { Distance: existingRun.Distance || "", Time: existingRun.Time || "", Pace: existingRun.Pace || "" } : { Distance: "", Time: "", Pace: "" });

    setTimerElapsed({}); setTimerRunning({});
    Object.values(timerIntervals.current).forEach(clearInterval);
    timerIntervals.current = {};
    editedRef.current = false;
  }, [dateStr]);

  // None until a set is logged, Partial once any set has reps, Complete once
  // every set of every exercise has reps. Skipped while a manual pick stands.
  useEffect(() => {
    if (!statusManual) setStatus(computeAutoStatus(sets, runData, isRunDay, isRestDay));
  }, [sets, runData, isRunDay, isRestDay, statusManual]);

  const notesPlaceholder = getLastNoteForSameWeekday(dailyLog, dateStr);

  const addSetRow = (exName) => { markEdited(); setSets((s) => ({ ...s, [exName]: [...(s[exName] || []), { reps: "", weight: "" }] })); };
  const updateSetRow = (exName, i, field, val) => { markEdited(); setSets((s) => ({ ...s, [exName]: s[exName].map((r, idx) => (idx === i ? { ...r, [field]: val } : r)) })); };
  const removeSetRow = (exName, i) => { markEdited(); setSets((s) => ({ ...s, [exName]: s[exName].filter((_, idx) => idx !== i) })); };
  const setRunField = (field, val) => {
    markEdited();
    setRunData((prev) => { const next = { ...prev, [field]: val }; next.Pace = computePace(next.Distance, next.Time); return next; });
  };

  const toggleTimer = (exName, i) => {
    const key = `${exName}__${i}`;
    if (timerRunning[key]) {
      clearInterval(timerIntervals.current[key]);
      delete timerIntervals.current[key];
      setTimerRunning((r) => ({ ...r, [key]: false }));
      const secs = timerElapsed[key] || 0;
      updateSetRow(exName, i, "reps", String(secs));
    } else {
      const startAt = Number(sets[exName]?.[i]?.reps) || 0;
      setTimerElapsed((e) => ({ ...e, [key]: startAt }));
      setTimerRunning((r) => ({ ...r, [key]: true }));
      timerIntervals.current[key] = setInterval(() => {
        setTimerElapsed((e) => ({ ...e, [key]: (e[key] || 0) + 1 }));
      }, 1000);
    }
  };

  const handleNotesFocus = () => { if (!notes) setNotes("• "); };
  const handleNotesKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    markEdited();
    const el = e.target;
    const start = el.selectionStart, end = el.selectionEnd;
    const insertion = "\n• ";
    const newValue = notes.slice(0, start) + insertion + notes.slice(end);
    setNotes(newValue);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + insertion.length; });
  };

  const buildItems = () => {
    const items = [{ action: "logDaily", data: { Date: dateStr, Weight: weight, CompletionStatus: status, StatusManual: statusManual ? "TRUE" : "FALSE", Notes: notes } }];
    Object.entries(sets).forEach(([exName, rows]) => {
      rows.forEach((r, i) => { if (r.reps || r.weight) items.push({ action: "logExercise", data: { Date: dateStr, ExerciseName: exName, SetNumber: i + 1, Reps: r.reps, Weight: r.weight } }); });
    });
    if (isRunDay && (runData.Distance || runData.Time)) items.push({ action: "logRun", data: { Date: dateStr, ...runData } });
    return items;
  };

  // Always-current references so timers/listeners never save stale data.
  const buildItemsRef = useRef(buildItems);
  buildItemsRef.current = buildItems;
  const onLocalSaveRef = useRef(onLocalSave);
  onLocalSaveRef.current = onLocalSave;
  const flushLocalRef = useRef(() => {});
  flushLocalRef.current = () => {
    if (!editedRef.current) return;
    editedRef.current = false;
    onLocalSaveRef.current(buildItemsRef.current());
  };

  // Local autosave every 60s, plus immediately when the app is backgrounded
  // (switching apps) or this screen closes.
  useEffect(() => {
    const id = setInterval(() => flushLocalRef.current(), 60000);
    const onVis = () => { if (document.visibilityState === "hidden") flushLocalRef.current(); };
    const onPageHide = () => flushLocalRef.current();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onPageHide);
      flushLocalRef.current();
    };
  }, []);

  // Any date change saves the current day locally first.
  const goToDate = (newDate) => {
    if (editedRef.current) { editedRef.current = false; onSwipeSave(buildItems()); }
    setDate(newDate);
  };

  const handleSave = async () => {
    setSaving(true);
    editedRef.current = false;
    const result = await onSave(buildItems());
    setSaving(false);
    if (result.fail === 0) { setJustSaved(true); setTimeout(() => setJustSaved(false), 2000); }
    if (isEditingHistorical) onDone();
  };

  const handleSync = async () => {
    const items = editedRef.current ? buildItems() : null;
    editedRef.current = false;
    await onSync(items);
  };

  return (
    <div style={{ padding: "20px 20px calc(20px + env(safe-area-inset-bottom, 0px) + 100px) 20px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      {isEditingHistorical && (
        <button onClick={onDone} style={{ display: "flex", alignItems: "center", gap: 4, alignSelf: "flex-start", fontSize: 13, color: SUB, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
      )}
      <input type="date" value={dateStr} onChange={(e) => { if (e.target.value) goToDate(new Date(e.target.value + "T00:00:00")); }} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK, fontSize: 15 }} />
      <div style={{ fontSize: 13, color: ACCENT, fontWeight: 700 }}>Week {wk} · {planDay?.Type} · {planDay?.MuscleGroups}</div>

      {exercises.map((ex) => {
        const exRows = sets[ex.ExerciseName] || [];
        const filledReps = exRows.filter((r) => r.reps).length;
        const exStatus = filledReps === 0 ? "None" : filledReps === exRows.length ? "Complete" : "Partial";
        const stripeColor = statusColor(exStatus);
        const type = ex.ExerciseType || "weighted";
        const lastSchedDate = getLastScheduledDate(ex.ExerciseName, dateStr, anchorDate, planOverrides);
        let lastStatus = null;
        if (lastSchedDate) {
          const rowsOnThatDate = effExerciseLog.filter((r) => r.Date === lastSchedDate && r.ExerciseName === ex.ExerciseName);
          const lastFilled = rowsOnThatDate.filter((r) => r.Reps).length;
          lastStatus = rowsOnThatDate.length === 0 ? "None" : lastFilled === 0 ? "None" : lastFilled === rowsOnThatDate.length ? "Complete" : "Partial";
        }
        const ghostColor = lastStatus ? statusColor(lastStatus) + "55" : "transparent";
        return (
          <div key={ex.ExerciseName} style={{ position: "relative", background: CARD, borderRadius: 10, padding: "12px 12px 12px 22px" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: ghostColor, borderRadius: "10px 0 0 10px" }} title="Status last time" />
            <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 5, background: stripeColor }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: stripeColor }}>{ex.ExerciseName}</span>
              <span style={{ color: SUB, fontSize: 12 }}>Target {ex.TargetSets}×{ex.TargetReps}</span>
            </div>
            {exRows.map((row, i) => {
              const ph = rowPlaceholder(effExerciseLog, ex.ExerciseName, dateStr, i);
              const timerKey = `${ex.ExerciseName}__${i}`;
              const isTiming = timerRunning[timerKey];
              return (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: SUB, width: 16 }}>{i + 1}</span>
                  {type === "time" ? (
                    <>
                      <div style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: isTiming ? ACCENT : INK, fontFamily: "ui-monospace, Menlo, monospace" }}>
                        {isTiming ? formatSecondsClock(timerElapsed[timerKey]) : row.reps ? formatSecondsClock(row.reps) : ph.reps ? `${formatSecondsClock(ph.reps)} last time` : "0:00"}
                      </div>
                      <button onClick={() => toggleTimer(ex.ExerciseName, i)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "none", background: isTiming ? REDC : ACCENT, color: isTiming ? "#fff" : "#06211D", fontWeight: 700, cursor: "pointer" }}>
                        {isTiming ? "Stop" : "Start"}
                      </button>
                    </>
                  ) : (
                    <input inputMode="numeric" placeholder={ph.reps ? `${ph.reps} reps` : "reps"} value={row.reps} onChange={(e) => updateSetRow(ex.ExerciseName, i, "reps", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
                  )}
                  {type === "weighted" && (
                    <input inputMode="decimal" placeholder={ph.weight ? `${ph.weight} lb` : "weight"} value={row.weight} onChange={(e) => updateSetRow(ex.ExerciseName, i, "weight", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
                  )}
                  <Trash2 size={16} style={{ color: REDC, cursor: "pointer" }} onClick={() => removeSetRow(ex.ExerciseName, i)} />
                </div>
              );
            })}
            <button onClick={() => addSetRow(ex.ExerciseName)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GOLD, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
              <Plus size={14} /> Add set
            </button>
          </div>
        );
      })}

      {isRunDay && (
        <div style={{ background: CARD, borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Run</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input inputMode="decimal" placeholder="distance (mi)" value={runData.Distance} onChange={(e) => setRunField("Distance", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
            <input placeholder="time (mm:ss)" value={runData.Time} onChange={(e) => setRunField("Time", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
            <input placeholder="pace (auto)" value={runData.Pace} readOnly title="Calculated automatically from distance and time" style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: SUB, cursor: "default" }} />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input inputMode="decimal" placeholder="body weight" value={weight} onChange={(e) => { markEdited(); setWeight(e.target.value); }} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK }} />
        <Segmented value={status} onChange={(v) => { markEdited(); setStatus(v); setStatusManual(true); }} options={STATUS_OPTS} />
      </div>
      <textarea placeholder={notesPlaceholder || "notes"} value={notes} onChange={(e) => { markEdited(); setNotes(e.target.value); }} onFocus={handleNotesFocus} onKeyDown={handleNotesKeyDown} rows={6} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK, minHeight: 120, resize: "vertical", fontFamily: "inherit", fontSize: 14, lineHeight: 1.5 }} />

      <button onClick={handleSave} disabled={saving} style={{
        padding: 14, borderRadius: 10, border: "none",
        background: saving ? SLATE : ACCENT, color: "#06211D",
        fontWeight: 700, cursor: saving ? "default" : "pointer",
      }}>
        {saving ? "Saving…" : justSaved ? "Saved ✓" : isEditingHistorical ? "Save & return" : "Save"}
      </button>

      <button onClick={handleSync} disabled={syncing} style={{
        padding: 14, borderRadius: 10,
        border: `1px solid ${pendingCount > 0 ? GOLD : LINE}`,
        background: pendingCount > 0 ? GOLD : CARD,
        color: pendingCount > 0 ? "#332405" : INK,
        fontWeight: 700, cursor: syncing ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <RefreshCw size={16} className={syncing ? "spin" : ""} />
        {syncing ? "Syncing…" : pendingCount > 0 ? `Sync (${pendingCount} pending)` : "Sync"}
      </button>

      {!isEditingHistorical && (
        <div
          onTouchStart={(e) => { swipeTouchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (swipeTouchX.current == null) return;
            const dx = e.changedTouches[0].clientX - swipeTouchX.current;
            swipeTouchX.current = null;
            if (Math.abs(dx) < 50) return;
            goToDate(addDays(date, dx < 0 ? 1 : -1));
          }}
          style={{ padding: 14, borderRadius: 10, border: `1px solid ${ACCENT}`, background: "transparent", color: ACCENT, fontWeight: 700, textAlign: "center", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <ChevronLeft size={16} /> Swipe for another day <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}

export default function WorkoutTracker() {
  const [settings, setSettings] = useState({ apiUrl: "", apiKey: "", anchorDate: CYCLE_ANCHOR, slides: ["today", "week", "month", "progress"], slideSeconds: 150, slideshowEnabled: true, abCycleSeconds: 15, weightWindowDays: 21 });
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState(typeof window !== "undefined" && window.innerWidth < 700 ? "entry" : "display");
  const [slide, setSlide] = useState(0);
  const [logDate, setLogDate] = useState(new Date());
  const [dailyLog, setDailyLog] = useState([]);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [runLog, setRunLog] = useState([]);
  const [queue, setQueue] = useState([]);
  const queueRef = useRef([]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [calendarNotes, setCalendarNotes] = useState({});
  const [planOverrides, setPlanOverrides] = useState({});
  const [viewDate, setViewDate] = useState(new Date());
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [editContext, setEditContext] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenSupported = typeof document !== "undefined" && !!document.fullscreenEnabled;
  const touchStart = useRef(null);
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // permission denied, unsupported, or backgrounded — silently skip
    }
  };
  const releaseWakeLock = () => {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  };

  useEffect(() => {
    if (mode === "display") requestWakeLock(); else releaseWakeLock();
    return releaseWakeLock;
  }, [mode]);

  // Wake locks are auto-released when the tab is hidden (e.g. screen briefly
  // dimmed, app backgrounded) — re-acquire once it's visible again.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && mode === "display" && !wakeLockRef.current) requestWakeLock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [mode]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  const [hydrated, setHydrated] = useState(false);
  const effDaily = useMemo(() => overlayPending(dailyLog, queue, "logDaily"), [dailyLog, queue]);
  const effExercise = useMemo(() => effectiveExerciseLog(exerciseLog, queue), [exerciseLog, queue]);
  const effRun = useMemo(() => overlayPending(runLog, queue, "logRun"), [runLog, queue]);

  useEffect(() => {
    (async () => {
      const s = await storeGet("settings", null);
      if (s) setSettings((prev) => ({ ...prev, ...s, anchorDate: CYCLE_ANCHOR }));
      setDailyLog(await storeGet("dailyLog", []));
      setExerciseLog(await storeGet("exerciseLog", []));
      setRunLog(await storeGet("runLog", []));
      setQueue(await storeGet("queue", []));
      setCalendarNotes(await storeGet("calendarNotes", {}));
      setPlanOverrides(await storeGet("planOverrides", {}));
      setHydrated(true);
    })();
  }, []);

  const onSaveNote = (ds, text) => {
    setCalendarNotes((prev) => {
      const next = { ...prev };
      if (text) next[ds] = text; else delete next[ds];
      storeSet("calendarNotes", next);
      return next;
    });
    pushQueue([{ action: "logNote", data: { Date: ds, Note: text } }]);
  };

  const onSavePlanOverride = (key, rows) => {
    setPlanOverrides((prev) => {
      const next = { ...prev };
      if (rows) next[key] = rows; else delete next[key];
      storeSet("planOverrides", next);
      return next;
    });
  };

  const startEditDay = (dateStr, returnSlideId) => {
    setLogDate(new Date(dateStr + "T00:00:00"));
    setEditContext({ returnSlideId });
    setMode("entry");
  };
  const finishEdit = () => {
    if (editContext) {
      const idx = activeSlides.findIndex((s) => s.id === editContext.returnSlideId);
      setSlide(idx >= 0 ? idx : 0);
      setEditContext(null);
    }
    setMode("display");
  };

  const onLoadDemo = () => {
    const demo = generateDemoData();
    setDailyLog(demo.daily); setExerciseLog(demo.exercise); setRunLog(demo.run);
    storeSet("dailyLog", demo.daily); storeSet("exerciseLog", demo.exercise); storeSet("runLog", demo.run);
    setShowSettings(false);
  };

  const fetchAll = useCallback(async (s) => {
    if (!s.apiUrl || !s.apiKey) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(`${s.apiUrl}?key=${encodeURIComponent(s.apiKey)}&action=getAll`, { signal: controller.signal });
      const data = await res.json();
      if (data.error) { setSyncMsg(`Fetch error: ${data.error}`); return; }
      setDailyLog(data.dailyLog || []); setExerciseLog(data.exerciseLog || []); setRunLog(data.runLog || []);
      storeSet("dailyLog", data.dailyLog || []); storeSet("exerciseLog", data.exerciseLog || []); storeSet("runLog", data.runLog || []);
      if (data.calendarNotes) {
        const notesObj = {};
        data.calendarNotes.forEach((r) => { if (r.Note) notesObj[r.Date] = r.Note; });
        setCalendarNotes(notesObj);
        storeSet("calendarNotes", notesObj);
      }
    } catch (err) { setSyncMsg(`Couldn't reach the sheet (${err.message})`); } finally { clearTimeout(timer); }
  }, []);

  useEffect(() => { if (settings.apiUrl) fetchAll(settings); }, [settings.apiUrl]);
  useEffect(() => { const t = setInterval(() => fetchAll(settings), (settings.refreshMinutes || 3) * 60 * 1000); return () => clearInterval(t); }, [settings, fetchAll]);

  const activeSlides = SLIDE_DEFS.filter((s) => settings.slides.includes(s.id));
  useEffect(() => { if (slide >= activeSlides.length) setSlide(0); }, [activeSlides.length]);
  useEffect(() => {
    if (mode !== "display" || !settings.slideshowEnabled || activeSlides.length <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % activeSlides.length), (settings.slideSeconds || 150) * 1000);
    return () => clearInterval(t);
  }, [mode, settings.slideshowEnabled, settings.slideSeconds, activeSlides.length]);

  const queueKey = (item) => {
    const d = item.data;
    if (item.action === "logDaily") return `logDaily:${d.Date}`;
    if (item.action === "logExercise") return `logExercise:${d.Date}:${d.ExerciseName}:${d.SetNumber}`;
    if (item.action === "logRun") return `logRun:${d.Date}`;
    if (item.action === "logNote") return `logNote:${d.Date}`;
    return JSON.stringify(item);
  };
  const mergeQueue = (current, items) => {
    let q = [...current];
    items.forEach((item) => {
      const key = queueKey(item);
      q = q.filter((i) => queueKey(i) !== key);
      q.push(item);
    });
    return q;
  };

  // Sends everything in one HTTP round trip instead of one request per item —
  // on a slow/flaky connection this is the difference between a handful of
  // seconds and a minute-plus, and it means a dropped connection loses at most
  // one round trip's worth of progress instead of failing partway through a
  // long sequential chain. A 20s timeout keeps a hung request from leaving the
  // UI stuck on "Saving…" forever.
  const postBatch = async (items) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(settings.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ key: settings.apiKey, action: "logBatch", items }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } finally {
      clearTimeout(timer);
    }
  };

  // Single entry point for both "save this entry" and "manual refresh": merges any
  // new items into the queue (replacing same-key items so nothing stacks — and
  // persisting to local storage immediately, before any network call), pushes
  // everything pending to the sheet in one batch, then re-fetches so every
  // screen reflects it. Reads/writes go through queueRef so two overlapping
  // calls (e.g. a save plus a manual refresh) can't clobber each other.
  // Merges items into the queue and persists locally — synchronous from the
  // caller's point of view (no network wait), used to guarantee nothing is
  // lost when navigating away (e.g. swiping to another day) before the
  // person has explicitly hit Save. A background sync is kicked off after,
  // but navigation never has to wait for it.
  const saveLocalOnly = (items) => {
    if (!items || !items.length) return;
    const merged = mergeQueue(queueRef.current, items);
    queueRef.current = merged;
    setQueue(merged); storeSet("queue", merged);
    setSyncMsg("Autosaved on this device");
  };
  const saveLocalAndSyncInBackground = (items) => {
    saveLocalOnly(items);
    pushQueue(null); // fire and forget
  };

  const pushQueue = async (itemsToMerge) => {
    setSyncing(true); setSyncMsg("");
    const merged = itemsToMerge ? mergeQueue(queueRef.current, itemsToMerge) : [...queueRef.current];
    queueRef.current = merged;
    if (itemsToMerge) { setQueue(merged); storeSet("queue", merged); }

    if (!settings.apiUrl) {
      setSyncing(false);
      setSyncMsg(itemsToMerge ? "Saved locally — add your Apps Script URL in Settings to sync" : "Set your Apps Script URL and key in Settings first.");
      return { ok: 0, fail: merged.length };
    }
    if (merged.length === 0) {
      await fetchAll(settings);
      setSyncing(false);
      setSyncMsg("Up to date");
      return { ok: 0, fail: 0 };
    }
    try {
      const result = await postBatch(merged);
      const failedIdx = new Set((result.results || []).filter((r) => !r.success).map((r) => r.index));
      const remaining = merged.filter((_, idx) => failedIdx.has(idx));
      const ok = merged.length - remaining.length;
      queueRef.current = remaining;
      setQueue(remaining); storeSet("queue", remaining);
      await fetchAll(settings);
      setSyncing(false);
      setSyncMsg(remaining.length > 0 ? `Saved ${ok}, ${remaining.length} pending — will retry` : `Saved ${ok} item${ok === 1 ? "" : "s"}`);
      return { ok, fail: remaining.length };
    } catch (err) {
      // Whole batch failed (offline, timeout, etc.) — everything stays queued,
      // already safely on disk from the merge above, nothing is lost.
      setSyncing(false);
      setSyncMsg(`Couldn't reach the sheet — ${merged.length} pending, will retry`);
      return { ok: 0, fail: merged.length };
    }
  };

  const now = new Date();
  const todayWk = getWeekNumber(now, settings.anchorDate);
  const todayDn = dayName(now);
  const todayPlanDay = PLAN_DAYS.find((p) => p.Week === todayWk && p.DayOfWeek === todayDn);
  const todayExercises = getEffectiveExercises(planOverrides, todayWk, todayDn);

  const navWeek = (delta) => setViewDate((d) => (delta === "today" ? new Date() : addDays(d, delta * 7)));
  const navMonth = (delta) => setViewDate((d) => (delta === "today" ? new Date() : addMonths(d, delta)));

  const slideComponents = {
    today: <TodaySlide key="t" date={now} weekNum={todayWk} planDay={todayPlanDay} exercises={todayExercises} dailyLog={effDaily} />,
    week: <WeekSlide key="w" date={viewDate} anchorDate={settings.anchorDate} dailyLog={effDaily} exerciseLog={effExercise} calendarNotes={calendarNotes} onSaveNote={onSaveNote} onNav={navWeek} planOverrides={planOverrides} onEditDay={(ds) => startEditDay(ds, "week")} />,
    month: <MonthSlide key="m" date={viewDate} anchorDate={settings.anchorDate} dailyLog={effDaily} exerciseLog={effExercise} calendarNotes={calendarNotes} onSaveNote={onSaveNote} onNav={navMonth} onEditDay={(ds) => startEditDay(ds, "month")} />,
    progress: <ProgressSlide key="p" dailyLog={effDaily} exerciseLog={effExercise} runLog={effRun} anchorDate={settings.anchorDate} planOverrides={planOverrides} abSeconds={settings.abCycleSeconds || 15} weightWindow={settings.weightWindowDays || 21} />,
  };
  const slidesToShow = activeSlides.map((s) => slideComponents[s.id]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current == null || slidesToShow.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) setSlide((s) => (dx < 0 ? (s + 1) % slidesToShow.length : (s + slidesToShow.length - 1) % slidesToShow.length));
    touchStart.current = null;
  };

  if (!hydrated) {
    return (
      <div style={{ width: "100%", height: "100vh", background: BG, color: SUB, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", background: BG, color: INK, fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", paddingLeft: "env(safe-area-inset-left, 0px)", paddingRight: "env(safe-area-inset-right, 0px)", boxSizing: "border-box" }}>
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}} input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1)}`}</style>

      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(12px + env(safe-area-inset-top, 0px)) 16px 12px 16px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1, color: ACCENT, textTransform: "uppercase" }}>Super Shrexy Tracker</div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {syncMsg && <span style={{ fontSize: 11, color: SUB, maxWidth: 200, textAlign: "right" }}>{syncMsg}</span>}
          <RefreshCw size={30} className={syncing ? "spin" : ""} style={{ cursor: "pointer", color: queue.length ? GOLD : SUB, padding: 6 }} onClick={() => (settings.apiUrl ? pushQueue(null) : setShowSettings(true))} />
          {fullscreenSupported && (isFullscreen ? <Minimize2 size={30} style={{ cursor: "pointer", color: SUB, padding: 6 }} onClick={toggleFullscreen} /> : <Maximize2 size={30} style={{ cursor: "pointer", color: SUB, padding: 6 }} onClick={toggleFullscreen} />)}
          {mode === "display" ? <Smartphone size={30} style={{ cursor: "pointer", color: SUB, padding: 6 }} onClick={() => { setEditContext(null); setMode("entry"); }} /> : <Monitor size={30} style={{ cursor: "pointer", color: SUB, padding: 6 }} onClick={finishEdit} />}
          <Settings size={30} style={{ cursor: "pointer", color: SUB, padding: 6 }} onClick={() => setShowSettings(true)} />
        </div>
      </div>

      {mode === "display" ? (
        <div style={{ flex: "1 1 auto", minHeight: 0, position: "relative" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {slidesToShow[slide]}
          {slidesToShow.length > 1 && (
            <>
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
                {slidesToShow.map((_, i) => <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 20 : 8, height: 8, borderRadius: 4, background: i === slide ? ACCENT : LINE, cursor: "pointer", transition: "width .2s" }} />)}
              </div>
              <ChevronLeft size={28} style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", color: SUB, cursor: "pointer", opacity: 0.5 }} onClick={() => setSlide((s) => (s + slidesToShow.length - 1) % slidesToShow.length)} />
              <ChevronRight size={28} style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", color: SUB, cursor: "pointer", opacity: 0.5 }} onClick={() => setSlide((s) => (s + 1) % slidesToShow.length)} />
            </>
          )}
        </div>
      ) : (
        <div style={{ flex: "1 1 auto", minHeight: 0 }}>
          <LogEntryView date={logDate} setDate={setLogDate} anchorDate={settings.anchorDate} dailyLog={dailyLog} exerciseLog={exerciseLog} runLog={runLog} queue={queue} planOverrides={planOverrides} isEditingHistorical={!!editContext} onDone={finishEdit} onSave={pushQueue} onSwipeSave={saveLocalAndSyncInBackground} onLocalSave={saveLocalOnly} onSync={(items) => pushQueue(items)} syncing={syncing} pendingCount={queue.length} />
        </div>
      )}

      {showSettings && <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSave={async (s) => { setSettings(s); await storeSet("settings", s); setShowSettings(false); fetchAll(s); }} onLoadDemo={onLoadDemo} onOpenPlanEditor={() => { setShowSettings(false); setShowPlanEditor(true); }} />}
      {showPlanEditor && <PlanEditorModal planOverrides={planOverrides} onClose={() => setShowPlanEditor(false)} onSave={onSavePlanOverride} />}
    </div>
  );
}
