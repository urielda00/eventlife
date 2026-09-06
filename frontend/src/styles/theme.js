// src/styles/theme.js
// Neon Ice theme tokens

const BASE = {
  accent: "#00FFFF",
  darkNavy: "#0B0F18",
  lightBg: "#F7F9FC",
};

export const lightTheme = {
  mode: "light",
  colors: {
    bg: "#FAFBF9",               
    background: "#FAFBF9",
    card: "#FFFFFF",
    text: "#1F2530",
    subtext: "#5E6B7E",
    accent: "#59C3A5",            // mint sage
    border: "rgba(0,0,0,0.06)",
    onAccent: "#0B0F18",
    button: {
      bg: "rgba(89,195,165,0.10)",
      text: "#0B0F18",
      border: "#59C3A5",
      bgHover: "#59C3A5",
      textHover: "#0B0F18",
    },
    pill: { bg: "#59C3A5", text: "#0B0F18", border: "transparent" },
  },
  shadows: { card: "0 6px 18px rgba(25, 55, 45, 0.06)" },
  radius: { xl: "1rem", "2xl": "1.25rem" },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    bg: BASE.darkNavy,
    background: BASE.darkNavy, // alias for existing uses
    card: "rgba(255,255,255,0.06)",
    text: "#FFFFFF",
    subtext: "rgba(255,255,255,0.75)",
    accent: BASE.accent,
    border: "rgba(255,255,255,0.08)",

    // readable text on accent backgrounds
    onAccent: BASE.darkNavy,

    button: {
      bg: "rgba(0,255,255,0.10)",
      text: BASE.darkNavy,
      border: BASE.accent,
      bgHover: BASE.accent,
      textHover: BASE.darkNavy,
    },

    pill: {
      bg: BASE.accent,
      text: BASE.darkNavy,
      border: "transparent",
    },
  },
  shadows: {
    card: "0 8px 30px rgba(0,0,0,0.5)",
  },
  radius: {
    xl: "1rem",
    "2xl": "1.25rem",
  },
};
