// src/hooks/useEventsWithFilters.js
import { useState, useMemo } from "react";

export function useEventsWithFilters(events = []) {
  const [activeTab, setActiveTab] = useState("All");
  const [openPanel, setOpenPanel] = useState(false);
  const [filters, setFilters] = useState({
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

  /* ---------------------- Helpers ---------------------- */
  const getStartDateISO = (ev) => ev.date || "";
  const getStartTime = (ev) => ev.time || "";
  const getPrice = (ev) => Number(ev.price) || 0;
  const getCity = (ev) => ev.location || "";
  const getTags = (ev) =>
    Array.isArray(ev.tags)
      ? ev.tags.map((s) => String(s).trim().toLowerCase())
      : [];
  const getType = (ev) => ev.eventType || "";
  const toDate = (iso) => (iso ? new Date(iso) : null);
  const mergeDateTime = (dISO, tHHmm) => {
    if (!dISO) return null;
    if (!tHHmm) return new Date(dISO);
    return new Date(`${dISO}T${tHHmm}:00`);
  };

  /* ---------------------- Filters count ---------------------- */
  const activeFiltersCount = useMemo(() => {
    let c = 0;
    if (filters.query.trim()) c++;
    if (filters.types.size) c++;
    if (activeTab !== "All") c++;
    if (filters.dateFrom || filters.dateTo) c++;
    if (filters.timeFrom || filters.timeTo) c++;
    if (filters.city.trim()) c++;
    if (filters.isFree) c++;
    if (filters.priceMin || filters.priceMax) c++;
    if (filters.tagsText.trim()) c++;
    if (filters.sort !== "dateAsc") c++;
    return c;
  }, [filters, activeTab]);

  /* ------------------------- Filtering + Sorting ----------------------- */
  const filtered = useMemo(() => {
    const tagsWanted = filters.tagsText
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const typesSet = new Set(filters.types);
    if (activeTab !== "All") typesSet.add(activeTab);

    const df = filters.dateFrom ? toDate(filters.dateFrom) : null;
    const dt = filters.dateTo ? toDate(filters.dateTo) : null;
    const tf = filters.timeFrom || null;
    const tt = filters.timeTo || null;

    const q = filters.query.trim().toLowerCase();
    const cityNeedle = filters.city.trim().toLowerCase();

    const pMin = filters.priceMin !== "" ? Number(filters.priceMin) : null;
    const pMax = filters.priceMax !== "" ? Number(filters.priceMax) : null;

    let arr = events.filter((ev) => {
      if (typesSet.size && !typesSet.has(getType(ev))) return false;

      const evDate = toDate(getStartDateISO(ev));
      if (df && (!evDate || evDate < df)) return false;
      if (dt && (!evDate || evDate > dt)) return false;

      if (tf || tt) {
        const evTime = getStartTime(ev);
        if (!evTime) return false;
        if (tf && evTime < tf) return false;
        if (tt && evTime > tt) return false;
      }

      if (cityNeedle) {
        if (!getCity(ev).toLowerCase().includes(cityNeedle)) return false;
      }

      const price = getPrice(ev);
      if (filters.isFree && price > 0) return false;
      if (pMin !== null && price < pMin) return false;
      if (pMax !== null && price > pMax) return false;

      if (tagsWanted.length) {
        const evTags = getTags(ev);
        const hasAll = tagsWanted.every((t) => evTags.includes(t));
        if (!hasAll) return false;
      }

      if (q) {
        const hay = [
          ev.title,
          ev.description,
          getCity(ev),
          getType(ev),
          ...(getTags(ev) || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    arr.sort((a, b) => {
      const aDate = mergeDateTime(getStartDateISO(a), getStartTime(a));
      const bDate = mergeDateTime(getStartDateISO(b), getStartTime(b));
      const aPrice = getPrice(a);
      const bPrice = getPrice(b);
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();

      switch (filters.sort) {
        case "dateAsc":
          return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
        case "dateDesc":
          return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
        case "priceAsc":
          return aPrice - bPrice;
        case "priceDesc":
          return bPrice - aPrice;
        case "title":
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });

    return arr;
  }, [events, filters, activeTab]);

  return {
    filtered,
    filteredCount: filtered.length,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    activeFiltersCount,
    openPanel,
    setOpenPanel,
  };
}
