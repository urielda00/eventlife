// src/features/events/CreateEventForm.jsx
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { createEvent } from '../../services/eventService';
import Spinner from '../../components/ui/Spinner';
import FancyDateTimePicker from '../../components/ui/FancyDateTimePicker';

const EVENT_TYPES = ['PRIVATE_PARTY', 'PUBLIC_PARTY', 'FAMILY_EVENT'];

export default function CreateEventForm() {
	// Local form state
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		location: '',
		date: '', // "YYYY-MM-DDTHH:mm" (local) – controlled by NiceDateTimePicker
		eventType: 'PRIVATE_PARTY',
		maxParticipants: '',
		ownerId: 1, // TODO: replace with logged-in user id
	});

	// UI state
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Generic input handler
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Keep maxParticipants numeric-only (no negative / non-digit chars)
		if (name === 'maxParticipants') {
			const onlyDigits = value.replace(/[^\d]/g, '');
			setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
			return;
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Validate if selected date-time is in the past (client-side guard)
	const isPast = useMemo(() => {
		if (!formData.date) return false;
		const selected = new Date(formData.date); // "datetime-local" style string -> treated as local time
		const now = new Date();
		return selected < now;
	}, [formData.date]);

	// Form-level invalid flag (controls submit button + early return)
	const isInvalid =
		!formData.name ||
		!formData.location ||
		!formData.date ||
		!formData.eventType ||
		!formData.maxParticipants ||
		Number(formData.maxParticipants) <= 0 ||
		isPast;

	// Submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		// Final guard before hitting the API
		if (isInvalid) {
			setLoading(false);
			setError(isPast ? 'Event date must be in the future.' : 'Please fill all fields correctly.');
			return;
		}

		try {
			await createEvent({
				...formData,
				maxParticipants: Number(formData.maxParticipants),
			});
			setSuccess('Event created successfully!');
			setFormData({
				name: '',
				description: '',
				location: '',
				date: '',
				eventType: 'PRIVATE_PARTY',
				maxParticipants: '',
				ownerId: 1,
			});
		} catch (err) {
			console.error(err);
			setError('Failed to create event. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit} noValidate>
			<FormTitle>Create Event</FormTitle>

			<Field>
				<Label>Event Name</Label>
				<PrettyInput name='name' placeholder='e.g. Neon Tech Night' value={formData.name} onChange={handleChange} />
			</Field>

			<Field>
				<FancyDateTimePicker
					value={formData.date}
					onChange={(val) => setFormData((p) => ({ ...p, date: val }))}
					stepMinutes={30}
					min={new Date()}
					label='Date & Time'
				/>
				<Hint>{isPast ? <BadHint>Selected time is in the past. Please pick a future time.</BadHint> : 'Pick a future date & time.'}</Hint>
			</Field>

			<Field>
				<Label>Location</Label>
				<PrettyInput name='location' placeholder='City, venue or address' value={formData.location} onChange={handleChange} />
			</Field>

			<Field>
				<Label>Type</Label>
				<Select name='eventType' value={formData.eventType} onChange={handleChange}>
					{EVENT_TYPES.map((type) => (
						<option key={type} value={type}>
							{type.replace('_', ' ')}
						</option>
					))}
				</Select>
			</Field>

			<Field>
				<Label>Max Participants</Label>
				<PrettyInput name='maxParticipants' type='number' min='1' step='1' placeholder='e.g. 100' value={formData.maxParticipants} onChange={handleChange} />
			</Field>

			<Field>
				<Label>Description</Label>
				<TextArea name='description' rows='4' placeholder='What makes this event special?' value={formData.description} onChange={handleChange} />
			</Field>

			{loading ? (
				<Spinner />
			) : (
				<Button type='submit' disabled={isInvalid} aria-disabled={isInvalid}>
					Create Event
				</Button>
			)}

			{error && <Error>{error}</Error>}
			{success && <Success>{success}</Success>}
		</Form>
	);
}

/* ========== Styled ========== */

const Form = styled.form`
	display: grid;
	gap: 1rem;
`;

const FormTitle = styled.h2`
	margin: 0 0 0.25rem 0;
	font-size: clamp(1.25rem, 2.5vw, 1.6rem);
	color: ${({ theme }) => theme.colors?.accent || '#00FFFF'};
	letter-spacing: 0.3px;
`;

const Field = styled.div`
	display: grid;
	gap: 0.5rem;
`;

const Label = styled.label`
	font-weight: 600;
	opacity: 0.92;
`;

const PrettyInput = styled.input`
	width: 100%;
	padding: 0.9rem 1rem;
	border-radius: 12px;
	border: 1px solid ${({ theme }) => theme.colors?.stroke || 'rgba(255,255,255,0.18)'};
	background: ${({ theme }) => theme.colors?.card || 'rgba(255,255,255,0.06)'};
	color: ${({ theme }) => theme.colors?.text || '#fff'};
	outline: none;
	transition: box-shadow 0.2s ease, transform 0.08s ease, border-color 0.2s ease;

	&:focus {
		transform: translateY(-1px);
		border-color: ${({ theme }) => theme.colors?.accent || '#00FFFF'};
		box-shadow: 0 0 0 6px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0,255,255,0.14)' : 'rgba(46,204,154,0.18)')};
	}
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors?.stroke || "rgba(255,255,255,0.18)"};
  background: ${({ theme }) => theme.colors?.card || "rgba(255,255,255,0.08)"};
  color: ${({ theme }) => theme.colors?.text || "#fff"};
  font-size: 1rem;
  font-weight: 500;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    background: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(0,255,255,0.08)"
        : "rgba(0,0,0,0.05)"};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors?.accent || "#00FFFF"};
    box-shadow: 0 0 0 6px
      ${({ theme }) =>
        theme.mode === "dark"
          ? "rgba(0,255,255,0.14)"
          : "rgba(46,204,154,0.18)"};
  }

  option {
    font-size: 0.90rem;
    border-radius: 10px;
    padding: 0.6rem;
    color: ${({ theme }) =>
      theme.mode === "dark"
        ? theme.colors?.text || "#fff"
        : theme.colors?.text || "#000"};
    background: ${({ theme }) =>
      theme.mode === "dark"
        ? theme.colors?.background || "#0B0F18"
        : theme.colors?.background || "#fff"};
  }
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 1rem;
	border-radius: 12px;
	border: 1px solid ${({ theme }) => theme.colors?.stroke || 'rgba(255,255,255,0.18)'};
	background: ${({ theme }) => theme.colors?.card || 'rgba(255,255,255,0.06)'};
	color: ${({ theme }) => theme.colors?.text || '#fff'};
	outline: none;
	resize: vertical;

	&:focus {
		border-color: ${({ theme }) => theme.colors?.accent || '#00FFFF'};
		box-shadow: 0 0 0 6px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0,255,255,0.14)' : 'rgba(46,204,154,0.18)')};
	}
`;

const Button = styled.button`
	padding: 0.9rem 2rem;
	background: ${({ theme }) => theme.colors?.accent || '#00FFFF'};
	color: ${({ theme }) => theme.colors?.background || '#0B0F18'};
	border: none;
	border-radius: 14px;
	font-weight: 800;
	letter-spacing: 0.3px;
	cursor: pointer;
	transition: transform 0.08s ease, box-shadow 0.2s ease, opacity 0.2s ease;

	&:hover:not([disabled]) {
		transform: translateY(-1px);
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.25);
	}

	&[disabled],
	&[aria-disabled='true'] {
		opacity: 0.6;
		cursor: not-allowed;
		box-shadow: none;
	}
`;

const Hint = styled.div`
	font-size: 0.85rem;
	opacity: 0.8;
`;

const BadHint = styled.span`
	color: #ff335a;
	font-weight: 600;
`;

const Error = styled.p`
	color: #ff335a;
	font-size: 0.95rem;
	margin-top: 0.25rem;
`;

const Success = styled.p`
	color: #2ecc71;
	font-size: 0.95rem;
	margin-top: 0.25rem;
`;
