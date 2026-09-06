import API from "./api";

const fallbackImages = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
  "/images/img9.jpg",
  "/images/img10.jpg",
  "/images/img11.jpg",
  "/images/img12.jpg",
  "/images/img13.jpg",
  "/images/img14.jpg",
];

const hashString = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const fallbackForId = (id) =>
  fallbackImages[hashString(String(id)) % fallbackImages.length];

const normalizeEvent = (ev = {}) => {
  const title = ev.title || ev.name || "Untitled Event";
  const participants = Array.isArray(ev.participants) ? ev.participants : [];
  const maxParticipants =
    Number.isFinite(ev.maxParticipants) && ev.maxParticipants > 0
      ? ev.maxParticipants
      : 0;
  const image =
    typeof ev.image === "string" && ev.image.trim() !== ""
      ? ev.image
      : fallbackForId(ev.id ?? title);

  return {
    id: ev.id ?? String(Math.random()).slice(2),
    title,
    description: ev.description || "",
    date: ev.date || "",
    location: ev.location || "",
    eventType: ev.eventType || "PUBLIC_PARTY",
    maxParticipants,
    ownerId: ev.ownerId ?? null,
    participants,
    image,
  };
};

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.resBody)) return data.resBody;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  return data?.resBody ?? data ?? [];
};

// ---------- Events ----------
export const fetchEvents = async () => {
  const res = await API.get("/events");
  const raw = unwrapList(res?.data);
  return (Array.isArray(raw) ? raw : []).map(normalizeEvent);
};

export const fetchEventById = async (id) => {
  const res = await API.get(`/events/${id}`);
  const raw = res?.data?.resBody ?? res?.data ?? {};
  return normalizeEvent(raw);
};

export const createEvent = async (payload) => {
  const res = await API.post("/events", payload);
  const raw = res?.data?.resBody ?? res?.data ?? {};
  return normalizeEvent(raw);
};

// ✅ שולחים גם username בבקשה
export const joinEvent = async (id, username) => {
  const res = await API.post(`/events/${id}/join`, { username });
  const raw = res?.data?.resBody ?? res?.data ?? {};
  return normalizeEvent(raw);
};

export const leaveEvent = async (id, username) => {
  const res = await API.post(`/events/${id}/leave`, { username });
  const raw = res?.data?.resBody ?? res?.data ?? {};
  return normalizeEvent(raw);
};

// ---------- User-specific Events ----------
export const fetchCreatedEvents = async (userId) => {
  const res = await API.get(`/users/${userId}/created-events`);
  const raw = unwrapList(res?.data);
  return (Array.isArray(raw) ? raw : []).map(normalizeEvent);
};

export const fetchJoinedEvents = async (userId) => {
  const res = await API.get(`/users/${userId}/joined-events`);
  const raw = unwrapList(res?.data);
  return (Array.isArray(raw) ? raw : []).map(normalizeEvent);
};

// ---------- Events (Paged) ----------
export const fetchEventsPaged = async (page = 0, size = 10) => {
  const res = await API.get(`/events/paged?page=${page}&size=${size}`);
  const raw = res?.data?.resBody ?? res?.data ?? [];
  return (Array.isArray(raw) ? raw : []).map(normalizeEvent);
};

