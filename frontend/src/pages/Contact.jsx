import { useRef } from "react";
import styled from "styled-components";

const Contact = () => {
  const firstFieldRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! Your request has been received. We will be in touch.");

    // Reset form fields
    e.currentTarget.reset();

    // Focus first field again
    firstFieldRef.current?.focus();
  };

  return (
    <Wrapper>
      <Title>Contact Us</Title>
      <Small>Have feedback, bugs, or partnership ideas? Reach out below.</Small>

      <Form onSubmit={onSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" required ref={firstFieldRef} />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </Field>

        <Field>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" placeholder="Tell us more..." required />
        </Field>

        <Button type="submit">Send</Button>
      </Form>
    </Wrapper>
  );
};

export default Contact;

/* ------------------ styled components ------------------ */

const Wrapper = styled.main`
  --accent: ${({ theme }) => (theme.mode === "dark" ? "#00FFFF" : "#2ECC9A")};
  --accent-glow: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(0,255,255,0.4)" : "rgba(46,204,154,0.4)"};
  --card: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
  --stroke: ${({ theme }) =>
    theme.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)"};

  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 1rem;
  color: var(--accent);
  text-shadow: 0 0 12px var(--accent-glow);
`;

const Form = styled.form`
  display: grid;
  gap: 1.2rem;
  margin-top: 1rem;
`;

const Field = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  opacity: 0.9;
`;

const Input = styled.input`
  background: var(--card);
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: ${({ theme }) => (theme.mode === "dark" ? "#fff" : "#0B0F18")};
  outline: none;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 8px var(--accent-glow);
  }
`;

const Textarea = styled.textarea`
  background: var(--card);
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: ${({ theme }) => (theme.mode === "dark" ? "#fff" : "#0B0F18")};
  min-height: 140px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 8px var(--accent-glow);
  }
`;

const Button = styled.button`
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1.4rem;
  font-weight: 700;
  cursor: pointer;
  background: var(--accent);
  color: ${({ theme }) => (theme.mode === "dark" ? "#0B0F18" : "#fff")};
  box-shadow: 0 0 22px var(--accent-glow);
  transition: transform 0.12s ease;
  width: fit-content;

  &:active {
    transform: scale(0.98);
  }
`;

const Small = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;
