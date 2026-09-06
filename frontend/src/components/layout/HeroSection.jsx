import { useTheme } from "styled-components";
import CTAButton from "../../styles/StyledButton";
import {
  Wrapper,
  Inner,
  Title,
  Sub,
  Actions,
  Overlay,
  BgImage,
} from "../../styles/components/HeroSection.styles";

export default function HeroSection() {
  const theme = useTheme();
  const isDark = theme.mode === "dark";

  return (
    <Wrapper>
      {/* שתי התמונות ב־DOM, מתחלפות עם opacity */}
      <BgImage
        className="light"
        style={{
          opacity: isDark ? 0 : 1,
          backgroundImage: "url(/images/hero-light.jpg)",
        }}
      />
      <BgImage
        className="dark"
        style={{
          opacity: isDark ? 1 : 0,
          backgroundImage: "url(/images/img5.jpg)",
        }}
      />

      <Inner>
        <Title>Plan. Share. Live.</Title>
        <Sub>Your events, your rules — welcome to EventLife.</Sub>

        <Actions>
          <CTAButton to="/events">Explore Events</CTAButton>
          <CTAButton to="/create">Create Event</CTAButton>
        </Actions>
      </Inner>

      <Overlay />
    </Wrapper>
  );
}