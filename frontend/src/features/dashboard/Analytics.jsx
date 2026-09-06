

// unfinished page!!
import styled from 'styled-components';

export default function Analytics() {
	return (
		<Container>
			<h2>Analytics</h2>
			<Grid>
				<StatCard>
					Total Events
					<br /> 12
				</StatCard>
				<StatCard>
					Attendees
					<br /> 300+
				</StatCard>
				<StatCard>
					Views This Month
					<br /> 1,024
				</StatCard>
			</Grid>
		</Container>
	);
}

const Container = styled.div`
	padding: 2rem;
`;

const StatCard = styled.div`
	background-color: ${({ theme }) => theme.colors.card};
	padding: 1.5rem;
	border-radius: 12px;
	text-align: center;
	font-weight: bold;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 2rem;
	margin-top: 2rem;
`;
