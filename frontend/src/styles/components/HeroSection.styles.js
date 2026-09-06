import styled from "styled-components";

export const Wrapper = styled.section`
  position: relative;
  min-height: 64vh;
  display: grid;
  place-items: center;
  padding: 4rem 1.5rem;
  border-radius: 0 0 24px 24px;
  overflow: hidden;
`;

export const BgImage = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 300ms ease;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "linear-gradient(to bottom, rgba(11,15,24,0.15) 0%, rgba(11,15,24,0.6) 55%, rgba(11,15,24,1) 100%)"
      : "linear-gradient(to bottom, rgba(255,255,255,0) 78%, rgba(255,255,255,0.65) 95%, rgba(255,255,255,1) 100%)"};
`;

export const Inner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1100px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: clamp(2.2rem, 6vw, 4.2rem);
  margin: 0 0 0.75rem;
  text-shadow: ${({ theme }) =>
    theme.mode === "dark"
      ? "0 0 28px rgba(0,255,255,0.6), 0 0 10px rgba(0,255,255,0.35)"
      : "0 1px 0 rgba(0,0,0,0.12)"};
  transition: text-shadow 250ms ease, color 250ms ease;
`;

export const Sub = styled.p`
  margin: 0 0 1.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  display: inline-block;
  color: ${({ theme }) => (theme.mode === "dark" ? "#FFFFFF" : "#0B0F18")};
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "rgba(0,255,255,0.35)"
      : "rgba(46,204,154,0.55)"};
  transition: background-color 250ms ease, color 250ms ease;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;