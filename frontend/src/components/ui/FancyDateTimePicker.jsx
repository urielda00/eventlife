import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

/** ---------- Utils ---------- **/
const pad = (n) => String(n).padStart(2, "0");

// Format Date -> "YYYY-MM-DDTHH:mm" using local getters (no timezone offset math)
const toLocalInputValue = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromLocalInputValue = (s) => (s ? new Date(s) : null);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Snap minutes to given step (e.g., 30 -> :00 or :30) */
const alignToStep = (date, stepMinutes) => {
  const d = new Date(date);
  const min = d.getMinutes();
  const mod = min % stepMinutes;
  if (mod !== 0) d.setMinutes(min + (stepMinutes - mod));
  d.setSeconds(0, 0);
  return d;
};

/**
 * FancyDateTimePicker (no external libs)
 *
 * Props:
 * - value: string "YYYY-MM-DDTHH:mm" | ""   (controlled)
 * - onChange: (val: string) => void
 * - label?: string                          (default: "Date & Time")
 * - min?: Date                              (default: now)
 * - stepMinutes?: number                    (default: 30)
 */
const FancyDateTimePicker = ({
  value,
  onChange,
  label = "Date & Time",
  min,
  stepMinutes = 30,
}) => {
  const now = useMemo(() => min ?? new Date(), [min]);
  const committed = fromLocalInputValue(value); // what parent currently holds

  // popover open/close
  const [isOpen, setIsOpen] = useState(false);

  // local draft selection (only applied on confirm)
  const [draft, setDraft] = useState(() =>
    alignToStep(committed ?? new Date(now), stepMinutes)
  );

  // month cursor
  const [monthCursor, setMonthCursor] = useState(
    committed
      ? new Date(committed.getFullYear(), committed.getMonth(), 1)
      : new Date(now.getFullYear(), now.getMonth(), 1)
  );

  // Anchor day used when only time changes
  const [anchorDay, setAnchorDay] = useState(committed ?? now);

  // Re-initialize draft when opening the popover
  useEffect(() => {
    if (isOpen) {
      const base = alignToStep(committed ?? new Date(now), stepMinutes);
      setDraft(base);
      setAnchorDay(base);
      setMonthCursor(new Date(base.getFullYear(), base.getMonth(), 1));
    }
  }, [isOpen, committed, now, stepMinutes]);

  // Close popover on outside click
  const rootRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Human-readable shell text (shows committed value, not draft)
  const display = useMemo(() => {
    if (!committed) return "";
    const dd = pad(committed.getDate());
    const mm = pad(committed.getMonth() + 1);
    const yyyy = committed.getFullYear();
    const hh = pad(committed.getHours());
    const mi = pad(committed.getMinutes());
    return `${dd}/${mm}/${yyyy}, ${hh}:${mi}`;
  }, [committed]);

  /** Build calendar grid for current month cursor (Monday first) */
  const grid = useMemo(() => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const first = new Date(y, m, 1);
    const startWeekday = (first.getDay() + 6) % 7; // Mo=0..Su=6
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, m, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [monthCursor]);

  /** Day is disabled if it's before "today" (based on min/now) */
  const dayDisabled = (day) => {
    if (!day) return true;
    return startOfDay(day) < startOfDay(now);
  };

  /** When picking a day, keep hour/minutes aligned to step and not in the past */
  const handlePickDay = (day) => {
    if (!day || dayDisabled(day)) return;

    const baseHours = draft?.getHours() ?? now.getHours();
    const baseMins =
      draft?.getMinutes() ??
      Math.ceil(now.getMinutes() / stepMinutes) * stepMinutes;

    let next = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      baseHours,
      baseMins >= 60 ? 0 : baseMins,
      0,
      0
    );
    next = alignToStep(next, stepMinutes);

    if (sameDay(next, now) && next < now) {
      next = alignToStep(new Date(now), stepMinutes);
    }

    setAnchorDay(next);
    setDraft(next); // only update local draft
  };

  /** Hour tile is disabled if it can only result in a past time today */
  const hourDisabled = (h) => {
    const base = draft || anchorDay || now;
    if (!sameDay(base, now)) return false;
    return h < now.getHours();
  };

  /** Clicking an hour selects the full hour tile (minutes snapped safely) */
  const handlePickHour = (h) => {
    const base = draft || anchorDay || now;

    // If choosing the current hour today, snap minutes to the next allowed step
    let minutes = 0;
    if (sameDay(base, now) && h === now.getHours()) {
      minutes = Math.ceil(now.getMinutes() / stepMinutes) * stepMinutes;
      if (minutes >= 60) {
        h = h + 1;
        minutes = 0;
      }
    }

    let next = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      h,
      minutes,
      0,
      0
    );
    next = alignToStep(next, stepMinutes);
    if (sameDay(next, now) && next < now) return;

    setAnchorDay(next);
    setDraft(next); // only update local draft
  };

  // Active hour for visual highlight (use draft)
  const activeHour = draft ? draft.getHours() : null;

  // Confirm / Cancel handlers
  const handleConfirm = () => {
    if (!draft) return;
    onChange?.(toLocalInputValue(draft));
    setIsOpen(false);
  };
  const handleCancel = () => {
    setIsOpen(false); // close without committing
  };

  // keyboard: Enter confirms
  const onKeyDownShell = (e) => {
    if (e.key === "Enter") setIsOpen((v) => !v);
  };

  return (
    <Root ref={rootRef}>
      <LabelEl>{label}</LabelEl>

      <Shell
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={onKeyDownShell}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <CalendarIcon viewBox="0 0 24 24" aria-hidden>
          <path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" />
        </CalendarIcon>
        <Value>{display || "Select date & time"}</Value>
        <Chevron $open={isOpen}>▾</Chevron>
      </Shell>

      {isOpen && (
        <Popover role="dialog" aria-label="Date and time picker">
          <Card>
            {/* Calendar side */}
            <CalendarSide>
              <CalHeader>
                <NavBtn
                  type="button"
                  onClick={() =>
                    setMonthCursor(
                      new Date(
                        monthCursor.getFullYear(),
                        monthCursor.getMonth() - 1,
                        1
                      )
                    )
                  }
                  aria-label="Previous month"
                >
                  ‹
                </NavBtn>
                <MonthTitle>
                  {monthCursor.toLocaleString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </MonthTitle>
                <NavBtn
                  type="button"
                  onClick={() =>
                    setMonthCursor(
                      new Date(
                        monthCursor.getFullYear(),
                        monthCursor.getMonth() + 1,
                        1
                      )
                    )
                  }
                  aria-label="Next month"
                >
                  ›
                </NavBtn>
              </CalHeader>

              <WeekHead>
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <HeadCell key={d}>{d}</HeadCell>
                ))}
              </WeekHead>

              <DaysGrid>
                {grid.map((day, idx) => {
                  const empty = !day;
                  const disabled = empty || dayDisabled(day);
                  const selectedDay = !!draft && day && sameDay(day, draft);
                  return (
                    <DayBtn
                      key={idx}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selectedDay}
                      $empty={empty}
                      $selected={selectedDay}
                      onClick={() => handlePickDay(day)}
                    >
                      {day ? day.getDate() : ""}
                    </DayBtn>
                  );
                })}
              </DaysGrid>
            </CalendarSide>

            {/* Time side – compact hour grid */}
            <TimeSide>
              <TimeLabel>Time</TimeLabel>
              <HourGrid>
                {Array.from({ length: 24 }).map((_, h) => {
                  const disabled = hourDisabled(h);
                  const isActive = activeHour === h;
                  return (
                    <HourItem
                      key={h}
                      type="button"
                      disabled={disabled}
                      $active={isActive}
                      aria-pressed={isActive}
                      onClick={() => handlePickHour(h)}
                    >
                      {pad(h)}
                    </HourItem>
                  );
                })}
              </HourGrid>
              <Tip>
                Past dates & times are disabled. Hours for today that already
                passed are not clickable.
              </Tip>
            </TimeSide>

            {/* Confirm row */}
            <ConfirmRow>
              <SmallBtn
                type="button"
                onClick={handleCancel}
                aria-label="Cancel"
                data-variant="ghost"
              >
                Cancel
              </SmallBtn>
              <ConfirmBtn
                type="button"
                onClick={handleConfirm}
                aria-label="Confirm date & time"
                title="Confirm"
                disabled={!draft}
              >
                Confirm
              </ConfirmBtn>
            </ConfirmRow>
          </Card>
        </Popover>
      )}
    </Root>
  );
};

export default FancyDateTimePicker;

/* ================== Styled ================== */

const Root = styled.div`
  position: relative;
  display: grid;
  gap: 0.5rem;
`;

const LabelEl = styled.label`
  font-weight: 700;
  opacity: 0.95;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const Shell = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  text-align: left;
  border: 1px solid
    ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.04)"};
  color: ${({ theme }) => theme.colors?.text || "#fff"};
  border-radius: 14px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.08s ease;

  &:focus-visible {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 0 0 6px
      ${({ theme }) =>
        theme.mode === "dark"
          ? "rgba(0,255,255,0.14)"
          : "rgba(46,204,154,0.18)"};
  }
`;

const CalendarIcon = styled.svg`
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  fill: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
  opacity: 0.95;
`;

const Value = styled.span`
  flex: 1;
  opacity: 0.92;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const Chevron = styled.span`
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
  transition: transform 0.15s ease;
  opacity: 0.8;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 9999;
  width: min(780px, 100vw - 2rem);
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 270px;
  column-gap: 1.5rem;
  row-gap: 1rem;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid
    ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(15,20,30,0.95)" : "rgba(255,255,255,0.98)"};
  box-shadow: ${({ theme }) =>
    theme.mode === "dark"
      ? "0 24px 60px rgba(0,0,0,0.6)"
      : "0 20px 50px rgba(0,0,0,0.12)"};
  backdrop-filter: blur(10px);
`;

const CalendarSide = styled.div`
  display: grid;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const CalHeader = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const NavBtn = styled.button`
  height: 42px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
  color: ${({ theme }) => theme.colors?.text || "#fff"};
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.08s;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 0 0 5px
      ${({ theme }) =>
        theme.mode === "dark"
          ? "rgba(0,255,255,0.12)"
          : "rgba(46,204,154,0.16)"};
  }
`;

const MonthTitle = styled.div`
  text-align: center;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const WeekHead = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: 700;
  opacity: 0.9;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const HeadCell = styled.div`
  text-align: center;
  padding: 0.35rem 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.45rem;
`;

const DayBtn = styled.button`
  height: 40px;
  border-radius: 12px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.accent || "#00FFFF"
        : theme.colors?.stroke || "rgba(255,255,255,0.20)"};
  background: ${({ $selected, theme }) =>
    $selected
      ? theme.colors?.accent || "#00FFFF"
      : theme.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.035)"};
  color: ${({ $selected, theme }) =>
    $selected
      ? theme.colors?.background || "#0B0F18"
      : theme.colors?.text || "#0B0F18"};
  cursor: ${({ $empty }) => ($empty ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.42 : 1)};
  pointer-events: ${({ $empty }) => ($empty ? "none" : "auto")};
  transition: transform 0.08s ease, box-shadow 0.2s ease, border-color 0.2s ease,
    background 0.2s ease;

  &:hover:not([disabled]) {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 6px 18px
      ${({ theme }) =>
        theme.mode === "dark" ? "rgba(0,255,255,0.18)" : "rgba(46,204,154,0.18)"};
  }
`;

const TimeSide = styled.div`
  display: grid;
  gap: 0.8rem;
  align-content: start;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
  padding-left: 1.25rem;
  border-left: 1px solid
    ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
`;

const TimeLabel = styled.div`
  font-weight: 800;
`;

const HourGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
`;

const HourItem = styled.button`
  height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.accent || "#00FFFF"
        : theme.colors?.stroke || "rgba(255,255,255,0.20)"};
  background: ${({ $active, theme }) =>
    $active
      ? theme.colors?.accent || "#00FFFF"
      : theme.mode === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.035)"};
  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.background || "#0B0F18"
      : theme.colors?.text || "#0B0F18"};
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  letter-spacing: 0.3px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.42 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: transform 0.08s ease, box-shadow 0.2s ease, border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 6px 18px
      ${({ theme }) =>
        theme.mode === "dark" ? "rgba(0,255,255,0.18)" : "rgba(46,204,154,0.18)"};
  }
`;

const Tip = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  color: ${({ theme }) => theme.colors?.text || "#fff"};
`;

const ConfirmRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.25rem;
`;

const SmallBtn = styled.button`
  height: 32px;
  min-width: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
  color: ${({ theme }) => theme.colors?.text || "#fff"};
  font-weight: 700;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 0.08s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &[data-variant="ghost"] {
    opacity: 0.85;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 4px 14px
      ${({ theme }) =>
        theme.mode === "dark" ? "rgba(0,255,255,0.15)" : "rgba(46,204,154,0.15)"};
  }
`;

const ConfirmBtn = styled(SmallBtn)`
  background: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
  color: ${({ theme }) => theme.colors?.background || "#0B0F18"};
  border-color: transparent;

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
