import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Settings, ChevronLeft, ChevronRight, Smartphone, Monitor, RefreshCw, Plus, Trash2, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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

const PLAN_EXERCISES = RAW_EX.split("\n").map((line) => {
  const [Week, DayOfWeek, Order, MuscleGroup, ExerciseName, TargetSets, TargetReps] = line.split(",");
  return { Week: Number(Week), DayOfWeek, Order: Number(Order), MuscleGroup, ExerciseName, TargetSets, TargetReps };
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
const planKey = (wk, dn) => `${wk}-${dn}`;
function getEffectiveExercises(overrides, wk, dn) {
  const key = planKey(wk, dn);
  if (overrides && overrides[key]) return overrides[key].map((e, i) => ({ ...e, Week: wk, DayOfWeek: dn, Order: i + 1 }));
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
          <div style={{ fontSize: 16, fontWeight: 700, color: statusColor(existing?.CompletionStatus) }}>{existing?.CompletionStatus || "Not logged"}</div>
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
  const touchX = useRef(null);
  const onTouchStart = (e) => { e.stopPropagation(); touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    e.stopPropagation();
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) onNav(dx < 0 ? 1 : -1);
    touchX.current = null;
  };
  const endOfW = addDays(monday, 6);
  const label = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endOfW.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 28, gap: 16, overflowY: "auto" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{label}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ChevronLeft size={20} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(-1)} />
          <span onClick={() => onNav("today")} style={{ fontSize: 11, color: ACCENT, cursor: "pointer", fontWeight: 700 }}>Today</span>
          <ChevronRight size={20} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(1)} />
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
          const color = isPast || isToday ? statusColor(log?.CompletionStatus || "None") : LINE;
          return (
            <div key={ds} onClick={() => setEditingDate(ds)} style={{ cursor: "pointer", display: "flex", flexDirection: "column", background: CARD, borderRadius: 10, padding: 10, border: isToday ? `2px solid ${ACCENT}` : `1px solid ${LINE}` }}>
              <div style={{ fontSize: 11, color: SUB, textTransform: "uppercase", letterSpacing: 1 }}>{dn.slice(0, 3)} {d.getDate()}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, margin: "4px 0" }}>{plan?.Type}</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                {exList.length > 0 ? exList.map((e, i) => (
                  <div key={i} style={{ fontSize: 9.5, color: SUB, lineHeight: 1.4, display: "flex", gap: 4 }}>
                    <span style={{ color: GOLD, flexShrink: 0 }}>&#9656;</span>{e.ExerciseName}
                  </div>
                )) : <div style={{ fontSize: 10, color: SUB }}>{plan?.Notes || plan?.MuscleGroups}</div>}
              </div>
              {note && <div style={{ fontSize: 10, color: GOLD, fontStyle: "italic", marginTop: 6, borderTop: `1px solid ${LINE}`, paddingTop: 6 }}>&#9733; {note}</div>}
              <div style={{ width: "100%", height: 5, borderRadius: 3, background: (isPast || isToday) ? color : "transparent", marginTop: 8 }} />
            </div>
          );
        })}
      </div>
      {editingDate && (
        <DayDetailModal dateStr={editingDate} initialNote={calendarNotes?.[editingDate]}
          isPast={editingDate < today}
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

function DayDetailModal({ dateStr, initialNote, dailyEntry, exerciseEntries, isPast, onSave, onClear, onClose, onEdit }) {
  const [text, setText] = useState(initialNote || "");
  const grouped = exerciseEntries.reduce((acc, r) => { (acc[r.ExerciseName] = acc[r.ExerciseName] || []).push(r); return acc; }, {});
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: 22, width: 340, maxHeight: "85%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
          <X size={18} style={{ cursor: "pointer", color: SUB }} onClick={onClose} />
        </div>

        {isPast && (
          <div style={{ background: BG, borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: SUB, textTransform: "uppercase", letterSpacing: 1 }}>What you did</div>
              <button onClick={() => onEdit(dateStr)} style={{ fontSize: 11, color: ACCENT, background: "none", border: `1px solid ${ACCENT}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 700 }}>Edit</button>
            </div>
            {dailyEntry ? (
              <>
                <div style={{ display: "flex", gap: 16, marginBottom: Object.keys(grouped).length ? 10 : 0, fontSize: 13 }}>
                  <span>Weight: <b>{dailyEntry.Weight || "—"}</b></span>
                  <span style={{ color: statusColor(dailyEntry.CompletionStatus) }}>{dailyEntry.CompletionStatus || "Not logged"}</span>
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
            ) : <div style={{ fontSize: 12, color: SUB }}>Nothing logged for this day.</div>}
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
  const touchX = useRef(null);
  const onTouchStart = (e) => { e.stopPropagation(); touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    e.stopPropagation();
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) onNav(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 28, gap: 14, position: "relative" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ChevronLeft size={20} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(-1)} />
          <span onClick={() => onNav("today")} style={{ fontSize: 11, color: ACCENT, cursor: "pointer", fontWeight: 700 }}>Today</span>
          <ChevronRight size={20} style={{ cursor: "pointer", color: SUB }} onClick={() => onNav(1)} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, fontSize: 11, color: SUB, textTransform: "uppercase" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} style={{ textAlign: "center" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 6, flex: 1 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const wk = getWeekNumber(d, anchorDate);
          const plan = PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dayName(d));
          const label = plan?.MuscleGroups ? plan.MuscleGroups : plan?.Type;
          const ds = fmtDate(d);
          const log = dailyLog.find((r) => r.Date === ds);
          const note = calendarNotes?.[ds];
          const isPast = ds < today, isToday = ds === today;
          const color = isPast || isToday ? statusColor(log?.CompletionStatus || "None") : LINE;
          return (
            <div key={i} onClick={() => setEditingDate(ds)} style={{ position: "relative", cursor: "pointer", background: CARD, borderRadius: 8, padding: 6, display: "flex", flexDirection: "column", border: isToday ? `2px solid ${ACCENT}` : `1px solid ${LINE}`, fontSize: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{d.getDate()}</div>
              <div style={{ color: SUB, flex: 1, overflow: "hidden", fontSize: 9 }}>{label}</div>
              {note && <div style={{ color: GOLD, fontSize: 8.5, fontStyle: "italic", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>&#9733; {note}</div>}
              <div style={{ width: "100%", height: 4, borderRadius: 2, background: (isPast || isToday) ? color : "transparent" }} />
            </div>
          );
        })}
      </div>
      {editingDate && (
        <DayDetailModal dateStr={editingDate} initialNote={calendarNotes?.[editingDate]}
          isPast={editingDate < today}
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

function ProgressSlide({ dailyLog, exerciseLog, runLog }) {
  const [tab, setTab] = useState("weight");
  const exerciseNames = useMemo(() => [...new Set(exerciseLog.map((r) => r.ExerciseName))], [exerciseLog]);
  const [exSel, setExSel] = useState("");
  useEffect(() => { if (!exSel && exerciseNames.length) setExSel(exerciseNames[0]); }, [exerciseNames]);

  const weightData = [...dailyLog].filter((r) => r.Weight).sort((a, b) => a.Date.localeCompare(b.Date)).map((r) => ({ date: r.Date.slice(5), Weight: Number(r.Weight) }));
  const completionData = [...dailyLog].sort((a, b) => a.Date.localeCompare(b.Date)).slice(-14).map((r) => ({ date: r.Date.slice(5), score: r.CompletionStatus === "Complete" ? 2 : r.CompletionStatus === "Partial" ? 1 : 0 }));
  const exData = exerciseLog.filter((r) => r.ExerciseName === exSel).reduce((acc, r) => {
    const found = acc.find((a) => a.date === r.Date.slice(5));
    const w = Number(r.Weight) || 0;
    if (found) found.Weight = Math.max(found.Weight, w); else acc.push({ date: r.Date.slice(5), Weight: w });
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date));
  const runData = [...runLog].sort((a, b) => a.Date.localeCompare(b.Date)).map((r) => {
    const [m, s] = String(r.Pace).split(":").map(Number);
    return { date: r.Date.slice(5), Pace: m + (s || 0) / 60 };
  });
  const tabs = [{ id: "weight", label: "Body weight" }, { id: "completion", label: "Consistency" }, { id: "exercise", label: "Lift progress" }, { id: "run", label: "Run pace" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 28, gap: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>Progress</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 12px", borderRadius: 20, border: `1px solid ${tab === t.id ? ACCENT : LINE}`, background: tab === t.id ? ACCENT + "22" : "transparent", color: tab === t.id ? ACCENT : SUB, fontSize: 12, cursor: "pointer" }}>{t.label}</button>
        ))}
      </div>
      {tab === "exercise" && (
        <select value={exSel} onChange={(e) => setExSel(e.target.value)} style={{ padding: 8, borderRadius: 8, background: CARD, color: INK, border: `1px solid ${LINE}`, width: 220 }}>
          {exerciseNames.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {tab === "weight" ? (
            <LineChart data={weightData}>
              <CartesianGrid stroke={LINE} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={SUB} fontSize={11} />
              <YAxis stroke={SUB} fontSize={11} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${LINE}`, color: INK }} />
              <Line type="monotone" dataKey="Weight" stroke={ACCENT} strokeWidth={2} dot={false} />
            </LineChart>
          ) : tab === "completion" ? (
            <BarChart data={completionData}>
              <CartesianGrid stroke={LINE} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={SUB} fontSize={11} />
              <YAxis stroke={SUB} fontSize={11} domain={[0, 2]} ticks={[0, 1, 2]} tickFormatter={(v) => ["None", "Partial", "Done"][v]} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${LINE}`, color: INK }} />
              <Bar dataKey="score" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : tab === "exercise" ? (
            <LineChart data={exData}>
              <CartesianGrid stroke={LINE} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={SUB} fontSize={11} />
              <YAxis stroke={SUB} fontSize={11} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${LINE}`, color: INK }} />
              <Line type="monotone" dataKey="Weight" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <LineChart data={runData}>
              <CartesianGrid stroke={LINE} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={SUB} fontSize={11} />
              <YAxis stroke={SUB} fontSize={11} domain={["auto", "auto"]} reversed />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${LINE}`, color: INK }} />
              <Line type="monotone" dataKey="Pace" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const SLIDE_DEFS = [{ id: "today", label: "Today" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "progress", label: "Progress" }];

function SettingsModal({ settings, onSave, onClose, onLoadDemo, onOpenPlanEditor }) {
  const [url, setUrl] = useState(settings.apiUrl);
  const [key, setKey] = useState(settings.apiKey);
  const [anchor, setAnchor] = useState(settings.anchorDate);
  const [slides, setSlides] = useState(settings.slides);
  const [seconds, setSeconds] = useState(settings.slideSeconds);
  const [enabled, setEnabled] = useState(settings.slideshowEnabled);

  const toggleSlide = (id) => setSlides((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: 24, width: 380, maxHeight: "90%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Settings</div>
          <X size={20} style={{ cursor: "pointer", color: SUB }} onClick={onClose} />
        </div>
        <label style={{ fontSize: 12, color: SUB }}>Apps Script web app URL (ends in /exec)</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }} />
        <label style={{ fontSize: 12, color: SUB }}>Secret key</label>
        <input value={key} onChange={(e) => setKey(e.target.value)} style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }} />
        <label style={{ fontSize: 12, color: SUB }}>Cycle anchor date (a Monday that begins Week 1)</label>
        <input type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} style={{ padding: 10, borderRadius: 8, background: BG, border: `1px solid ${LINE}`, color: INK }} />

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

        <button onClick={() => onSave({ apiUrl: url, apiKey: key, anchorDate: anchor, slides: slides.length ? slides : ["today"], slideSeconds: seconds || 150, slideshowEnabled: enabled })}
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
  const [rows, setRows] = useState(() => getEffectiveExercises(planOverrides, 1, "Monday").map((e) => ({ ExerciseName: e.ExerciseName, TargetSets: e.TargetSets, TargetReps: e.TargetReps })));

  const loadDay = (wk, dn) => setRows(getEffectiveExercises(planOverrides, wk, dn).map((e) => ({ ExerciseName: e.ExerciseName, TargetSets: e.TargetSets, TargetReps: e.TargetReps })));

  const changeWeek = (w) => { setWeek(w); loadDay(w, day); };
  const changeDay = (d) => { setDay(d); loadDay(week, d); };

  const updateRow = (i, field, val) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));
  const addRow = () => setRows((r) => [...r, { ExerciseName: "", TargetSets: "3", TargetReps: "10" }]);

  const save = () => { onSave(planKey(week, day), rows.filter((r) => r.ExerciseName.trim())); };
  const resetDefault = () => { onSave(planKey(week, day), null); loadDay(week, day); };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30 }}>
      <div style={{ background: CARD, borderRadius: 14, padding: 22, width: 380, maxHeight: "88%", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
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
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input value={row.ExerciseName} onChange={(e) => updateRow(i, "ExerciseName", e.target.value)} placeholder="exercise name" style={{ flex: 3, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
            <input value={row.TargetSets} onChange={(e) => updateRow(i, "TargetSets", e.target.value)} placeholder="sets" style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
            <input value={row.TargetReps} onChange={(e) => updateRow(i, "TargetReps", e.target.value)} placeholder="reps" style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK, fontSize: 13 }} />
            <Trash2 size={16} style={{ color: REDC, cursor: "pointer", flexShrink: 0 }} onClick={() => removeRow(i)} />
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

function LogEntryView({ date, setDate, anchorDate, dailyLog, exerciseLog, queue, addToQueue, planOverrides, isEditingHistorical, onDone }) {
  const wk = getWeekNumber(date, anchorDate);
  const dn = dayName(date);
  const dateStr = fmtDate(date);
  const planDay = PLAN_DAYS.find((p) => p.Week === wk && p.DayOfWeek === dn);
  const exercises = useMemo(() => getEffectiveExercises(planOverrides, wk, dn), [wk, dn, planOverrides]);
  const isRunDay = ["Run", "Run+Mobility", "HIIT"].includes(planDay?.Type);
  const existingDaily = dailyLog.find((r) => r.Date === dateStr);

  const [status, setStatus] = useState(existingDaily?.CompletionStatus || "None");
  const [weight, setWeight] = useState(existingDaily?.Weight || "");
  const [notes, setNotes] = useState(existingDaily?.Notes || "");
  const [sets, setSets] = useState({});
  const [runData, setRunData] = useState({ Distance: "", Time: "", Pace: "" });

  useEffect(() => {
    const initial = {};
    exercises.forEach((ex) => { initial[ex.ExerciseName] = Array.from({ length: parseTargetSets(ex.TargetSets) }, () => ({ reps: "", weight: "" })); });
    setSets(initial);
    setStatus(existingDaily?.CompletionStatus || "None");
    setWeight(existingDaily?.Weight || "");
    setNotes(existingDaily?.Notes || "");
  }, [dateStr]);

  const addSetRow = (exName) => setSets((s) => ({ ...s, [exName]: [...(s[exName] || []), { reps: "", weight: "" }] }));
  const updateSetRow = (exName, i, field, val) => setSets((s) => ({ ...s, [exName]: s[exName].map((r, idx) => (idx === i ? { ...r, [field]: val } : r)) }));
  const removeSetRow = (exName, i) => setSets((s) => ({ ...s, [exName]: s[exName].filter((_, idx) => idx !== i) }));

  const saveAll = () => {
    addToQueue({ action: "logDaily", data: { Date: dateStr, Weight: weight, CompletionStatus: status, Notes: notes } });
    Object.entries(sets).forEach(([exName, rows]) => {
      rows.forEach((r, i) => { if (r.reps || r.weight) addToQueue({ action: "logExercise", data: { Date: dateStr, ExerciseName: exName, SetNumber: i + 1, Reps: r.reps, Weight: r.weight } }); });
    });
    if (isRunDay && (runData.Distance || runData.Time)) addToQueue({ action: "logRun", data: { Date: dateStr, ...runData } });
    if (isEditingHistorical) onDone();
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18, overflowY: "auto", height: "100%" }}>
      {isEditingHistorical && (
        <button onClick={onDone} style={{ display: "flex", alignItems: "center", gap: 4, alignSelf: "flex-start", fontSize: 13, color: SUB, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ChevronLeft size={16} /> Back
        </button>
      )}
      <input type="date" value={dateStr} onChange={(e) => setDate(new Date(e.target.value + "T00:00:00"))} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK, fontSize: 15 }} />
      <div style={{ fontSize: 13, color: ACCENT, fontWeight: 700 }}>Week {wk} · {planDay?.Type} · {planDay?.MuscleGroups}</div>

      {exercises.map((ex) => (
        <div key={ex.ExerciseName} style={{ background: CARD, borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{ex.ExerciseName}</span>
            <span style={{ color: SUB, fontSize: 12 }}>Target {ex.TargetSets}×{ex.TargetReps}</span>
          </div>
          {(sets[ex.ExerciseName] || []).map((row, i) => {
            const ph = rowPlaceholder(exerciseLog, ex.ExerciseName, dateStr, i);
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: SUB, width: 16 }}>{i + 1}</span>
                <input placeholder={ph.reps ? `${ph.reps} reps` : "reps"} value={row.reps} onChange={(e) => updateSetRow(ex.ExerciseName, i, "reps", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
                <input placeholder={ph.weight ? `${ph.weight} lb` : "weight"} value={row.weight} onChange={(e) => updateSetRow(ex.ExerciseName, i, "weight", e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
                <Trash2 size={16} style={{ color: REDC, cursor: "pointer" }} onClick={() => removeSetRow(ex.ExerciseName, i)} />
              </div>
            );
          })}
          <button onClick={() => addSetRow(ex.ExerciseName)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: GOLD, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
            <Plus size={14} /> Add set
          </button>
        </div>
      ))}

      {isRunDay && (
        <div style={{ background: CARD, borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Run</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="distance (mi)" value={runData.Distance} onChange={(e) => setRunData({ ...runData, Distance: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
            <input placeholder="time (mm:ss)" value={runData.Time} onChange={(e) => setRunData({ ...runData, Time: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
            <input placeholder="pace (mm:ss)" value={runData.Pace} onChange={(e) => setRunData({ ...runData, Pace: e.target.value })} style={{ flex: 1, padding: 8, borderRadius: 6, background: BG, border: `1px solid ${LINE}`, color: INK }} />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input placeholder="body weight" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK }} />
        <Segmented value={status} onChange={setStatus} options={STATUS_OPTS} />
      </div>
      <textarea placeholder="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} style={{ padding: 10, borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, color: INK, minHeight: 120, resize: "vertical", fontFamily: "inherit", fontSize: 14, lineHeight: 1.5 }} />

      <button onClick={saveAll} style={{ padding: 14, borderRadius: 10, border: "none", background: ACCENT, color: "#06211D", fontWeight: 700 }}>
        {isEditingHistorical ? "Save & return" : `Queue entry (${queue.length} pending)`}
      </button>
    </div>
  );
}

export default function WorkoutTracker() {
  const [settings, setSettings] = useState({ apiUrl: "", apiKey: "", anchorDate: fmtDate(startOfWeek(new Date())), slides: ["today", "week", "month", "progress"], slideSeconds: 150, slideshowEnabled: true });
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState(typeof window !== "undefined" && window.innerWidth < 700 ? "entry" : "display");
  const [slide, setSlide] = useState(0);
  const [logDate, setLogDate] = useState(new Date());
  const [dailyLog, setDailyLog] = useState([]);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [runLog, setRunLog] = useState([]);
  const [queue, setQueue] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [calendarNotes, setCalendarNotes] = useState({});
  const [planOverrides, setPlanOverrides] = useState({});
  const [viewDate, setViewDate] = useState(new Date());
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [editContext, setEditContext] = useState(null);
  const touchStart = useRef(null);

  useEffect(() => {
    (async () => {
      const s = await storeGet("settings", null);
      if (s) setSettings((prev) => ({ ...prev, ...s }));
      setDailyLog(await storeGet("dailyLog", []));
      setExerciseLog(await storeGet("exerciseLog", []));
      setRunLog(await storeGet("runLog", []));
      setQueue(await storeGet("queue", []));
      setCalendarNotes(await storeGet("calendarNotes", {}));
      setPlanOverrides(await storeGet("planOverrides", {}));
    })();
  }, []);

  const onSaveNote = (ds, text) => {
    setCalendarNotes((prev) => {
      const next = { ...prev };
      if (text) next[ds] = text; else delete next[ds];
      storeSet("calendarNotes", next);
      return next;
    });
    addToQueue({ action: "logNote", data: { Date: ds, Note: text } });
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
    try {
      const res = await fetch(`${s.apiUrl}?key=${encodeURIComponent(s.apiKey)}&action=getAll`);
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
    } catch (err) { setSyncMsg(`Couldn't reach the sheet (${err.message})`); }
  }, []);

  useEffect(() => { if (settings.apiUrl) fetchAll(settings); }, [settings.apiUrl]);
  useEffect(() => { const t = setInterval(() => fetchAll(settings), 5 * 60 * 1000); return () => clearInterval(t); }, [settings, fetchAll]);

  const activeSlides = SLIDE_DEFS.filter((s) => settings.slides.includes(s.id));
  useEffect(() => { if (slide >= activeSlides.length) setSlide(0); }, [activeSlides.length]);
  useEffect(() => {
    if (mode !== "display" || !settings.slideshowEnabled || activeSlides.length <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % activeSlides.length), (settings.slideSeconds || 150) * 1000);
    return () => clearInterval(t);
  }, [mode, settings.slideshowEnabled, settings.slideSeconds, activeSlides.length]);

  const addToQueue = (item) => setQueue((q) => { const nq = [...q, item]; storeSet("queue", nq); return nq; });

  const postOne = async (item) => {
    const res = await fetch(settings.apiUrl, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ key: settings.apiKey, ...item }) });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
  };

  const syncNow = async () => {
    if (!settings.apiUrl) { setSyncMsg("Set your Apps Script URL and key in Settings first."); setShowSettings(true); return; }
    setSyncing(true); setSyncMsg("");
    const q = [...queue];
    let ok = 0, fail = 0;
    for (const item of q) { try { await postOne(item); ok++; } catch { fail++; } }
    const remaining = fail > 0 ? q.slice(ok) : [];
    setQueue(remaining); storeSet("queue", remaining);
    await fetchAll(settings);
    setSyncing(false);
    setSyncMsg(fail > 0 ? `Synced ${ok}, ${fail} failed — check URL/key or network` : ok > 0 ? `Synced ${ok} item${ok === 1 ? "" : "s"}` : "Nothing to sync");
  };

  const now = new Date();
  const todayWk = getWeekNumber(now, settings.anchorDate);
  const todayDn = dayName(now);
  const todayPlanDay = PLAN_DAYS.find((p) => p.Week === todayWk && p.DayOfWeek === todayDn);
  const todayExercises = getEffectiveExercises(planOverrides, todayWk, todayDn);

  const navWeek = (delta) => setViewDate((d) => (delta === "today" ? new Date() : addDays(d, delta * 7)));
  const navMonth = (delta) => setViewDate((d) => (delta === "today" ? new Date() : addMonths(d, delta)));

  const slideComponents = {
    today: <TodaySlide key="t" date={now} weekNum={todayWk} planDay={todayPlanDay} exercises={todayExercises} dailyLog={dailyLog} />,
    week: <WeekSlide key="w" date={viewDate} anchorDate={settings.anchorDate} dailyLog={dailyLog} exerciseLog={exerciseLog} calendarNotes={calendarNotes} onSaveNote={onSaveNote} onNav={navWeek} planOverrides={planOverrides} onEditDay={(ds) => startEditDay(ds, "week")} />,
    month: <MonthSlide key="m" date={viewDate} anchorDate={settings.anchorDate} dailyLog={dailyLog} exerciseLog={exerciseLog} calendarNotes={calendarNotes} onSaveNote={onSaveNote} onNav={navMonth} onEditDay={(ds) => startEditDay(ds, "month")} />,
    progress: <ProgressSlide key="p" dailyLog={dailyLog} exerciseLog={exerciseLog} runLog={runLog} />,
  };
  const slidesToShow = activeSlides.map((s) => slideComponents[s.id]);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current == null || slidesToShow.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) setSlide((s) => (dx < 0 ? (s + 1) % slidesToShow.length : (s + slidesToShow.length - 1) % slidesToShow.length));
    touchStart.current = null;
  };

  return (
    <div style={{ width: "100%", height: "100vh", background: BG, color: INK, fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}} input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1)}`}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 1, color: ACCENT, textTransform: "uppercase" }}>Super Shrexy Tracker</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {syncMsg && <span style={{ fontSize: 11, color: SUB, maxWidth: 200, textAlign: "right" }}>{syncMsg}</span>}
          <RefreshCw size={18} className={syncing ? "spin" : ""} style={{ cursor: "pointer", color: queue.length ? GOLD : SUB }} onClick={syncNow} />
          {mode === "display" ? <Smartphone size={18} style={{ cursor: "pointer", color: SUB }} onClick={() => { setEditContext(null); setMode("entry"); }} /> : <Monitor size={18} style={{ cursor: "pointer", color: SUB }} onClick={finishEdit} />}
          <Settings size={18} style={{ cursor: "pointer", color: SUB }} onClick={() => setShowSettings(true)} />
        </div>
      </div>

      {mode === "display" ? (
        <div style={{ height: "calc(100% - 45px)", position: "relative" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
        <div style={{ height: "calc(100% - 45px)" }}>
          <LogEntryView date={logDate} setDate={setLogDate} anchorDate={settings.anchorDate} dailyLog={dailyLog} exerciseLog={exerciseLog} queue={queue} addToQueue={addToQueue} planOverrides={planOverrides} isEditingHistorical={!!editContext} onDone={finishEdit} />
        </div>
      )}

      {showSettings && <SettingsModal settings={settings} onClose={() => setShowSettings(false)} onSave={async (s) => { setSettings(s); await storeSet("settings", s); setShowSettings(false); fetchAll(s); }} onLoadDemo={onLoadDemo} onOpenPlanEditor={() => { setShowSettings(false); setShowPlanEditor(true); }} />}
      {showPlanEditor && <PlanEditorModal planOverrides={planOverrides} onClose={() => setShowPlanEditor(false)} onSave={onSavePlanOverride} />}
    </div>
  );
}
