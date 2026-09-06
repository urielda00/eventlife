import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchEventsPaged } from "../services/eventService";

const EventContext = createContext(null);

const SERVER_PAGE_SIZE = 6;

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreFromServer = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const data = await fetchEventsPaged(page, SERVER_PAGE_SIZE);

      if (Array.isArray(data) && data.length > 0) {
        setEvents((prevEvents) => {
          const existingIds = new Set(prevEvents.map((ev) => ev.id));
          const newEvents = data.filter((ev) => !existingIds.has(ev.id));
          return [...prevEvents, ...newEvents];
        });
        setPage((prevPage) => prevPage + 1);
        if (data.length < SERVER_PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Failed to fetch events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // This useEffect runs only ONCE to load the initial set of events.
  useEffect(() => {
    fetchMoreFromServer();
  }, []); // The empty array [] is crucial.

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        hasMore,
        fetchMoreFromServer,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);