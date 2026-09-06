import { useEffect } from "react";
import styled from "styled-components";

const Page = styled.main`
  --accent: ${({ theme }) => (theme.mode === "dark" ? "#00FFFF" : "#2ECC9A")};
  --accent-glow: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(0,255,255,.45)" : "rgba(46,204,154,.35)"};
  --card: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
  --stroke: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"};

  max-width: 1100px;
  margin: 0 auto;
  padding: 2.4rem 1.25rem 6.75rem;
  display: grid;
  gap: 2rem;
`;

const Hero = styled.section`
  display: grid;
  gap: 1rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  color: var(--accent);
  text-shadow: 0 0 22px var(--accent-glow);
`;

const Lead = styled.p`
  margin: 0 auto;
  max-width: 850px;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.9;
  opacity: 0.92;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.25rem;
  align-items: stretch;
`;

const Card = styled.article`
  grid-column: span 12;
  background: var(--card);
  border: 1px solid var(--stroke);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;
  background-clip: padding-box;
  isolation: isolate;

  @media (min-width: 820px) {
    grid-column: span ${props => props.span || 6};
  }
`;

const CardTitle = styled.h3`
  margin-bottom: .5rem;
  font-size: 1.15rem;
  letter-spacing: .2px;
  opacity: .95;
`;

const P = styled.p`
  line-height: 1.8;
  opacity: .9;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  margin-top: .75rem;
`;

const Badge = styled.span`
  border: 1px dashed var(--stroke);
  border-radius: 999px;
  padding: .4rem .7rem;
  font-size: .9rem;
  opacity: .85;
`;

const Highlight = styled.span`
  color: var(--accent);
`;

const Timeline = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: .9rem;
`;

const Dot = styled.span`
  display: inline-block;
  width: .55rem;
  height: .55rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow);
  margin-right: .6rem;
`;

const StatWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: .8rem;
`;

const Stat = styled.div`
  flex: 1 1 160px;
  min-width: 150px;
  box-sizing: border-box;
  background: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
  border: 1px solid var(--stroke);
  border-radius: 14px;
  padding: .9rem;
  text-align: center;
  overflow: hidden;
`;

const StatNum = styled.div`
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent-glow);
  font-weight: 800;
`;

const StatLbl = styled.div`
  opacity: .75;
  font-size: .95rem;
`;

const CTA = styled.div`
  text-align: center;
  margin-top: .5rem;
  opacity: .85;
`;

export default function About() {
  useEffect(() => { document.title = "About • EventLife"; }, []);

  return (
    <Page>
      <Hero>
        <Title>About EventLife</Title>
        <Lead>
          <Highlight>EventLife</Highlight> is a modern platform for discovering, planning,
          and sharing events. We obsess over speed, clarity, and the tiny details that make
          browsing feel effortless. With real-time updates, clean design, and privacy-first
          choices, EventLife helps you move from <em>idea</em> to <em>experience</em>.
        </Lead>
      </Hero>

      
      <Grid>
        <Card span={7}>
          <CardTitle>Our Mission</CardTitle>
          <P>
            Make experiences <strong>accessible</strong> and <strong>memorable</strong>.
            We build tools that remove noise and surface what matters: who’s going, when it’s
            happening, and how to make the most of it. We keep the interface minimal and the
            workflows intuitive, so you can focus on the event—not the app.
          </P>
          <BadgeRow>
            <Badge>Minimal UI</Badge>
            <Badge>Fast by default</Badge>
            <Badge>Mobile-first</Badge>
            <Badge>Privacy-aware</Badge>
          </BadgeRow>
        </Card>

        <Card span={5}>
          <CardTitle>How We Think</CardTitle>
          <P>
            Ship small, learn fast, and polish relentlessly. We believe in clear copy,
            meaningful animations, and predictable navigation. The <Highlight>Neon Ice</Highlight> theme
            reflects our design values: crisp, cool, and focused.
          </P>
        </Card>

        <Card span={6}>
          <CardTitle>What You Can Do</CardTitle>
          <P>
            Explore local and global events, track your plans, and coordinate with friends.
            Create events with rich details, manage RSVPs, and keep everything synced on any device.
          </P>
          <BadgeRow>
            <Badge>Discovery</Badge>
            <Badge>Smart Filters</Badge>
            <Badge>Shareable Links</Badge>
            <Badge>Favorites</Badge>
          </BadgeRow>
        </Card>

        <Card span={6}>
          <CardTitle>Under the Hood</CardTitle>
          <P>
            Built with React and styled-components, optimized for bundle size and runtime
            performance. We aim for semantic markup, accessible components, and minimal
            dependencies—so the experience stays fast and stable.
          </P>
        </Card>

        <Card span={7}>
          <CardTitle>Roadmap Highlights</CardTitle>
          <Timeline>
            <li><Dot/>Personalized recommendations with explainable signals.</li>
            <li><Dot/>Collaborative planning: shared lists, notes, and roles.</li>
            <li><Dot/>Offline-friendly mode for spotty connections.</li>
            <li><Dot/>Creator tools: templates, analytics, and ticketing integrations.</li>
          </Timeline>
        </Card>

        <Card span={5}>
          <CardTitle>By the Numbers (demo)</CardTitle>
          <StatWrap>
            <Stat>
              <StatNum>120+</StatNum>
              <StatLbl>Cities</StatLbl>
            </Stat>
            <Stat>
              <StatNum>3.2K</StatNum>
              <StatLbl>Curated Events</StatLbl>
            </Stat>
            <Stat>
              <StatNum>98%</StatNum>
              <StatLbl>Uptime</StatLbl>
            </Stat>
            <Stat>
              <StatNum>~0.3s</StatNum>
              <StatLbl>Median TTFB</StatLbl>
            </Stat>
          </StatWrap>
        </Card>
      </Grid>

      <CTA>
        Want to partner or suggest a feature? Head to <strong>Contact</strong> and drop us a line.
      </CTA>
    </Page>
  );
}
