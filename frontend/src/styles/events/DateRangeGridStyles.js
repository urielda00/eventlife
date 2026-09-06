import styled from "styled-components";

export const CalendarWrap = styled.div`
  --c: 1;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: calc(14px * var(--c));
  padding: calc(0.7rem * var(--c));
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)"};
  margin-top: 0.25rem;
`;

export const ModeWrap = styled.div`
  display: inline-flex;
  gap: calc(8px * var(--c));
  margin-bottom: calc(0.45rem * var(--c));
`;

export const ModeChip = styled.button`
  border-radius: 999px;
  padding: calc(0.28rem * var(--c)) calc(0.7rem * var(--c));
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ $on, theme }) =>
    $on ? theme.colors.accent :
    (theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)")};
  color: ${({ $on, theme }) => ($on ? theme.colors.onAccent : theme.colors.accent)};
  font-weight: 800;
  cursor: pointer;
`;

export const CalHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  margin-bottom: calc(0.5rem * var(--c));
  h4 { margin: 0; text-align: center; font-size: calc(1.05rem * var(--c)); }
`;

export const NavBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  border-radius: calc(10px * var(--c));
  padding: calc(0.15rem * var(--c)) calc(0.55rem * var(--c));
  font-weight: 800;
  cursor: pointer;
`;

export const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: calc(0.85rem * var(--c));
  opacity: 0.8;
  padding: calc(0.2rem * var(--c)) calc(0.4rem * var(--c));
`;

export const WeekCell = styled.div`
  text-align: center;
`;

export const GridDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: calc(6px * var(--c));
  padding: calc(0.4rem * var(--c));
`;

export const DayCell = styled.div`
  height: calc(38px * var(--c));
`;

export const DayButton = styled.button`
  height: calc(38px * var(--c));
  width: 100%;
  border-radius: calc(10px * var(--c));
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.accent : "rgba(255,255,255,0.14)"};
  background: ${({ theme, $selected }) =>
    $selected
      ? theme.colors.accent
      : theme.mode === "light"
      ? "rgba(0,0,0,0.03)"
      : "rgba(255,255,255,0.06)"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.onAccent : theme.colors.text};
  font-weight: 700;
  cursor: pointer;
  position: relative;
  outline: none;
  font-size: calc(0.95rem * var(--c));

  ${({ $start, theme }) =>
    $start && `box-shadow: 0 0 0 calc(2px * var(--c)) ${theme.colors.accent} inset;`}
  ${({ $end, theme }) =>
    $end && `box-shadow: 0 0 0 calc(2px * var(--c)) ${theme.colors.accent} inset;`}

  /* === Highlight today === */
  ${({ $today, theme }) =>
    $today &&
    `
      border: 2px solid ${theme.colors.accent};
      box-shadow: 0 0 6px ${theme.colors.accent};
    `}

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    border-style: dashed;
  }
`;

export const RangeHelper = styled.div`
  display: flex;
  gap: calc(1rem * var(--c));
  padding: calc(0.5rem * var(--c)) calc(0.2rem * var(--c)) 0 calc(0.2rem * var(--c));
  align-items: center;
`;

export const MiniButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
`;