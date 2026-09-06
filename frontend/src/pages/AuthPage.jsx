import { useState } from 'react';
import styled from 'styled-components';
import Spinner from '../components/ui/Spinner';
import useAuthForm from '../hooks/useAuthForm';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { isTokenValid } from '../services/authService';

export default function AuthPage() {
  const {
    isRegister,
    setIsRegister,
    form,
    errors,
    loading,
    handleChange,
    handleSubmit
  } = useAuthForm();

  const { login, refresh } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const onSubmit = async (e) => {
    const ok = await handleSubmit(e);

    // If login/register succeeded → context already updated
    if (ok) {
      navigate(from, { replace: true });
      return;
    }

    // Fallback: if token is still valid, rehydrate from localStorage
    if (isTokenValid()) {
      const refreshed = await refresh();
      if (refreshed) {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <Wrapper>
      <FormBox>
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p>{isRegister ? 'Register to join' : 'Please login to your account'}</p>

        <form onSubmit={onSubmit} noValidate>
          <Input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <CheckboxWrapper>
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </CheckboxWrapper>

          {isRegister && (
            <>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
            </>
          )}

          {errors.emptyFields && <FieldError>{errors.emptyFields}</FieldError>}
          {errors.email && <FieldError>{errors.email}</FieldError>}
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
          {errors.generalErr && <FieldError>{errors.generalErr}</FieldError>}

          {loading ? (
            <Spinner />
          ) : (
            <SubmitButton type="submit">
              {isRegister ? 'Register' : 'Login'}
            </SubmitButton>
          )}
        </form>

        <Toggle onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Toggle>
      </FormBox>
    </Wrapper>
  );
}

// ------------------ styles ------------------ //
const Wrapper = styled.div`
  min-height: calc(100vh - 4.5rem);
  display: grid;
  place-items: center;
  padding: 2rem;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'radial-gradient(60% 60% at 20% 20%, rgba(0,255,255,0.08) 0%, rgba(11,15,24,0) 40%), #0B0F18'
      : theme.colors.bg};
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 2.2rem;
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;

  h2 {
    font-size: 2rem;
    margin: 0 0 0.35rem;
    color: ${({ theme }) => (theme.mode === 'light' ? theme.colors.text : theme.colors.accent)};
    text-shadow: ${({ theme }) =>
      theme.mode === 'light' ? '0 1px 0 rgba(0,0,0,0.12)' : '0 0 18px rgba(0,255,255,0.45)'};
  }

  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.subtext};
    opacity: 0.9;
    margin-bottom: 1.6rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.subtext}; opacity: 0.85; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(0,255,255,0.2);
    background-color: ${({ theme }) =>
      theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)'};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 0;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .12s ease, background .2s ease, box-shadow .2s ease;

  background: ${({ theme }) =>
    theme.mode === 'light'
      ? theme.colors.accent
      : 'linear-gradient(90deg, #00E8FF 0%, #2EA8FF 100%)'};
  color: ${({ theme }) => theme.colors.onAccent};

  box-shadow: ${({ theme }) =>
    theme.mode === 'light'
      ? '0 8px 20px rgba(0,0,0,0.08)'
      : '0 0 18px rgba(0,255,255,.35)'};

  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: .6; pointer-events: none; }
`;

const FieldError = styled.p`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Toggle = styled.button`
  margin-top: 1rem;
  background: none;
  border: 0;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.subtext};
  margin-bottom: 1rem;

  input { accent-color: ${({ theme }) => theme.colors.accent}; }
  input, label { cursor: pointer; }
`;