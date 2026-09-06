import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.accent};
`;

const Text = styled.p`
  margin: 1rem 0;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
`;

export default function NotFound() {
  return (
    <Wrapper>
      <Title>404</Title>
      <Text>Oops! Page not found.</Text>
      <StyledLink to="/">Go back to homepage</StyledLink>
    </Wrapper>
  );
}
