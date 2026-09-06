import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MotionLink = motion.create(Link);

export default function EventCard({
  id,
  title,
  date,
  location,
  image,
  description,
  participants = [],
  maxParticipants
}) {
  const { user } = useAuth();
  const eventDate = date ? new Date(date).toLocaleDateString() : "No date";
  const detailsPath = `/events/${id}`;

  const isParticipant = participants?.some((p) => p === user?.username);
  const count = participants?.length ?? 0;
  const isFull = maxParticipants > 0 && count >= maxParticipants;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {image && (
        <ImageLink to={detailsPath}>
          <Image src={image} alt={title} />
        </ImageLink>
      )}

      <Content>
        <TitleLink to={detailsPath}>{title}</TitleLink>

        <Details>
          <Detail><FaCalendarAlt /> {eventDate}</Detail>
          <Detail><FaMapMarkerAlt /> {location || "No location"}</Detail>
          <Detail><FaUsers /> {count}{maxParticipants ? ` / ${maxParticipants}` : ""} participants</Detail>
        </Details>

        <Description>{description || "No description provided."}</Description>

        <ButtonArea>
          <JoinButton
            to={detailsPath}
            $disabled={isParticipant || isFull}
          >
            {isParticipant
              ? "✔️ Registered"
              : isFull
                ? "Event Full 🚫"
                : "View Details"}
          </JoinButton>
        </ButtonArea>
      </Content>
    </Card>
  );
}

/* ================== styles ================== */
const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease;
`;

const ImageLink = styled(MotionLink)`
  display: block;
  line-height: 0;
  &:hover {
    filter: brightness(1.03);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex-grow: 1;
`;

const TitleLink = styled(MotionLink)`
  display: inline-block;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.8rem;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.85;

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  margin: 0.5rem 0 1rem;
  flex-grow: 1;
`;

const ButtonArea = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
`;

const JoinButton = styled(Link)`
  background: ${({ $disabled, theme }) =>
    $disabled ? "#aaa" : theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};

  &:hover {
    ${({ $disabled, theme }) =>
      !$disabled &&
      `
        box-shadow: 0 0 8px ${theme.colors.accent};
        transform: scale(1.05);
      `}
  }
`;