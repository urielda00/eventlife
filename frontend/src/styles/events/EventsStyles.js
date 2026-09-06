import styled from "styled-components";

/* ================= Base Layout ================= */
export const Wrapper = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
`;

export const HeaderArea = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 0.4rem;
  color: ${({ theme }) =>
    theme.mode === "light" ? theme.colors.text : theme.colors.accent};
  text-shadow: ${({ theme }) =>
    theme.mode === "light"
      ? "0 1px 0 rgba(0,0,0,0.12)"
      : `0 0 12px ${theme.colors.accent}`};
`;

export const SubTitle = styled.p`
  margin: 0;
  opacity: 0.9;
  color: ${({ theme }) => theme.colors.subtext};
`;

export const GridBackground = styled.div`
  padding: 2rem;
  border-radius: 24px;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)"};
  backdrop-filter: ${({ theme }) =>
    theme.mode === "light" ? "none" : "blur(8px)"};
  box-shadow: ${({ theme }) =>
    theme.mode === "light"
      ? "0 8px 30px rgba(0,0,0,0.06)"
      : "0 0 20px rgba(0,255,255,0.10)"};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const EmptyMsg = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  opacity: 0.8;
`;

/* ================= Filter Bar ================= */
export const TopBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0 1.5rem;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const FilterTabButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 160ms ease;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)"};
  color: ${({ theme }) => theme.colors.accent};

  ${({ $active, theme }) =>
    $active &&
    `
      background: ${theme.colors.accent};
      color: ${theme.colors.onAccent};
      box-shadow: 0 6px 12px rgba(0,0,0,0.08);
      transform: translateY(-1px);
    `}

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.onAccent};
  }
`;

export const RightControls = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-self: end;
  align-items: center;
`;

export const SearchInput = styled.input`
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)"};
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  min-width: 260px;
`;

export const FilterToggle = styled.button`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 12px;
  padding: 0.55rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)"};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

/* ================= Panel ================= */
export const PanelOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  z-index: 50;
`;

export const Panel = styled.div`
  width: min(960px, 94vw);
  max-height: 85vh;
  overflow: auto;
  border-radius: 18px;
  padding: 1.25rem 1.25rem 1rem;
  background: ${({ theme }) =>
    theme.mode === "light" ? "#fff" : "rgba(17, 23, 34, 0.96)"};
  box-shadow: 0 22px 60px rgba(0,0,0,0.35), 0 0 22px rgba(0,255,255,0.15);
`;

export const PanelHeader = styled.div`
  padding: 0.5rem 0.5rem 0.25rem;
  h3 { margin: 0 0 0.25rem 0; }
`;

export const SmallNote = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

export const PanelGrid = styled.div`
  display: grid;
  gap: 1.25rem 1rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 0.5rem;
`;

export const Field = styled.div`
  display: grid;
  gap: 0.6rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)"};
  border: 1px solid rgba(255,255,255,0.10);
`;

export const Label = styled.label`
  font-weight: 700;
  opacity: 0.95;
`;

export const Input = styled.input`
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)"};
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 12px;
  padding: 0.55rem 0.8rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  width: 100%;
`;

export const Select = styled.select`
  ${Input}
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  input { transform: translateY(1px); }
`;

export const TypeChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Chip = styled.button`
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ $on, theme }) =>
    $on ? theme.colors.accent :
    (theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)")};
  color: ${({ $on, theme }) => ($on ? theme.colors.onAccent : theme.colors.accent)};
  font-weight: 700;
  cursor: pointer;
  transition: 140ms ease;
`;

export const Hint = styled.small`
  opacity: 0.75;
`;

export const PanelFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem 1rem;
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

/* ================= Extra styles for Events page ================= */
export const BackToTop = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, opacity 0.2s ease;
  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

export const ActiveFiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.mode === 'light'
      ? 'rgba(0,0,0,0.03)'
      : 'rgba(255,255,255,0.06)'};
`;

export const FiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ChipSummary = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  font-size: 0.85rem;
  font-weight: 600;
`;

export const RemoveBtn = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.onAccent};
  margin-left: 0.4rem;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ClearBtn = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;