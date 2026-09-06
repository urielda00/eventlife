import styled from "styled-components";
import { Link } from "react-router-dom";
import CreateEventForm from "../features/events/CreateEventForm";

const Wrapper = styled.main`
  min-height: 100vh;
  padding: 4rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: ${({ theme }) => theme.colors?.background || "#0B0F18"};
`;

const Card = styled.section`
  width: 100%;
  max-width: 860px;
  background: ${({ theme }) => theme.colors?.card || "rgba(255,255,255,0.06)"};
  border-radius: 16px;
  padding: 2rem 1.25rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (min-width: 768px) {
    padding: 2.5rem 2rem;
  }
`;

const Header = styled.header`
  margin: 0 0 1.25rem 0;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.accent};
`;

const Sub = styled.p`
  margin: 0.4rem 0 1.25rem;
  opacity: 0.85;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  transition: transform 0.12s ease-in-out, background 0.12s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.06);
  }

  color: ${({ theme }) => theme.colors.text};
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
  font-weight: 800;
`;

export default function CreateEvent() {
  return (
    <Wrapper>
      <Card>
        <TopBar>
          <BackLink to="/events">
            ← Back to <Accent>Events</Accent>
          </BackLink>
        </TopBar>

        <Header>
          <Title>Create a New Event</Title>
          <Sub>Fill the form below to add a new event to EventLife.</Sub>
        </Header>

        <CreateEventForm />
      </Card>
    </Wrapper>
  );
}