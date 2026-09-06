// src/styles/StyledButton.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CTAButton = styled(Link)`
  background: ${({ theme }) =>
    theme.mode === 'dark' ? '#00FFFF' : '#2ECC9A'};
  color: ${({ theme }) =>
    theme.mode === 'dark' ? '#0B0F18' : '#FFFFFF'};
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 0 10px
    ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0,255,255,0.4)' : 'rgba(46,204,154,0.35)')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 14px
      ${({ theme }) => (theme.mode === 'dark' ? '#00FFFF' : '#2ECC9A')};
    color: ${({ theme }) =>
      theme.mode === 'dark' ? '#0B0F18' : '#FFFFFF'}; /* שמירה על אותו צבע טקסט */
  }
`;

export default CTAButton;
