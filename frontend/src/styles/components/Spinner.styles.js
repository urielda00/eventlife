import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loader = styled.div`
  border: 4px solid rgba(0, 255, 255, 0.15);
  border-top: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 0.8s linear infinite;
  margin: 1rem auto;
  box-shadow: 0 0 12px ${({ theme }) => theme.colors.accent};
`;