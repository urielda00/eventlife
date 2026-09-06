import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import styled from "styled-components";
import EventCard from "../features/events/EventCard";
import EventsFilters from "../features/events/EventsFilters";
import EventSkeleton from "../components/skeletons/EventSkeleton";
import {
  Wrapper,
  HeaderArea,
  Title,
  SubTitle,
  GridBackground,
  Grid,
  EmptyMsg,
  BackToTop,
  ActiveFiltersBar,
  FiltersList,
  ChipSummary as Chip,
  RemoveBtn,
  ClearBtn,
} from "../styles/events/EventsStyles";
import { useEvents } from "../context/EventContext";
import { useEventsWithFilters } from "../hooks/useEventsWithFilters";
import { motion ,AnimatePresence } from "framer-motion";

const CLIENT_PAGE_SIZE = 6;

/* ====== Local styled controls (קומפקטיים) ====== */
const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  margin: 12px 0 18px;
`;

const SearchInput = styled.input.attrs({ type: "search", placeholder: "Search title, description, city, tags..." })`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  box-shadow: ${({ theme }) => theme.shadows.card};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(0,255,255,0.18);
  }

  &::placeholder {
    color: ${({ theme }) => theme.mode === "dark" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)"};
  }
`;

const FiltersBtn = styled.button`
  height: 44px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 22px rgba(0,255,255,0.18);
    background: ${({ theme }) => theme.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

const Badge = styled.span`
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.accent};
  color: #0B0F18;
`;

/* ====== Component ====== */
const Events = () => {
  const { events, fetchMoreFromServer, loading, error } = useEvents();

  const [visibleCount, setVisibleCount] = useState(CLIENT_PAGE_SIZE);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const {
    filtered,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    activeFiltersCount,
    openPanel,
    setOpenPanel,
  } = useEventsWithFilters(events);

  const hasActiveFilters = activeFiltersCount > 0;

  const toRender = useMemo(() => {
    return hasActiveFilters
      ? filtered.slice(0, visibleCount)
      : events.slice(0, visibleCount);
  }, [hasActiveFilters, filtered, events, visibleCount]);

  const observer = useRef();
  const lastEventRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + CLIENT_PAGE_SIZE);

          if (!hasActiveFilters) {
            fetchMoreFromServer();
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchMoreFromServer, hasActiveFilters]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <Wrapper>
        <Title>All Events</Title>
        <p style={{ color: "red" }}>{error}</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HeaderArea>
        <Title>All Events</Title>
        <SubTitle>
          Browse and filter events. {toRender.length}/{events.length} shown.
        </SubTitle>
      </HeaderArea>

      {/* רק חיפוש + כפתור Filters */}
      <ControlsRow>
        <SearchInput
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          aria-label="Search events"
        />
        <FiltersBtn
          type="button"
          onClick={() => setOpenPanel(true)}
          aria-haspopup="dialog"
          aria-expanded={openPanel}
          aria-controls="events-filters-panel"
          title="Open filters"
        >
          <span role="img" aria-label="filters">⚙️</span>
          Filters
          {activeFiltersCount > 0 && <Badge>{activeFiltersCount}</Badge>}
        </FiltersBtn>
      </ControlsRow>

      {/* מציגים את הפאנל רק כשנפתח */}
      {openPanel && (
        <EventsFilters
          id="events-filters-panel"
          filters={filters}
          setFilters={setFilters}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeFiltersCount={activeFiltersCount}
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        />
      )}

      {/* צ'יפים של מסננים פעילים עם איקסים להסרה */}
      {hasActiveFilters && (
        <ActiveFiltersBar>
          <FiltersList>
            {filters.city && (
              <Chip>
                {filters.city}
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, city: "" }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.isFree && (
              <Chip>
                Free
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, isFree: false }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.priceMax && (
              <Chip>
                Max {filters.priceMax}₪
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, priceMax: "" }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.priceMin && (
              <Chip>
                Min {filters.priceMin}₪
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, priceMin: "" }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.dateFrom && (
              <Chip>
                {filters.dateTo
                  ? `${filters.dateFrom} → ${filters.dateTo}`
                  : `From ${filters.dateFrom}`}
                <RemoveBtn
                  onClick={() => setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" }))}
                >
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.tagsText && (
              <Chip>
                Tags: {filters.tagsText}
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, tagsText: "" }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {filters.query && (
              <Chip>
                Search: {filters.query}
                <RemoveBtn onClick={() => setFilters((f) => ({ ...f, query: "" }))}>
                  ✕
                </RemoveBtn>
              </Chip>
            )}
            {Array.from(filters.types).map((t) => (
              <Chip key={t}>
                {t}
                <RemoveBtn
                  onClick={() =>
                    setFilters((f) => {
                      const next = new Set(f.types);
                      next.delete(t);
                      return { ...f, types: next };
                    })
                  }
                >
                  ✕
                </RemoveBtn>
              </Chip>
            ))}
            {activeTab !== "All" && (
              <Chip>
                {activeTab}
                <RemoveBtn onClick={() => setActiveTab("All")}>✕</RemoveBtn>
              </Chip>
            )}
          </FiltersList>

          <ClearBtn
            type="button"
            onClick={() => {
              setFilters({
                query: "",
                types: new Set(),
                dateFrom: "",
                dateTo: "",
                timeFrom: "",
                timeTo: "",
                city: "",
                isFree: false,
                priceMin: "",
                priceMax: "",
                tagsText: "",
                sort: "dateAsc",
              });
              setActiveTab("All");
            }}
          >
            Clear All ✕
          </ClearBtn>
        </ActiveFiltersBar>
      )}

      <GridBackground>
        <Grid>
          {toRender.length === 0 && !loading ? (
            <EmptyMsg>No events match your filters.</EmptyMsg>
          ) : (
            toRender.map((event, i) => {
              if (i === toRender.length - 1) {
                return (
                  <div ref={lastEventRef} key={event.id}>
                    <EventCard {...event} />
                  </div>
                );
              }
              return <EventCard key={event.id} {...event} />;
            })
          )}

          {loading && [...Array(3)].map((_, i) => (
            <EventSkeleton key={`s-${i}`} />
          ))}

          {!loading && !hasActiveFilters && visibleCount >= events.length && (
            <EmptyMsg>No more events</EmptyMsg>
          )}
        </Grid>
      </GridBackground>

      <AnimatePresence>
        {showTopBtn && (
          <motion.div
            key="backtotop"
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000 }}
          >
            <BackToTop onClick={scrollToTop} aria-label="Back to top">
              ↑
            </BackToTop>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default Events;
