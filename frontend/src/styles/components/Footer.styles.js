import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Wrapper = styled.footer`
	margin-top: 5rem;
	padding: 2rem 1rem;
	background: ${({ theme }) => theme.colors.card};
	backdrop-filter: saturate(180%) blur(10px);
	border-top: 1px solid ${({ theme }) => theme.colors.border};
	box-shadow: 0 -8px 22px rgba(0, 0, 0, 0.06);
`;

export const Content = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	text-align: center;
`;

export const Brand = styled.h3`
	font-size: 1.4rem;
	font-weight: 800;
	color: ${({ theme }) => theme.colors.accent};
	margin: 0;
	text-shadow: ${({ theme }) => (theme.mode === 'dark' ? '0 0 8px rgba(0,255,255,0.30)' : '0 1px 0 rgba(0,0,0,0.10)')};
`;

export const Links = styled.nav`
	display: flex;
	justify-content: center;
	gap: 1.25rem;
	flex-wrap: wrap;
`;

export const FooterLink = styled(Link)`
	text-decoration: none;
	color: ${({ theme }) => theme.colors.text};
	opacity: 0.85;
	font-size: 0.95rem;
	padding: 4px 6px;
	border-radius: 8px;
	transition: color 180ms ease, background 180ms ease;

	&:hover {
		color: ${({ theme }) => theme.colors.accent};
		background: ${({ theme }) => (theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.06)')};
	}

	&:focus-visible {
		outline: 2px solid ${({ theme }) => theme.colors.accent};
		outline-offset: 3px;
	}
`;

export const Copy = styled.small`
	font-size: 0.85rem;
	color: ${({ theme }) => theme.colors.subtext};
	opacity: 0.75;
`;
