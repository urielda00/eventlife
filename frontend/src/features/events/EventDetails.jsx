import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchEventById, joinEvent, leaveEvent } from "../../services/eventService";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const stateImage = location.state?.image;

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent((prev) => ({
          ...data,
          image: data.image || stateImage || prev?.image,
        }));
      } catch (e) {
        setError(e?.message || "Failed to load event.");
      }
    };
    loadEvent();
  }, [id, stateImage]);

  if (error) return <Wrapper><Message>🚫 {error}</Message></Wrapper>;
  if (!event) return <Wrapper><Message>Loading...</Message></Wrapper>;

  const count = event.participants?.length ?? 0;
  const cap = event.maxParticipants ?? 0;
  const isFull = cap > 0 && count >= cap;

  const isParticipant = event.participants?.some(
    (p) => p === user?.username
  );

  const handleJoin = async () => {
    if (isFull || joining || isParticipant) return;
    if (!user) {
      navigate("/auth", { state: { from: `/events/${id}` } });
      return;
    }

    setJoining(true);
    try {
      const updated = await joinEvent(id, user.username);
      setEvent((prev) => ({
        ...updated,
        participants: [...(prev?.participants || []), user.username],
      }));
    } catch (e) {
      setError(e?.message || "Failed to join event.");
      setTimeout(() => setError(""), 2500);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    setJoining(true);
    try {
      const updated = await leaveEvent(id, user.username);
      setEvent((prev) => ({
        ...updated,
        participants: (prev?.participants || []).filter((p) => p !== user.username),
      }));
    } catch (e) {
      setError(e?.message || "Failed to leave event.");
      setTimeout(() => setError(""), 2500);
    } finally {
      setJoining(false);
    }
  };

  const eventDate = event.date ? new Date(event.date).toLocaleString() : "No date";

  return (
    <Wrapper>
      {event.image && <Banner src={event.image} alt={event.title} />}
      <Content>
        <Title>{event.title}</Title>
        <Meta>
          <span>📅 {eventDate}</span>
          <span>📍 {event.location || "No location"}</span>
          <span>👥 {event.participants?.length ?? 0}{cap ? ` / ${cap}` : ""} participants</span>
        </Meta>
        <Description>{event.description || "No description provided."}</Description>

        <AnimatePresence mode="wait">
          {!isParticipant ? (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <JoinButton
                onClick={handleJoin}
                disabled={joining || isFull}
              >
                {isFull
                  ? "Event Full 🚫"
                  : joining
                    ? "Joining..."
                    : "Join Event"}
              </JoinButton>
            </motion.div>
          ) : (
            <motion.div
              key="leave"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <RegisteredText>🎉 You are registered for this event</RegisteredText>
              <LeaveButton onClick={handleLeave} disabled={joining}>
                {joining ? "Leaving..." : "Leave Event"}
              </LeaveButton>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <ErrorText>{error}</ErrorText>}
      </Content>
    </Wrapper>
  );
}

/* styles */
const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 4rem auto;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
  overflow: hidden;
`;
const Banner = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;
const Content = styled.div`padding: 2rem;`;
const Title = styled.h1`
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;
  text-shadow: 0 0 8px ${({ theme }) => theme.colors.accent};
`;
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 1rem;
`;
const Description = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;
const JoinButton = styled.button`
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00ffff, #1defff);
  color: #0b0f18;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  &:hover:not(:disabled) { box-shadow: 0 0 18px #00ffff; transform: translateY(-2px); }
  &:disabled { opacity: .55; cursor: not-allowed; background: #aaa; }
`;
const RegisteredText = styled.p`
  color: #2ecc71;
  font-weight: 600;
  margin-top: 1rem;
`;
const LeaveButton = styled.button`
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff335a, #ff6b81);
  color: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 0.8rem;
  transition: 0.3s ease-in-out;
  &:hover:not(:disabled) {
    box-shadow: 0 0 18px #ff335a;
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: .55;
    cursor: not-allowed;
    background: #aaa;
  }
`;
const Message = styled.p`
  text-align: center;
  padding: 4rem;
  color: #ccc;
  font-size: 1.2rem;
`;
const ErrorText = styled.p`
  color: #ff335a;
  font-weight: 600;
  margin-top: 1rem;
`;