import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import EventCard from "../features/events/EventCard";
import Spinner from "../components/ui/Spinner";
import useUserEvents from "../hooks/useUserEvents";

export default function MyEvents() {
  const { user } = useAuth();
  const { createdEvents, loading, error } = useUserEvents(
    user?.id,
    user?.username
  );

  if (!user) {
    return <Message>You must be logged in</Message>;
  }

  if (loading) {
    return (
      <Message>
        <Spinner /> Loading your events...
      </Message>
    );
  }

  if (error) {
    return <Message>❌ Failed to load events: {error}</Message>;
  }

  if (!createdEvents || createdEvents.length === 0) {
    return <Message>No events created yet</Message>;
  }

  return (
    <Container>
      <Title>🎉 My Events</Title>
      <Grid>
        {createdEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </Grid>
    </Container>
  );
}

/* -------------------- styled -------------------- */

const Container = styled.div`
  padding: 6rem 2rem;
  max-width: 1300px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.accent};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const Message = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;