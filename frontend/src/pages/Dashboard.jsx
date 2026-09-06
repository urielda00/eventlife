import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EventCard from "../features/events/EventCard";
import Spinner from "../components/ui/Spinner";
import { fetchCreatedEvents, fetchJoinedEvents } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

// ---- Safe getters ----
const getUserId = (u) => u?.id ?? u?.userId ?? u?.uid ?? null;
const getUserName = (u) =>
  u?.name || u?.fullName || u?.username || u?.email?.split("@")?.[0] || "User";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = getUserId(user);
  const username = getUserName(user);

  // Load created & joined events from backend
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        if (!userId) return;

        const [created, joined] = await Promise.all([
          fetchCreatedEvents(userId),
          fetchJoinedEvents(userId),
        ]);

        if (alive) {
          setCreatedEvents(created);
          setJoinedEvents(joined);
        }
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load events");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const createdCount = createdEvents.length;
  const joinedCount = joinedEvents.length;

  if (!user) {
    return (
      <Message>
        <h3>You must be logged in to view your dashboard</h3>
        <ButtonsRow>
          <Button onClick={() => navigate("/")}>⬅ Back to Home</Button>
          <Button onClick={() => navigate("/auth")}>Sign In / Register</Button>
        </ButtonsRow>
      </Message>
    );
  }

  if (loading) {
    return (
      <Message>
        <Spinner /> Loading your events...
      </Message>
    );
  }

  if (error) {
    return <Message>❌ Loading error: {error}</Message>;
  }

  return (
    <Wrapper
      as={motion.main}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <HeaderRow>
        <Title>Dashboard</Title>
        <ButtonsRow>
          <Button onClick={() => navigate("/")}>⬅ Back to Home</Button>
          <Button onClick={() => navigate("/events")}> View All Events</Button>
        </ButtonsRow>
      </HeaderRow>

      {/* User summary */}
      <StatsBar>
        <StatCard>
          <StatLabel>Username</StatLabel>
          <StatValue>{username}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Events Joined</StatLabel>
          <StatValue>{joinedCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Events Created</StatLabel>
          <StatValue>{createdCount}</StatValue>
        </StatCard>
      </StatsBar>

      {/* Joined events */}
      <Section>
        <SectionTitle>My Joined Events</SectionTitle>
        <Grid>
          {joinedEvents.length ? (
            joinedEvents.map((ev) => <EventCard key={ev.id} {...ev} />) // ✅ props נפרסים
          ) : (
            <Empty>You haven’t joined any events yet.</Empty>
          )}
        </Grid>
      </Section>

      {/* Created events */}
      <Section>
        <SectionTitle>My Created Events</SectionTitle>
        <Grid>
          {createdEvents.length ? (
            createdEvents.map((ev) => <EventCard key={ev.id} {...ev} />) // ✅ props נפרסים
          ) : (
            <Empty>You haven’t created any events yet.</Empty>
          )}
        </Grid>
      </Section>
    </Wrapper>
  );
};

export default Dashboard;

/* ------------ styled ------------- */
const Wrapper = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 0;
  color: ${({ theme }) => theme.colors?.accent || "#00ffff"};
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.35);
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border-radius: 12px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease, color 150ms ease;

  background: ${({ theme }) => theme.colors.button?.bg ?? theme.colors.card};

  border: 1px solid ${({ theme }) => theme.colors.button?.border ?? theme.colors.border};

  color: ${({ theme }) => (theme.mode === "dark" ? "#FFFFFF" : "#0B0F18")};

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.button?.bgHover ?? theme.colors.card};
    color: ${({ theme }) => (theme.mode === "dark" ? "#FFFFFF" : "#0B0F18")};
    box-shadow: ${({ theme }) =>
      theme.mode === "dark"
        ? "0 0 12px rgba(0,255,255,0.35)"
        : "0 0 12px rgba(46,204,154,0.35)"};
  }
`;



const StatsBar = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors?.card || "rgba(255,255,255,0.06)"};
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 1rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const Section = styled.section`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.1rem, 2.2vw, 1.3rem);
  margin: 0 0 0.75rem;
  opacity: 0.9;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const Message = styled.div`
  padding: 2rem 1.25rem;
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
`;

const Empty = styled.div`
  padding: 1rem;
  opacity: 0.7;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 12px;
`;