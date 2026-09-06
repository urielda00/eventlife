import { useState, useEffect } from "react";
import { fetchEvents } from "../services/eventService";

/**
 * Custom hook to fetch and filter user-related events
 * @param {string|number|null} userId - The logged-in user's ID
 * @param {string|null} username - The logged-in user's username (לבדיקת participants)
 * @returns {{
 *   allEvents: Array,
 *   createdEvents: Array,
 *   joinedEvents: Array,
 *   upcomingEvents: Array,
 *   loading: boolean,
 *   error: string|null
 * }}
 */
export default function useUserEvents(userId, username) {
  const [allEvents, setAllEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId && !username) {
      setAllEvents([]);
      setCreatedEvents([]);
      setJoinedEvents([]);
      setUpcomingEvents([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const events = await fetchEvents();

        const now = new Date();

        const created = events.filter((e) => e.ownerId === userId);
        const joined = events.filter((e) =>
          e.participants?.some((p) => p === username || p?.id === userId)
        );
        const upcoming = events.filter(
          (e) => e.date && new Date(e.date) > now
        );

        setAllEvents(events);
        setCreatedEvents(created);
        setJoinedEvents(joined);
        setUpcomingEvents(upcoming);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    return () => controller.abort();
  }, [userId, username]);

  return { allEvents, createdEvents, joinedEvents, upcomingEvents, loading, error };
}