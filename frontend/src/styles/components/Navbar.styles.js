import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

/* Breakpoints */
const bp = {
  md: "768px",
};

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 999;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  padding: 0.85rem 1.25rem;
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  text-shadow: ${({ theme }) =>
    theme.mode === "dark"
      ? "0 0 10px rgba(0,255,255,0.35)"
      : "0 1px 0 rgba(0,0,0,0.10)"};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 6px;
  }
`;

/* Desktop nav links: hidden on mobile */
export const NavLinks = styled.div`
  display: none;
  gap: 1.1rem;
  align-items: center;

  @media (min-width: ${bp.md}) {
    display: flex;
  }
`;

export const NavItem = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  padding: 6px 8px;
  border-radius: 8px;
  transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) =>
      theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)"};
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const LogoutButton = styled.button.attrs({ type: "button" })`
  appearance: none;
  background: transparent;
  border: none;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) =>
      theme.mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.06)"};
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

/* Overlay behind the mobile drawer */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)"};
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
  z-index: 950;

  &[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
  }

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

/* Mobile hamburger: hidden on desktop; hidden when drawer open */
export const Hamburger = styled.button`
  position: relative;
  width: 38px;
  height: 34px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;

  /* Hide button when drawer is open to avoid double "X" */
  ${({ $open }) =>
    $open &&
    css`
      visibility: hidden;
    `}

  @media (min-width: ${bp.md}) {
    display: none;
  }

  span {
    position: absolute;
    width: 60%;
    height: 2px;
    background: ${({ theme }) => theme.colors.text};
    transition: transform 200ms ease, opacity 200ms ease;
  }
  span:nth-child(1) {
    transform: translateY(-8px);
  }
  span:nth-child(2) {
    transform: translateY(0);
  }
  span:nth-child(3) {
    transform: translateY(8px);
  }

  &[aria-expanded="true"] span:nth-child(1) {
    transform: rotate(45deg);
  }
  &[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
  }
  &[aria-expanded="true"] span:nth-child(3) {
    transform: rotate(-45deg);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

/* Mobile sliding drawer (right side) */
export const MobileMenu = styled.aside`
  position: fixed;
  /* תיקון: זז ב-1px כדי שלא יגרום לגלילה אופקית ב-Chrome */
  inset: 0 -1px 0 auto;
  width: min(82vw, 340px);
  height: 100dvh;

  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(11,15,24,0.94)" : "rgba(255,255,255,0.95)"};

  border-left: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px) saturate(140%);

  transform: translateX(100%);
  transition: transform 240ms ease;
  z-index: 1000;

  display: flex;
  flex-direction: column;

  will-change: transform;
  contain: paint;

  &[data-open="true"] {
    transform: translateX(0);
  }

  @media (min-width: ${bp.md}) {
    display: none;
  }
`;

export const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MobileTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.2px;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const MobileLinks = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 16px 8px;
  gap: 4px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const MobileItem = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  padding: 12px 12px;
  border-radius: 10px;
  transition: background 160ms ease, color 160ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) =>
      theme.mode === "light"
        ? "rgba(0,0,0,0.04)"
        : "rgba(255,255,255,0.08)"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const MobileLogout = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-align: left;
  padding: 12px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) =>
      theme.mode === "light"
        ? "rgba(0,0,0,0.04)"
        : "rgba(255,255,255,0.08)"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const MobileExtras = styled.div`
  margin-top: 8px;
  padding: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 10px;
`;
