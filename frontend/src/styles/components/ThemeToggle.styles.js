import styled from "styled-components";

export const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 0.95rem;
  transition: 
    transform 120ms ease,
    background-color 250ms ease,
    color 250ms ease,
    border-color 250ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ theme }) => theme.colors.accent};
  transition: background-color 250ms ease;
`;

export const Label = styled.span`
  line-height: 1;
  transition: color 250ms ease;
`;

export const Icon = styled.span`
  font-size: 1rem;
  line-height: 1;
  transition: color 250ms ease;
`;
