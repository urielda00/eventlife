import { useEffect } from "react";
import styled from "styled-components";

const Page = styled.main`
  --accent: ${({ theme }) => (theme.mode === "dark" ? "#00FFFF" : "#2ECC9A")};
  --accent-glow: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(0,255,255,.4)" : "rgba(46,204,154,.35)"};
  --card: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
  --stroke: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"};

  max-width: 1000px;
  margin: 0 auto;
  padding: 2.4rem 1.25rem 5rem;
  display: grid;
  gap: 1.2rem;
`;

const Title = styled.h1`
  font-size: clamp(2.1rem, 5vw, 3.2rem);
  color: var(--accent);
  text-shadow: 0 0 18px var(--accent-glow);
`;

const Intro = styled.p`
  max-width: 900px;
  line-height: 1.85;
  opacity: .92;
`;

const Block = styled.section`
  background: var(--card);
  border: 1px solid var(--stroke);
  border-radius: 14px;
  padding: 1.1rem 1rem;
`;

const H3 = styled.h3`
  margin: .1rem 0 .4rem;
  font-size: 1.05rem;
  letter-spacing: .2px;
  opacity: .95;
`;

const P = styled.p`
  line-height: 1.75;
  opacity: .9;
  margin: .4rem 0;
`;

const List = styled.ul`
  margin: .3rem 0 .6rem 1.1rem;
  line-height: 1.75;
  opacity: .9;
`;

const Small = styled.p`
  font-size: .9rem;
  opacity: .75;
`;

export default function Terms() {
  useEffect(() => { document.title = "Terms & Conditions • EventLife"; }, []);

  return (
    <Page>
      <Title>Terms & Conditions</Title>
      <Intro>
        Welcome to EventLife. By accessing or using the platform, you agree to these Terms.
        We keep the language clear and the sections short so you always know what applies.
        If you do not agree, please discontinue use of the service.
      </Intro>

      <Block>
        <H3>1) Definitions</H3>
        <P><strong>“Service”</strong> means the EventLife website and applications.</P>
        <P><strong>“Content”</strong> means text, images, links, and other material available through the Service.</P>
        <P><strong>“User Content”</strong> means content you submit, upload, or share.</P>
      </Block>

      <Block>
        <H3>2) Your Use of the Service</H3>
        <List>
          <li>Do not break the law, infringe rights, or disrupt others’ use.</li>
          <li>No scraping, reverse-engineering, or unauthorized automated access.</li>
          <li>Respect rate limits and security features.</li>
          <li>You’re responsible for activity under your account.</li>
        </List>
      </Block>

      <Block>
        <H3>3) Accounts & Security</H3>
        <P>Keep your credentials confidential and use a strong password. Notify us promptly of any suspected breach.</P>
      </Block>

      <Block>
        <H3>4) User Content & Licenses</H3>
        <P>
          You retain ownership of your User Content. By submitting it, you grant EventLife a worldwide, non-exclusive,
          royalty-free license to host, display, and distribute it solely to operate and improve the Service.
        </P>
        <P>You agree your content will not violate laws, third-party rights, or these Terms. We may remove content that violates policies.</P>
      </Block>

      <Block>
        <H3>5) Intellectual Property</H3>
        <P>
          The Service, including design, logos, and software, is owned by or licensed to EventLife and protected by law.
          You may not use our branding without prior written permission.
        </P>
      </Block>

      <Block>
        <H3>6) Privacy</H3>
        <P>
          We respect your privacy and aim to collect the minimum data needed to provide the Service.
          See our Privacy summary in the <strong>About</strong> page and dedicated policy when available.
        </P>
      </Block>

      <Block>
        <H3>7) Third-Party Links & Integrations</H3>
        <P>
          Event pages may include links or integrations (e.g., ticketing). We are not responsible for third-party
          content, policies, or practices. Review their terms before using.
        </P>
      </Block>

      <Block>
        <H3>8) Availability & Changes</H3>
        <P>
          We may modify or discontinue features at any time. We strive for high availability but do not guarantee
          uninterrupted access. Material changes to these Terms will be posted with an updated date.
        </P>
      </Block>

      <Block>
        <H3>9) Disclaimers</H3>
        <P>
          The Service is provided “as is” and “as available” without warranties of any kind, express or implied,
          including merchantability, fitness for a particular purpose, and non-infringement.
        </P>
      </Block>

      <Block>
        <H3>10) Limitation of Liability</H3>
        <P>
          To the maximum extent permitted by law, EventLife will not be liable for indirect, incidental, special,
          consequential, or punitive damages, or any loss of data, profits, or revenues.
        </P>
      </Block>

      <Block>
        <H3>11) Termination</H3>
        <P>
          We may suspend or terminate access if these Terms are violated or to protect the Service or users.
          You may stop using the Service at any time.
        </P>
      </Block>

      <Block>
        <H3>12) Governing Law</H3>
        <P>
          These Terms are governed by applicable local laws where the Service is operated. Disputes will be handled
          in the competent courts of that jurisdiction unless required otherwise by law.
        </P>
      </Block>

      <Small>Last updated: 11 Sept 2025</Small>
    </Page>
  );
}
