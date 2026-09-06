import { useState } from "react";
import * as styles from "../../styles/events/DateRangeGridStyles";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SIZE_MAP = { xs: 0.8, sm: 0.9, md: 1, lg: 1.15 };

export default function DateRangeGrid({
  from,
  to,
  onChange,
  size = "md",
  defaultMode = "single", // "single" | "range"
}) {
  const [mode, setMode] = useState(defaultMode === "range" ? "range" : "single");
  const scale = SIZE_MAP[size] ?? 1;

  const today = new Date();
  const todayISO = formatISO(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const gotoMonth = (delta) => {
    const base = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  };

  const first = new Date(viewYear, viewMonth, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const inRange = (iso) => {
    if (!from) return false;
    if (from && !to) return iso === from;
    return iso >= from && iso <= to;
  };

  const handlePick = (d) => {
    if (!d) return;
    const iso = formatISO(d);
    if (iso < todayISO) return;

    if (mode === "single") {
      onChange(iso, iso);
      return;
    }

    if (!from || (from && to)) {
      onChange(iso, "");
    } else {
      if (iso < from) onChange(iso, from);
      else onChange(from, iso);
    }
  };

  const switchMode = (next) => {
    if (next === mode) return;
    if (next === "single") {
      if (from && !to) onChange(from, from);
      if (from && to) onChange(from, from);
    }
    setMode(next);
  };

  return (
    <styles.CalendarWrap style={{ ["--c"]: scale }}>
      <styles.ModeWrap>
        <styles.ModeChip
          type="button"
          $on={mode === "single"}
          onClick={() => switchMode("single")}
          aria-pressed={mode === "single"}
        >
          Single day
        </styles.ModeChip>
        <styles.ModeChip
          type="button"
          $on={mode === "range"}
          onClick={() => switchMode("range")}
          aria-pressed={mode === "range"}
        >
          Range
        </styles.ModeChip>
      </styles.ModeWrap>

      <styles.CalHeader>
        <styles.NavBtn type="button" onClick={() => gotoMonth(-1)} aria-label="Previous month">
          <FiChevronLeft />
        </styles.NavBtn>
        <h4>
          {new Date(viewYear, viewMonth).toLocaleString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <styles.NavBtn type="button" onClick={() => gotoMonth(1)} aria-label="Next month">
          <FiChevronRight />
        </styles.NavBtn>
      </styles.CalHeader>

      <styles.WeekRow>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <styles.WeekCell key={d}>{d}</styles.WeekCell>
        ))}
      </styles.WeekRow>

      <styles.GridDays>
        {cells.map((d, i) => {
          if (!d) return <styles.DayCell key={`blank-${i}`} aria-hidden="true" />;
          const iso = formatISO(d);
          const past = iso < todayISO;
          const selected = inRange(iso);
          const start = from && iso === from;
          const end = to && iso === to;
          const isToday = iso === todayISO;

          return (
            <styles.DayButton
              key={iso}
              type="button"
              disabled={past}
              $selected={selected}
              $start={start}
              $end={end}
              $today={isToday}
              aria-pressed={selected}
              onClick={() => handlePick(d)}
              title={iso}
            >
              {d.getDate()}
            </styles.DayButton>
          );
        })}
      </styles.GridDays>

      <styles.RangeHelper>
        {mode === "single" ? (
          <span>
            Date: <strong>{from || "—"}</strong>
          </span>
        ) : (
          <>
            <span>
              From: <strong>{from || "—"}</strong>
            </span>
            <span>
              To: <strong>{to || "—"}</strong>
            </span>
          </>
        )}
        <styles.MiniButton
          type="button"
          onClick={() => onChange("", "")}
          style={{ marginLeft: "auto" }}
        >
          Clear dates
        </styles.MiniButton>
      </styles.RangeHelper>
    </styles.CalendarWrap>
  );
}

/* ===================== Utils ===================== */
function formatISO(d) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}