import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Card = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)"};
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem;
`;

const Line = styled.div`
  height: ${(p) => p.height || "1rem"};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.08) 25%,
    rgba(255,255,255,0.2) 50%,
    rgba(255,255,255,0.08) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;

export default function EventSkeleton() {
  return (
    <Card>
      <Line height="160px" /> {/* image placeholder */}
      <Line height="1.2rem" />
      <Line height="1rem" style={{ width: "70%" }} />
      <Line height="0.9rem" style={{ width: "40%" }} />
    </Card>
  );
}