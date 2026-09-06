import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import mockEvents from '../assets/data/mockEvents.json';
import HeroSection from '../components/layout/HeroSection';
import EventCard from '../features/events/EventCard';
import { useEvents } from '../context/EventContext';

// Deduplicate events by id
const dedupe = (arr) => {
	const seen = new Set();
	return arr.filter((ev) => {
		if (seen.has(ev.id)) return false;
		seen.add(ev.id);
		return true;
	});
};

// Fisher–Yates shuffle → returns up to n random items
const sample = (arr, n) => {
	const copy = arr.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy.slice(0, Math.min(n, copy.length));
};

export default function Home() {
	const { events, loading, error } = useEvents();

	// pick up to 3 unique events from context
	const displayedEvents = useMemo(() => {
		const source = events.length > 0 ? events : mockEvents;
		return sample(dedupe(source), 3);
	}, [events]);

	// if (loading && events.length === 0) {
	// 	return (
	// 		<Wrapper>
	// 			<p>Loading events...</p>
	// 		</Wrapper>
	// 	);
	// }

	// if (error && events.length === 0) {
	// 	return (
	// 		<Wrapper>
	// 			<p style={{ color: 'red' }}>{error}</p>
	// 		</Wrapper>
	// 	);
	// }

	return (
		<>
			<HeroSection />

			<DiscoverSection>
				<SectionTitle>Discover Upcoming Events</SectionTitle>
				<SubTitle>Here are a few highlights – want to see everything? Check them all out below.</SubTitle>

				<GridBackground>
					<Grid>
						{displayedEvents.length === 0 ? (
							<p style={{ opacity: 0.8, textAlign: 'center', gridColumn: '1/-1' }}>No events available right now.</p>
						) : (
							displayedEvents.map((event) => <EventCard key={event.id} {...event} />)
						)}
					</Grid>
				</GridBackground>
				<CtaArea>
					<CtaText>Want more events?</CtaText>
					<CtaLink to='/events' aria-label='Browse all events'>
						Browse all events →
					</CtaLink>
				</CtaArea>
			</DiscoverSection>
		</>
	);
}

// ==== styled-components ====

const Wrapper = styled.div`
	padding: 2rem;
`;

const DiscoverSection = styled.section`
	position: relative;
	padding: 6rem 2rem 8rem;
	width: 100%;
	background: ${({ theme }) =>
		theme.mode === 'dark'
			? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,255,255,0.04) 20%, ${theme.colors.background} 100%)`
			: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, ${theme.colors.background} 100%)`};
`;

const SectionTitle = styled.h2`
	font-size: clamp(2rem, 5vw, 2.8rem);
	text-align: center;
	margin-bottom: 0.5rem;
	color: ${({ theme }) => (theme.mode === 'light' ? theme.colors.text : theme.colors.accent)};
	text-shadow: ${({ theme }) => (theme.mode === 'light' ? '0 1px 0 rgba(0,0,0,0.12)' : `0 0 12px ${theme.colors.accent}`)};
`;

const SubTitle = styled.p`
	text-align: center;
	color: ${({ theme }) => theme.colors.subtext};
	opacity: 0.9;
	font-size: 1.1rem;
	margin-bottom: 2.5rem;
`;

const GridBackground = styled.div`
	padding: 3rem 2rem;
	border-radius: 24px;
	background: ${({ theme }) => (theme.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.04)')};
	backdrop-filter: ${({ theme }) => (theme.mode === 'light' ? 'none' : 'blur(8px)')};
	box-shadow: ${({ theme }) => (theme.mode === 'light' ? '0 8px 30px rgba(0,0,0,0.06)' : '0 0 20px rgba(0,255,255,0.10)')};
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
`;

const CtaArea = styled.div`
	display: grid;
	place-items: center;
	gap: 0.6rem;
	margin-top: 2rem;
`;

const CtaText = styled.p`
	margin: 0;
	opacity: 0.85;
	color: ${({ theme }) => theme.colors.subtext};
`;

const CtaLink = styled(Link)`
	display: inline-block;
	text-decoration: none;
	border: 0;
	border-radius: 999px;
	padding: 0.8rem 1.4rem;
	font-weight: 800;
	background: ${({ theme }) => theme.colors.accent};
	color: ${({ theme }) => theme.colors.onAccent};
	box-shadow: ${({ theme }) => (theme.mode === 'light' ? '0 8px 20px rgba(0,0,0,0.08)' : '0 0 18px rgba(0,255,255,.35)')};
	transition: background 0.16s ease, color 0.16s ease, transform 0.12s ease, box-shadow 0.16s ease;

	&:hover {
		background: ${({ theme }) => (theme.mode === 'light' ? 'rgba(0, 255, 255, 0.18)' : 'rgba(255,255,255,0.92)')};
		color: #000;
		box-shadow: ${({ theme }) => (theme.mode === 'light' ? '0 10px 24px rgba(0,0,0,0.12)' : '0 6px 20px rgba(0,0,0,0.25)')};
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${({ theme }) => theme.colors.accent};
		outline-offset: 3px;
	}
`;
