// src/hooks/useAuthForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to manage login/register form state and actions
 * - Handles form state, validation, errors, loading
 * - Uses AuthContext for API calls (login/register)
 */
export default function useAuthForm() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes and clear previous errors
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim() || !form.password.trim()) {
      newErrors.emptyFields = 'Username and password are required.';
    }

    if (isRegister) {
      if (!form.email.trim() || !form.name.trim() || !form.phone.trim()) {
        newErrors.emptyFields = 'All fields are required.';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.email && !emailRegex.test(form.email.trim())) {
        newErrors.email = 'Invalid email format.';
      }

      const phoneRegex = /^\d{10}$/;
      if (form.phone && !phoneRegex.test(form.phone.trim())) {
        newErrors.phone = 'Phone must be 10 digits.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login/register submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return false;

    setLoading(true);
    try {
      let result;
      if (isRegister) {
        result = await register(form);
      } else {
        result = await login(form);
      }

      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }

      // Redirect after success
      navigate('/');
      return true;
    } catch (error) {
      console.error(error);
      setErrors({
        generalErr: error.message || 'Authentication failed or server error.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegister,
    setIsRegister,
    form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}